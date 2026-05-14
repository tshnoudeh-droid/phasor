import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "phasor — physics, simulated",
  description: "Describe any physical system in plain English. Watch it run.",
  viewport: "width=device-width, initial-scale=1",
};

// Hardcoded theme-init script — no user input, safe
const themeInitScript = `
(function(){
  var t = localStorage.getItem('phasor-theme');
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col bg-phasor-void text-phasor-snow">
          <Script id="theme-init" strategy="beforeInteractive">
            {themeInitScript}
          </Script>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
