import { z } from "zod";
import { solveRK4 } from "./rk4";
import type { SimulationResult, SliderConfig } from "@/types/simulation";

export const PIDParamSchema = z.object({
  Kp: z.number().min(0).max(1000),
  Ki: z.number().min(0).max(1000),
  Kd: z.number().min(0).max(1000),
  setpoint: z.number().min(-100).max(100),
  plantMass: z.number().min(0.001).max(1000),
  plantDamping: z.number().min(0).max(1000),
  plantSpring: z.number().min(0).max(1000),
  duration: z.number().min(0.1).max(60),
  dt: z.number().min(0.0001).max(0.1),
});

export type PIDParams = z.infer<typeof PIDParamSchema>;

export const defaultParams: PIDParams = {
  Kp: 10,
  Ki: 5,
  Kd: 2,
  setpoint: 1,
  plantMass: 1,
  plantDamping: 1,
  plantSpring: 0,
  duration: 10,
  dt: 0.005,
};

export const equationLatex =
  "u(t) = K_p e + K_i \\int e\\,dt + K_d \\dot{e}";

export const sliderConfig: SliderConfig[] = [
  { key: "Kp", label: "Kp", unit: "", min: 0, max: 50, step: 0.5 },
  { key: "Ki", label: "Ki", unit: "", min: 0, max: 50, step: 0.5 },
  { key: "Kd", label: "Kd", unit: "", min: 0, max: 20, step: 0.1 },
  { key: "setpoint", label: "r", unit: "", min: -10, max: 10, step: 0.5 },
];

export function solve(params: PIDParams): SimulationResult {
  const { Kp, Ki, Kd, setpoint, plantMass, plantDamping, plantSpring, duration, dt } =
    PIDParamSchema.parse(params);

  // state: [x, x', integral_of_error, prev_error]
  // Plant: m*x'' + b*x' + k*x = u
  const ode = (_t: number, y: number[]) => {
    const pos = y[0];
    const vel = y[1];
    const integral = y[2];
    const error = setpoint - pos;
    const u = Kp * error + Ki * integral + Kd * (-vel);
    const accel = (u - plantDamping * vel - plantSpring * pos) / plantMass;
    return [vel, accel, error, 0];
  };

  const states = solveRK4(ode, [0, 0, 0, setpoint - 0], 0, duration, dt);

  const finalPos = states[states.length - 1].y[0];
  const steadyStateError = Math.abs(setpoint - finalPos);

  const maxPos = Math.max(...states.map((s) => s.y[0]));
  const overshoot = setpoint !== 0 ? Math.max(0, (maxPos - setpoint) / Math.abs(setpoint)) * 100 : 0;

  // 2% settling time
  let settlingTime: number | undefined;
  const band = 0.02 * Math.abs(setpoint || 1);
  for (let i = states.length - 1; i >= 0; i--) {
    if (Math.abs(states[i].y[0] - setpoint) > band) {
      settlingTime = states[i].t;
      break;
    }
  }

  return {
    states,
    metrics: { steadyStateError, overshoot, settlingTime },
    systemType: "pid",
    parameters: params as Record<string, number>,
  };
}
