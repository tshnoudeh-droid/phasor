"use client";

import Link from "next/link";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3.5 border-b border-phasor-border bg-phasor-void transition-colors duration-200">
      <Link
        href="/"
        className="text-phasor-snow font-light tracking-[0.2em] lowercase text-lg hover:text-phasor-electric transition-colors duration-150"
      >
        phasor
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/sim"
          className="text-phasor-muted text-sm hover:text-phasor-snow transition-colors duration-150"
        >
          simulator
        </Link>
        <ThemeToggle />
        <Show
          when="signed-in"
          fallback={
            <SignInButton mode="modal">
              <button className="text-phasor-muted text-sm hover:text-phasor-snow transition-colors duration-150 border border-phasor-border hover:border-phasor-electric px-3 py-1 rounded">
                sign in
              </button>
            </SignInButton>
          }
        >
          <UserButton
            appearance={{
              elements: { avatarBox: "w-7 h-7" },
            }}
          />
        </Show>
      </div>
    </nav>
  );
}
