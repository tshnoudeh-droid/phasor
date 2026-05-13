"use client";

import Slider from "@/components/ui/Slider";
import type { SliderConfig } from "@/types/simulation";

interface Props {
  config: SliderConfig[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

export default function SliderPanel({ config, values, onChange }: Props) {
  if (config.length === 0) return null;

  return (
    <div className="px-3 py-2 border-t border-phasor-border">
      {config.map((c) => (
        <Slider
          key={c.key}
          label={c.label}
          unit={c.unit}
          min={c.min}
          max={c.max}
          step={c.step}
          value={values[c.key] ?? c.min}
          onChange={(v) => onChange(c.key, v)}
        />
      ))}
    </div>
  );
}
