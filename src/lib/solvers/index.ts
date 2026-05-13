import * as springMass from "./springMass";
import * as pendulum from "./pendulum";
import * as projectile from "./projectile";
import * as pid from "./pid";
import * as rcCircuit from "./rcCircuit";
import type { SystemType } from "@/types/simulation";

export const solvers = {
  spring_mass: springMass,
  pendulum,
  projectile,
  pid,
  rc_circuit: rcCircuit,
} as const;

export type SolverKey = keyof typeof solvers;

export function getSolver(systemType: SystemType) {
  if (systemType === "unknown") return null;
  return solvers[systemType] ?? null;
}

export { springMass, pendulum, projectile, pid, rcCircuit };
