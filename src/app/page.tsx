import Link from "next/link";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const EXAMPLES = [
  {
    label: "Spring-mass-damper",
    equation: "m\\ddot{x} + b\\dot{x} + kx = 0",
    prompt: "Spring with k=25 N/m, mass=1 kg, damping=1.5, released from 1 m",
    desc: "Oscillation, damping, natural frequency",
  },
  {
    label: "Pendulum",
    equation: "\\ddot{\\theta} = -\\frac{g}{L}\\sin(\\theta)",
    prompt: "Pendulum with 0.8 m arm released from 45°",
    desc: "Nonlinear dynamics, period, amplitude decay",
  },
  {
    label: "RC circuit",
    equation: "RC\\,\\frac{dV_C}{dt} + V_C = V_{in}",
    prompt: "RC circuit: R=1kΩ, C=1mF, charging to 5V",
    desc: "Time constant, exponential charge/discharge",
  },
  {
    label: "Projectile motion",
    equation: "\\ddot{y} = -g,\\quad \\ddot{x} = 0",
    prompt: "Projectile at 45° with launch speed 25 m/s",
    desc: "Range, max height, time of flight",
  },
  {
    label: "PID controller",
    equation: "u = K_p e + K_i \\int e\\,dt + K_d \\dot{e}",
    prompt: "PID controller: Kp=10, Ki=5, Kd=2, setpoint=1",
    desc: "Overshoot, settling time, steady-state error",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-phasor-void text-phasor-snow transition-colors duration-200">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        <p className="text-phasor-muted text-xs font-mono tracking-[0.3em] uppercase mb-8">
          browser-native physics engine
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-phasor-snow max-w-2xl leading-tight mb-5">
          Describe any physical system.{" "}
          <span className="text-phasor-electric">Watch it run.</span>
        </h1>
        <p className="text-phasor-muted text-base max-w-md leading-relaxed mb-10">
          Type a scenario in plain English. An RK4 solver runs the physics entirely in your browser.
          Groq explains what you&apos;re seeing — not what it guesses.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/sim"
            className="px-7 py-2.5 bg-phasor-electric text-phasor-void text-sm font-medium tracking-wide
              hover:opacity-90 transition-opacity duration-150"
          >
            Try phasor →
          </Link>
          <a
            href="https://github.com/tshnoudeh-droid/phasor"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-2.5 border border-phasor-border text-phasor-muted text-sm
              hover:border-phasor-electric hover:text-phasor-snow transition-colors duration-150"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Example cards */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-phasor-muted text-xs font-mono uppercase tracking-[0.2em] mb-6 text-center">
            5 supported systems
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXAMPLES.map((ex) => (
              <Link
                key={ex.label}
                href={`/sim?q=${encodeURIComponent(ex.prompt)}`}
                className="flex flex-col gap-3 p-5 bg-phasor-surface border border-phasor-border
                  hover:border-phasor-electric transition-all duration-150 group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-phasor-muted text-xs font-mono uppercase tracking-wider group-hover:text-phasor-electric transition-colors duration-150">
                    {ex.label}
                  </p>
                  <span className="text-phasor-border text-xs group-hover:text-phasor-electric transition-colors duration-150">
                    →
                  </span>
                </div>
                <div className="text-phasor-snow overflow-x-auto py-1">
                  <BlockMath math={ex.equation} />
                </div>
                <p className="text-phasor-muted text-xs mt-auto leading-relaxed">
                  {ex.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
