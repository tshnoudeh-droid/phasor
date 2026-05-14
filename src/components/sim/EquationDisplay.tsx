"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import type { SolverMetrics, SystemType } from "@/types/simulation";

interface Props {
  equationLatex: string;
  systemType: SystemType;
  parameters: Record<string, number>;
  metrics: SolverMetrics;
}

const systemLabels: Record<string, string> = {
  spring_mass: "Spring-Mass-Damper",
  pendulum: "Pendulum",
  projectile: "Projectile",
  pid: "PID Controller",
  rc_circuit: "RC Circuit",
};

export default function EquationDisplay({ equationLatex, systemType, parameters, metrics }: Props) {
  return (
    <div className="h-full flex flex-col gap-4 p-3.5 overflow-y-auto">
      <div className="text-phasor-electric text-xs font-mono uppercase tracking-widest animate-fade-in">
        {systemLabels[systemType] ?? systemType}
      </div>

      <div className="text-phasor-snow text-sm overflow-x-auto animate-fade-in" style={{ animationDelay: "40ms" }}>
        <BlockMath math={equationLatex} />
      </div>

      <div className="border-t border-phasor-border pt-3 flex flex-col gap-2 animate-slide-up" style={{ animationDelay: "80ms" }}>
        {Object.entries(parameters)
          .filter(([k]) => !["duration", "dt"].includes(k))
          .slice(0, 6)
          .map(([key, val]) => (
            <div key={key} className="flex justify-between text-xs font-mono">
              <span className="text-phasor-muted">{formatKey(key)}</span>
              <span className="text-phasor-snow tabular-nums">
                {typeof val === "number" ? formatNum(val) : String(val)}
              </span>
            </div>
          ))}
      </div>

      {Object.keys(metrics).length > 0 && (
        <div className="border-t border-phasor-border pt-3 flex flex-col gap-2 animate-slide-up" style={{ animationDelay: "120ms" }}>
          <div className="text-phasor-muted text-xs font-mono uppercase tracking-widest mb-0.5">
            metrics
          </div>
          {metrics.naturalFrequency !== undefined && (
            <MetricRow label="ωₙ" value={`${metrics.naturalFrequency.toFixed(3)} rad/s`} />
          )}
          {metrics.dampingRatio !== undefined && (
            <MetricRow
              label="ζ"
              value={`${metrics.dampingRatio.toFixed(3)} ${dampingLabel(metrics.dampingRatio)}`}
            />
          )}
          {metrics.period !== undefined && (
            <MetricRow label="T" value={`${metrics.period.toFixed(3)} s`} />
          )}
          {metrics.settlingTime !== undefined && (
            <MetricRow label="tₛ" value={`${metrics.settlingTime.toFixed(2)} s`} />
          )}
          {metrics.maxAmplitude !== undefined && (
            <MetricRow label="max|x|" value={metrics.maxAmplitude.toFixed(3)} />
          )}
          {metrics.timeConstant !== undefined && (
            <MetricRow label="τ" value={`${metrics.timeConstant.toFixed(4)} s`} />
          )}
          {metrics.maxHeight !== undefined && (
            <MetricRow label="max h" value={`${metrics.maxHeight.toFixed(2)} m`} />
          )}
          {metrics.range !== undefined && (
            <MetricRow label="range" value={`${metrics.range.toFixed(2)} m`} />
          )}
          {metrics.overshoot !== undefined && (
            <MetricRow label="overshoot" value={`${metrics.overshoot.toFixed(1)}%`} />
          )}
          {metrics.steadyStateError !== undefined && (
            <MetricRow label="SSE" value={metrics.steadyStateError.toFixed(4)} />
          )}
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs font-mono">
      <span className="text-phasor-muted">{label}</span>
      <span className="text-phasor-electric tabular-nums">{value}</span>
    </div>
  );
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatNum(n: number): string {
  if (Math.abs(n) >= 1000) return n.toFixed(0);
  if (Math.abs(n) >= 10) return n.toFixed(2);
  if (Math.abs(n) >= 0.01) return n.toFixed(4);
  return n.toExponential(2);
}

function dampingLabel(zeta: number): string {
  if (zeta < 1) return "(underdamped)";
  if (zeta === 1) return "(critical)";
  return "(overdamped)";
}
