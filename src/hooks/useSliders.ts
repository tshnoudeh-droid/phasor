"use client";

import { useState, useCallback } from "react";
import type { SystemType } from "@/types/simulation";
import { getSolver } from "@/lib/solvers";

export function useSliders(systemType: SystemType | null) {
  const [values, setValues] = useState<Record<string, number>>({});

  const initFromParams = useCallback((params: Record<string, number>) => {
    setValues(params);
  }, []);

  const onChange = useCallback(
    (
      key: string,
      value: number,
      onRerun: (params: Record<string, number>) => void
    ) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        onRerun(next);
        return next;
      });
    },
    []
  );

  const sliderConfig = systemType ? (getSolver(systemType)?.sliderConfig ?? []) : [];

  return { values, sliderConfig, initFromParams, onChange };
}
