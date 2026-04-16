import React from "react";
import NewsletterForm from "./NewsletterForm";

interface TenantLayoutProps {
  tenantName: string;
  children: React.ReactNode;
  navItems?: { label: string; url: string }[];
}

export default function TenantLayout({
  tenantName,
  children,
  navItems = [],
}: TenantLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        color: "var(--theme-text)",
        backgroundColor: "var(--theme-background)",
        fontFamily: "var(--theme-font-body)",
      }}
    >
      {/* Header — fixed, transparent → frosted dark glass */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: "rgba(15, 15, 30, 0.25)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main header row */}
          <div className="py-5 flex items-center justify-center relative">
            {/* Nav links — left side (hidden on mobile) */}
            {navItems.length > 0 && (
              <nav className="hidden md:flex items-center gap-10 absolute left-0">
                {navItems.slice(0, Math.ceil(navItems.length / 2)).map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 hover:text-white transition-all duration-300 relative group"
                    style={{ fontFamily: "var(--theme-font-body)" }}
                  >
                    {item.label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-500"
                      style={{ backgroundColor: "var(--theme-accent)" }}
                    />
                  </a>
                ))}
              </nav>
            )}

            {/* Centered brand */}
            <div className="flex flex-col items-center">
              <a
                href="/"
                className="text-2xl md:text-3xl font-light tracking-[0.15em] text-white"
                style={{ fontFamily: "var(--theme-font-heading)" }}
              >
                {tenantName}
              </a>
              <div
                className="mt-2 w-8 h-px"
                style={{ backgroundColor: "var(--theme-accent)" }}
              />
            </div>

            {/* Nav links — right side (hidden on mobile) */}
            {navItems.length > 0 && (
              <nav className="hidden md:flex items-center gap-10 absolute right-0">
                {navItems.slice(Math.ceil(navItems.length / 2)).map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 hover:text-white transition-all duration-300 relative group"
                    style={{ fontFamily: "var(--theme-font-body)" }}
                  >
                    {item.label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-500"
                      style={{ backgroundColor: "var(--theme-accent)" }}
                    />
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer — dark navy with gold accent */}
      <footer style={{ backgroundColor: "#111827", color: "rgba(255,255,255,0.85)" }}>
        {/* Gold border top */}
        <div className="w-full h-px" style={{ backgroundColor: "var(--theme-accent)" }} />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Column 1: Brand */}
            <div>
              <h3
                className="text-2xl font-light tracking-[0.12em] mb-3"
                style={{ fontFamily: "var(--theme-font-heading)", color: "#ffffff" }}
              >
                {tenantName}
              </h3>
              <div
                className="w-10 h-px mb-6"
                style={{ backgroundColor: "var(--theme-accent)" }}
              />
              <p
                className="text-sm leading-relaxed opacity-60"
                style={{ fontFamily: "var(--theme-font-body)" }}
              >
                Where refined taste meets extraordinary destinations.
                Every journey is crafted with meticulous attention to detail,
                ensuring moments of pure elegance.
              </p>
            </div>

            {/* Column 2: Curated Links */}
            <div>
              <h4
                className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-6"
                style={{ color: "var(--theme-accent)" }}
              >
                Curated Links
              </h4>
              <ul className="space-y-4">
                {(navItems.length > 0
                  ? navItems
                  : [
                      { label: "Home", url: "/" },
                      { label: "Destinations", url: "/destinations" },
                      { label: "Experiences", url: "/experiences" },
                      { label: "Journal", url: "/blog" },
                    ]
                ).map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      className="text-sm opacity-60 hover:opacity-100 transition-all duration-300 inline-flex items-center gap-2 group"
                      style={{ fontFamily: "var(--theme-font-body)" }}
                    >
                      <span
                        className="w-0 group-hover:w-4 h-px transition-all duration-300"
                        style={{ backgroundColor: "var(--theme-accent)" }}
                      />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact + Newsletter */}
            <div>
              <h4
                className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-6"
                style={{ color: "var(--theme-accent)" }}
              >
                Stay Connected
              </h4>
              <ul className="space-y-3 text-sm opacity-60 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" style={{ color: "var(--theme-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>concierge@voyagr.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" style={{ color: "var(--theme-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 987-6543</span>
                </li>
              </ul>

              <p className="text-xs opacity-50 mb-3 uppercase tracking-widest">Newsletter</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs opacity-40 tracking-widest uppercase">
              &copy; {new Date().getFullYear()} {tenantName}. All rights reserved.
            </p>
            <div className="flex gap-8 text-xs opacity-40">
              <a href="#" className="hover:opacity-100 transition-opacity duration-300 tracking-wider uppercase">Privacy</a>
              <a href="#" className="hover:opacity-100 transition-opacity duration-300 tracking-wider uppercase">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
