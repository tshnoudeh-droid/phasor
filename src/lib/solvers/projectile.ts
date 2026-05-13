import { z } from "zod";
import { solveRK4 } from "./rk4";
import type { SimulationResult, SliderConfig } from "@/types/simulation";

export const ProjectileParamSchema = z.object({
  launchSpeed: z.number().min(0).max(1000),
  launchAngle: z.number().min(0).max(90),
  initialHeight: z.number().min(0).max(1000),
  dragCoefficient: z.number().min(0).max(1),
  mass: z.number().min(0.001).max(1000),
  gravity: z.number().min(0.1).max(25),
  dt: z.number().min(0.0001).max(0.1),
});

export type ProjectileParams = z.infer<typeof ProjectileParamSchema>;

export const defaultParams: ProjectileParams = {
  launchSpeed: 20,
  launchAngle: 45,
  initialHeight: 0,
  dragCoefficient: 0,
  mass: 1,
  gravity: 9.81,
  dt: 0.01,
};

export const equationLatex =
  "\\ddot{x} = -\\frac{k}{m}v_x|v|, \\quad \\ddot{y} = -g - \\frac{k}{m}v_y|v|";

export const sliderConfig: SliderConfig[] = [
  { key: "launchSpeed", label: "v₀", unit: "m/s", min: 1, max: 100, step: 1 },
  { key: "launchAngle", label: "θ", unit: "°", min: 0, max: 90, step: 1 },
  { key: "initialHeight", label: "h", unit: "m", min: 0, max: 100, step: 1 },
  { key: "dragCoefficient", label: "k", unit: "kg/m", min: 0, max: 0.5, step: 0.01 },
];

export function solve(params: ProjectileParams): SimulationResult {
  const { launchSpeed, launchAngle, initialHeight, dragCoefficient, mass, gravity, dt } =
    ProjectileParamSchema.parse(params);

  const angleRad = (launchAngle * Math.PI) / 180;
  const vx0 = launchSpeed * Math.cos(angleRad);
  const vy0 = launchSpeed * Math.sin(angleRad);

  // state: [x, y, vx, vy]
  const ode = (_t: number, y: number[]) => {
    const vx = y[2];
    const vy = y[3];
    const speed = Math.sqrt(vx * vx + vy * vy);
    const drag = dragCoefficient / mass;
    return [vx, vy, -drag * speed * vx, -gravity - drag * speed * vy];
  };

  // Estimate max duration (time of flight without drag)
  const tof = vy0 > 0
    ? (vy0 + Math.sqrt(vy0 * vy0 + 2 * gravity * initialHeight)) / gravity
    : Math.sqrt(2 * initialHeight / gravity) || 10;
  const duration = Math.min(tof * 2, 60);

  const rawStates = solveRK4(ode, [0, initialHeight, vx0, vy0], 0, duration, dt);

  // Trim to when projectile hits ground (y <= 0)
  let landIdx = rawStates.findIndex((s, i) => i > 0 && s.y[1] <= 0);
  if (landIdx === -1) landIdx = rawStates.length;
  const states = rawStates.slice(0, Math.max(landIdx + 1, 2));

  const maxHeight = Math.max(...states.map((s) => s.y[1]));
  const range = states[states.length - 1].y[0];
  const timeOfFlight = states[states.length - 1].t;

  return {
    states,
    metrics: { maxHeight, range, timeOfFlight },
    systemType: "projectile",
    parameters: params as Record<string, number>,
  };
}
