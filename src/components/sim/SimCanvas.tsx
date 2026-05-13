"use client";

import { useEffect, useRef, useCallback } from "react";
import type { ODEState } from "@/lib/solvers/rk4";
import type { SystemType } from "@/types/simulation";

interface Props {
  states: ODEState[];
  systemType: SystemType;
  width?: number;
  height?: number;
}

const VOID = "#080B12";
const SURFACE = "#0D1117";
const BORDER = "#1E2435";
const TRACE = "#0EA5E9";
const ELECTRIC = "#38BDF8";
const MUTED = "#64748B";

export default function SimCanvas({ states, systemType, width = 600, height = 300 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, frameIdx: number) => {
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = SURFACE;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = BORDER;
      ctx.lineWidth = 1;
      const gridCols = 8;
      const gridRows = 4;
      for (let i = 1; i < gridCols; i++) {
        ctx.beginPath();
        ctx.moveTo((w / gridCols) * i, 0);
        ctx.lineTo((w / gridCols) * i, h);
        ctx.stroke();
      }
      for (let i = 1; i < gridRows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / gridRows) * i);
        ctx.lineTo(w, (h / gridRows) * i);
        ctx.stroke();
      }

      if (states.length === 0) return;

      // Determine what to plot based on system type
      const getPlotValue = (s: ODEState): number => {
        switch (systemType) {
          case "spring_mass":
            return s.y[0]; // position
          case "pendulum":
            return s.y[0]; // angle
          case "projectile":
            return s.y[1]; // y position
          case "pid":
            return s.y[0]; // output position
          case "rc_circuit":
            return s.y[0]; // voltage
          default:
            return s.y[0];
        }
      };

      const values = states.map(getPlotValue);
      const tValues = states.map((s) => s.t);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const valRange = maxVal - minVal || 1;
      const tRange = tValues[tValues.length - 1] - tValues[0] || 1;

      const toX = (t: number) => ((t - tValues[0]) / tRange) * (w - 40) + 20;
      const toY = (v: number) => h - 20 - ((v - minVal) / valRange) * (h - 40);

      // Draw zero line if in range
      if (minVal <= 0 && maxVal >= 0) {
        const zeroY = toY(0);
        ctx.strokeStyle = MUTED;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(20, zeroY);
        ctx.lineTo(w - 20, zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw full trace (dim)
      ctx.strokeStyle = `${TRACE}44`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < states.length; i++) {
        const x = toX(tValues[i]);
        const y = toY(values[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw animated trace up to current frame
      const currentIdx = Math.min(frameIdx, states.length - 1);
      ctx.strokeStyle = TRACE;
      ctx.lineWidth = 2;
      ctx.shadowColor = ELECTRIC;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let i = 0; i <= currentIdx; i++) {
        const x = toX(tValues[i]);
        const y = toY(values[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving dot at current position
      if (currentIdx < states.length) {
        const dotX = toX(tValues[currentIdx]);
        const dotY = toY(values[currentIdx]);
        ctx.fillStyle = ELECTRIC;
        ctx.shadowColor = ELECTRIC;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // For projectile: also show x/y 2D path
      if (systemType === "projectile") {
        drawProjectile2D(ctx, w, h, states, currentIdx);
      }

      // For pendulum: draw pendulum arm
      if (systemType === "pendulum") {
        drawPendulumArm(ctx, w, h, states, currentIdx);
      }

      // For spring-mass: draw mass on spring
      if (systemType === "spring_mass") {
        drawSpringMass(ctx, w, h, states, currentIdx, minVal, maxVal);
      }
    },
    [states, systemType]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    frameRef.current = 0;

    const animate = () => {
      drawFrame(ctx, w, h, frameRef.current);

      if (frameRef.current < states.length - 1) {
        // Advance multiple frames per tick for long simulations
        const step = Math.max(1, Math.floor(states.length / (60 * 10)));
        frameRef.current = Math.min(frameRef.current + step, states.length - 1);
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Loop after short pause
        setTimeout(() => {
          frameRef.current = 0;
          rafRef.current = requestAnimationFrame(animate);
        }, 1200);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [states, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full"
      style={{ background: VOID, display: "block" }}
    />
  );
}

function drawPendulumArm(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  states: ODEState[],
  idx: number
) {
  const pivotX = w * 0.75;
  const pivotY = 30;
  const armLen = Math.min(h * 0.35, 80);
  const angle = states[idx].y[0];

  const bobX = pivotX + armLen * Math.sin(angle);
  const bobY = pivotY + armLen * Math.cos(angle);

  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  ctx.fillStyle = ELECTRIC;
  ctx.shadowColor = ELECTRIC;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(bobX, bobY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = MUTED;
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpringMass(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  states: ODEState[],
  idx: number,
  minVal: number,
  maxVal: number
) {
  const valRange = maxVal - minVal || 1;
  const centerX = w * 0.8;
  const equilibriumY = h * 0.5;
  const scale = Math.min((h * 0.35) / Math.max(Math.abs(maxVal), Math.abs(minVal), 0.01), 60);

  const pos = states[idx].y[0];
  const massY = equilibriumY + pos * scale;

  // Spring coils
  const anchorY = 15;
  const coils = 8;
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX, anchorY);
  const springLen = massY - anchorY - 15;
  for (let i = 0; i <= coils * 4; i++) {
    const t = i / (coils * 4);
    const sx = centerX + (i % 2 === 0 ? 10 : -10) * Math.sin(t * Math.PI * coils * 2);
    const sy = anchorY + t * springLen;
    if (i === 0) ctx.moveTo(centerX, anchorY);
    else ctx.lineTo(sx, sy);
  }
  ctx.lineTo(centerX, massY - 15);
  ctx.stroke();

  // Mass block
  ctx.fillStyle = ELECTRIC;
  ctx.shadowColor = ELECTRIC;
  ctx.shadowBlur = 8;
  ctx.fillRect(centerX - 12, massY - 15, 24, 24);
  ctx.shadowBlur = 0;
}

function drawProjectile2D(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  states: ODEState[],
  idx: number
) {
  const panelX = w * 0.55;
  const panelW = w * 0.42;
  const panelH = h * 0.7;
  const panelY = h * 0.15;

  const xs = states.map((s) => s.y[0]);
  const ys = states.map((s) => s.y[1]);
  const maxX = Math.max(...xs, 1);
  const maxY = Math.max(...ys, 1);

  const toTX = (x: number) => panelX + (x / maxX) * panelW;
  const toTY = (y: number) => panelY + panelH - (y / Math.max(maxY, 1)) * panelH;

  ctx.strokeStyle = `${TRACE}55`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < states.length; i++) {
    const px = toTX(xs[i]);
    const py = toTY(ys[i]);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Ball
  const bx = toTX(xs[idx]);
  const by = toTY(ys[idx]);
  ctx.fillStyle = ELECTRIC;
  ctx.shadowColor = ELECTRIC;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(bx, by, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ground line
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(panelX, panelY + panelH);
  ctx.lineTo(panelX + panelW, panelY + panelH);
  ctx.stroke();
}
