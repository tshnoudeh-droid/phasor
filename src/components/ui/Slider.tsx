"use client";

interface Props {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export default function Slider({ label, unit, min, max, step, value, onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-3 py-1">
      <span
        className="text-phasor-muted font-mono text-xs w-6 shrink-0"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {label}
      </span>
      <div className="relative flex-1 h-5 flex items-center">
        <div className="absolute w-full h-px bg-phasor-border" />
        <div
          className="absolute h-px bg-phasor-trace"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="relative w-full appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-phasor-electric
            [&::-webkit-slider-thumb]:shadow-[0_0_6px_#38BDF8]
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-phasor-electric
            [&::-moz-range-thumb]:border-none"
        />
      </div>
      <span
        className="text-phasor-snow font-mono text-xs w-20 text-right shrink-0 tabular-nums"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {value.toFixed(step < 0.01 ? 4 : step < 0.1 ? 3 : step < 1 ? 2 : 1)}{" "}
        <span className="text-phasor-muted">{unit}</span>
      </span>
    </div>
  );
}
