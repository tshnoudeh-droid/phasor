import Link from "next/link";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const EXAMPLES = [
  {
    label: "Spring-mass-damper",
    equation: "m\\ddot{x} + b\\dot{x} + kx = 0",
    prompt: "Spring with k=25 N/m, mass=1 kg, damping=1.5, released from 1 m",
  },
  {
    label: "Pendulum",
    equation: "\\ddot{\\theta} = -\\frac{g}{L}\\sin(\\theta)",
    prompt: "Pendulum with 0.8 m arm released from 45°",
  },
  {
    label: "RC circuit",
    equation: "RC\\,\\frac{dV_C}{dt} + V_C = V_{in}",
    prompt: "RC circuit: R=1kΩ, C=1mF, charging to 5V",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-phasor-void text-phasor-snow">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-phasor-border">
        <span className="font-light tracking-widest lowercase text-lg">phasor</span>
        <Link
          href="/sim"
          className="text-sm text-phasor-muted hover:text-phasor-snow transition-colors"
        >
          simulator
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <p className="text-phasor-muted text-sm font-mono tracking-widest uppercase mb-6">
          physics simulation engine
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-phasor-snow max-w-2xl leading-tight mb-6">
          Describe any physical system.{" "}
          <span className="text-phasor-electric">Watch it run.</span>
        </h1>
        <p className="text-phasor-muted text-lg max-w-lg leading-relaxed mb-10">
          Type a scenario in plain English. An RK4 solver runs the physics in your browser.
          AI explains what you&apos;re seeing — not what it guesses.
        </p>
        <Link
          href="/sim"
          className="px-8 py-3 bg-phasor-electric text-phasor-void text-sm font-medium tracking-wide
            hover:bg-phasor-trace transition-colors"
        >
          Try phasor →
        </Link>
      </section>

      {/* Example cards */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-phasor-muted text-xs font-mono uppercase tracking-widest mb-6 text-center">
            supported systems
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXAMPLES.map((ex) => (
              <Link
                key={ex.label}
                href={`/sim?q=${encodeURIComponent(ex.prompt)}`}
                className="flex flex-col gap-4 p-5 bg-phasor-surface border border-phasor-border
                  hover:border-phasor-electric transition-colors group"
              >
                <p className="text-phasor-muted text-xs font-mono uppercase tracking-wider group-hover:text-phasor-electric transition-colors">
                  {ex.label}
                </p>
                <div className="text-phasor-snow overflow-x-auto">
                  <BlockMath math={ex.equation} />
                </div>
                <p className="text-phasor-muted text-xs mt-auto">try this →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-phasor-border px-6 py-5 text-center">
        <p className="text-phasor-muted text-xs">
          built by{" "}
          <a
            href="https://tawficshnoudeh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-phasor-snow hover:text-phasor-electric transition-colors"
          >
            tawfic
          </a>
        </p>
      </footer>
    </div>
  );
}
