import { z } from "zod";
import type { ODEState } from "@/lib/solvers/rk4";

export type SystemType =
  | "spring_mass"
  | "pendulum"
  | "projectile"
  | "pid"
  | "rc_circuit"
  | "unknown";

export interface SliderConfig {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface SolverMetrics {
  period?: number;
  dampingRatio?: number;
  settlingTime?: number;
  maxAmplitude?: number;
  naturalFrequency?: number;
  timeConstant?: number;
  maxHeight?: number;
  range?: number;
  timeOfFlight?: number;
  overshoot?: number;
  steadyStateError?: number;
}

export interface SimulationResult {
  states: ODEState[];
  metrics: SolverMetrics;
  systemType: SystemType;
  parameters: Record<string, number>;
}

export const SolverMetricsSchema = z.object({
  period: z.number().finite().optional(),
  dampingRatio: z.number().finite().optional(),
  settlingTime: z.number().finite().optional(),
  maxAmplitude: z.number().finite().optional(),
  naturalFrequency: z.number().finite().optional(),
  timeConstant: z.number().finite().optional(),
  maxHeight: z.number().finite().optional(),
  range: z.number().finite().optional(),
  timeOfFlight: z.number().finite().optional(),
  overshoot: z.number().finite().optional(),
  steadyStateError: z.number().finite().optional(),
});
