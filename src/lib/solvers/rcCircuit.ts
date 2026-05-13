import { z } from "zod";
import { solveRK4 } from "./rk4";
import type { SimulationResult, SliderConfig } from "@/types/simulation";

export const RCCircuitParamSchema = z.object({
  resistance: z.number().min(0.001).max(1e6),
  capacitance: z.number().min(1e-9).max(1),
  sourceVoltage: z.number().min(-1000).max(1000),
  initialVoltage: z.number().min(-1000).max(1000),
  duration: z.number().min(0.0001).max(60),
  dt: z.number().min(1e-7).max(0.1),
});

export type RCCircuitParams = z.infer<typeof RCCircuitParamSchema>;

export const defaultParams: RCCircuitParams = {
  resistance: 1000,
  capacitance: 0.001,
  sourceVoltage: 5,
  initialVoltage: 0,
  duration: 5,
  dt: 0.001,
};

export const equationLatex =
  "RC\\,\\frac{dV_C}{dt} + V_C = V_{in}";

export const sliderConfig: SliderConfig[] = [
  { key: "resistance", label: "R", unit: "Ω", min: 10, max: 10000, step: 10 },
  { key: "capacitance", label: "C", unit: "F", min: 0.0001, max: 0.01, step: 0.0001 },
  { key: "sourceVoltage", label: "Vᵢₙ", unit: "V", min: -12, max: 12, step: 0.5 },
  { key: "initialVoltage", label: "V₀", unit: "V", min: -12, max: 12, step: 0.5 },
];

export function solve(params: RCCircuitParams): SimulationResult {
  const { resistance, capacitance, sourceVoltage, initialVoltage, duration, dt } =
    RCCircuitParamSchema.parse(params);

  const tau = resistance * capacitance;

  // state: [V_C]
  const ode = (_t: number, y: number[]) => [
    (sourceVoltage - y[0]) / tau,
  ];

  const states = solveRK4(ode, [initialVoltage], 0, duration, dt);

  const timeConstant = tau;
  const maxAmplitude = Math.max(...states.map((s) => Math.abs(s.y[0])));

  return {
    states,
    metrics: { timeConstant, maxAmplitude },
    systemType: "rc_circuit",
    parameters: params as Record<string, number>,
  };
}
