"use client";

import { useState, useCallback, useRef } from "react";
import { getSolver } from "@/lib/solvers";
import type { SimulationResult, SystemType } from "@/types/simulation";

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const run = useCallback((systemType: SystemType, parameters: Record<string, number>) => {
    const solver = getSolver(systemType);
    if (!solver) return null;

    try {
      const res = solver.solve(parameters as never);
      setResult(res);
      return res;
    } catch {
      return null;
    }
  }, []);

  const runDebounced = useCallback(
    (systemType: SystemType, parameters: Record<string, number>, delayMs = 100) => {
      clearTimeout(debounceRef.current);
      setIsRunning(true);
      debounceRef.current = setTimeout(() => {
        run(systemType, parameters);
        setIsRunning(false);
      }, delayMs);
    },
    [run]
  );

  return { result, isRunning, run, runDebounced };
}
