export default function Footer() {
  return (
    <footer className="border-t border-phasor-border bg-phasor-void px-6 py-5 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-phasor-muted text-xs">
          built by{" "}
          <a
            href="https://tawficshnoudeh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-phasor-snow hover:text-phasor-electric transition-colors duration-200"
          >
            tawfic shnoudeh
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://tawficshnoudeh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-phasor-muted text-xs hover:text-phasor-snow transition-colors duration-200"
          >
            tawficshnoudeh.com
          </a>
          <span className="text-phasor-border select-none">·</span>
          <a
            href="https://linkedin.com/in/tawficshnoudeh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-phasor-muted text-xs hover:text-phasor-snow transition-colors duration-200"
          >
            linkedin
          </a>
        </div>
      </div>
    </footer>
  );
}
