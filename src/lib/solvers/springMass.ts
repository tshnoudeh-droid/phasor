import { z } from "zod";
import { solveRK4 } from "./rk4";
import type { SimulationResult, SliderConfig } from "@/types/simulation";

export const SpringMassParamSchema = z.object({
  mass: z.number().min(0.001).max(10000),
  springConstant: z.number().min(0.001).max(100000),
  damping: z.number().min(0).max(1000),
  initialDisplacement: z.number().min(-100).max(100),
  initialVelocity: z.number().min(-1000).max(1000),
  duration: z.number().min(0.1).max(60),
  dt: z.number().min(0.0001).max(0.1),
});

export type SpringMassParams = z.infer<typeof SpringMassParamSchema>;

export const defaultParams: SpringMassParams = {
  mass: 1.0,
  springConstant: 25.0,
  damping: 1.5,
  initialDisplacement: 1.0,
  initialVelocity: 0.0,
  duration: 10.0,
  dt: 0.01,
};

export const equationLatex =
  "m\\ddot{x} + b\\dot{x} + kx = 0";

export const sliderConfig: SliderConfig[] = [
  { key: "mass", label: "m", unit: "kg", min: 0.1, max: 10, step: 0.1 },
  { key: "springConstant", label: "k", unit: "N/m", min: 1, max: 100, step: 1 },
  { key: "damping", label: "b", unit: "N·s/m", min: 0, max: 20, step: 0.1 },
  { key: "initialDisplacement", label: "x₀", unit: "m", min: -5, max: 5, step: 0.1 },
  { key: "initialVelocity", label: "v₀", unit: "m/s", min: -10, max: 10, step: 0.1 },
];

export function solve(params: SpringMassParams): SimulationResult {
  const { mass, springConstant, damping, initialDisplacement, initialVelocity, duration, dt } =
    SpringMassParamSchema.parse(params);

  // state: [x, x']
  const ode = (_t: number, y: number[]) => [
    y[1],
    -(springConstant / mass) * y[0] - (damping / mass) * y[1],
  ];

  const states = solveRK4(ode, [initialDisplacement, initialVelocity], 0, duration, dt);

  const naturalFrequency = Math.sqrt(springConstant / mass);
  const dampingRatio = damping / (2 * Math.sqrt(springConstant * mass));
  const maxAmplitude = Math.max(...states.map((s) => Math.abs(s.y[0])));

  let settlingTime: number | undefined;
  const threshold = 0.02 * Math.abs(initialDisplacement || 1);
  for (let i = states.length - 1; i >= 0; i--) {
    if (Math.abs(states[i].y[0]) > threshold) {
      settlingTime = states[i].t;
      break;
    }
  }

  const period =
    dampingRatio < 1
      ? (2 * Math.PI) / (naturalFrequency * Math.sqrt(1 - dampingRatio ** 2))
      : undefined;

  return {
    states,
    metrics: { naturalFrequency, dampingRatio, maxAmplitude, settlingTime, period },
    systemType: "spring_mass",
    parameters: params as Record<string, number>,
  };
}
