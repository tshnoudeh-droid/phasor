import { z } from "zod";
import { solveRK4 } from "./rk4";
import type { SimulationResult, SliderConfig } from "@/types/simulation";

export const PendulumParamSchema = z.object({
  length: z.number().min(0.01).max(100),
  initialAngle: z.number().min(-Math.PI).max(Math.PI),
  damping: z.number().min(0).max(10),
  gravity: z.number().min(0.1).max(25),
  duration: z.number().min(0.1).max(60),
  dt: z.number().min(0.0001).max(0.1),
});

export type PendulumParams = z.infer<typeof PendulumParamSchema>;

export const defaultParams: PendulumParams = {
  length: 1.0,
  initialAngle: 0.5,
  damping: 0.1,
  gravity: 9.81,
  duration: 15.0,
  dt: 0.01,
};

export const equationLatex = "\\ddot{\\theta} = -\\frac{g}{L}\\sin(\\theta) - b\\dot{\\theta}";

export const sliderConfig: SliderConfig[] = [
  { key: "length", label: "L", unit: "m", min: 0.1, max: 5, step: 0.05 },
  { key: "initialAngle", label: "θ₀", unit: "rad", min: -3.1, max: 3.1, step: 0.05 },
  { key: "damping", label: "b", unit: "N·s/m", min: 0, max: 2, step: 0.01 },
  { key: "gravity", label: "g", unit: "m/s²", min: 1, max: 20, step: 0.1 },
];

export function solve(params: PendulumParams): SimulationResult {
  const { length, initialAngle, damping, gravity, duration, dt } =
    PendulumParamSchema.parse(params);

  // state: [θ, θ'] — nonlinear, no small-angle approximation
  const ode = (_t: number, y: number[]) => [
    y[1],
    -(gravity / length) * Math.sin(y[0]) - damping * y[1],
  ];

  const states = solveRK4(ode, [initialAngle, 0], 0, duration, dt);

  const maxAmplitude = Math.max(...states.map((s) => Math.abs(s.y[0])));

  // Estimate period from zero crossings
  let period: number | undefined;
  const crossings: number[] = [];
  for (let i = 1; i < states.length && crossings.length < 4; i++) {
    if (states[i - 1].y[0] * states[i].y[0] < 0 && states[i].y[1] < 0) {
      crossings.push(states[i].t);
    }
  }
  if (crossings.length >= 2) {
    period = 2 * (crossings[crossings.length - 1] - crossings[0]) / (crossings.length - 1);
  }

  const naturalFrequency = Math.sqrt(gravity / length);

  return {
    states,
    metrics: { period, maxAmplitude, naturalFrequency },
    systemType: "pendulum",
    parameters: params as Record<string, number>,
  };
}
