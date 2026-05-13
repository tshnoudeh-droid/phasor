import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-phasor-border">
      <Link
        href="/"
        className="text-phasor-snow font-light tracking-widest lowercase text-lg hover:text-phasor-electric transition-colors"
      >
        phasor
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/sim"
          className="text-phasor-muted text-sm hover:text-phasor-snow transition-colors"
        >
          simulator
        </Link>
      </div>
    </nav>
  );
}
