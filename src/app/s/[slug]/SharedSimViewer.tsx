"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import EquationDisplay from "@/components/sim/EquationDisplay";
import { getSolver } from "@/lib/solvers";
import type { SimulationResult, SystemType } from "@/types/simulation";

const SimCanvas = dynamic(() => import("@/components/sim/SimCanvas"), { ssr: false });

interface Props {
  systemType: SystemType;
  parameters: Record<string, number>;
  slug: string;
}

export default function SharedSimViewer({ systemType, parameters, slug }: Props) {
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const solver = getSolver(systemType);
    if (!solver) return;
    try {
      const merged = { ...solver.defaultParams, ...parameters };
      const res = solver.solve(merged as never);
      setResult(res);
    } catch {
      // solver failed with these params
    }
  }, [systemType, parameters]);

  const solver = getSolver(systemType);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://phasor.tawficshnoudeh.com";

  return (
    <div className="flex flex-col min-h-screen bg-phasor-void">
      {/* Minimal header */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-phasor-border">
        <Link
          href="/"
          className="text-phasor-snow font-light tracking-widest lowercase text-lg hover:text-phasor-electric transition-colors"
        >
          phasor
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-phasor-muted text-xs font-mono">{slug}</span>
          <Link
            href="/sim"
            className="text-sm text-phasor-electric hover:text-phasor-snow transition-colors"
          >
            try phasor →
          </Link>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Canvas */}
        <div className="flex-1 flex flex-col">
          {result ? (
            <SimCanvas
              states={result.states}
              systemType={result.systemType}
              width={800}
              height={400}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-phasor-surface text-phasor-muted text-sm">
              Loading simulation...
            </div>
          )}
        </div>

        {/* Equation panel */}
        {result && solver && (
          <div className="w-60 shrink-0 border-l border-phasor-border bg-phasor-surface">
            <EquationDisplay
              equationLatex={solver.equationLatex}
              systemType={result.systemType}
              parameters={result.parameters}
              metrics={result.metrics}
            />
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-phasor-border text-center">
        <p className="text-phasor-muted text-xs">
          Shared via{" "}
          <span className="text-phasor-snow font-mono">
            {appUrl}/s/{slug}
          </span>
          {" · "}
          <Link href="/sim" className="text-phasor-electric hover:underline">
            build your own simulation
          </Link>
        </p>
      </div>
    </div>
  );
}
