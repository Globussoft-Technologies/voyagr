import React from "react";

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
      {/* Header — fixed, bold, rugged */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: "rgba(20, 20, 20, 0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Brand — left-aligned, bold uppercase */}
          <a
            href="/"
            className="text-xl md:text-2xl font-extrabold uppercase tracking-wider text-white"
            style={{ fontFamily: "var(--theme-font-heading)" }}
          >
            {tenantName}
          </a>

          {/* Nav links */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white transition-all duration-300 relative group"
                >
                  {item.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  />
                </a>
              ))}
            </nav>
          )}

          {/* CTA button */}
          <a
            href="/destinations"
            className="hidden md:inline-block px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "var(--theme-accent)" }}
          >
            Book Now
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer — dark charcoal, compact */}
      <footer style={{ backgroundColor: "#1a1a1a", color: "rgba(255,255,255,0.85)" }}>
        {/* Accent divider */}
        <div className="w-full h-1" style={{ backgroundColor: "var(--theme-accent)" }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Column 1: Brand + Mission */}
            <div>
              <h3
                className="text-2xl font-extrabold uppercase tracking-wider mb-4"
                style={{ fontFamily: "var(--theme-font-heading)" }}
              >
                {tenantName}
              </h3>
              <p className="text-sm leading-relaxed opacity-60 max-w-md mb-6">
                Life begins at the edge of your comfort zone. We craft bold expeditions
                for those who refuse to settle for ordinary — pushing boundaries and
                creating stories worth telling.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {["Facebook", "Instagram", "YouTube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    aria-label={social}
                    className="w-10 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white border border-white/20 hover:border-white/50 transition-all duration-300"
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:text-right">
              <h4
                className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: "var(--theme-accent)" }}
              >
                Quick Links
              </h4>
              <ul className="space-y-3">
                {(navItems.length > 0
                  ? navItems
                  : [
                      { label: "Home", url: "/" },
                      { label: "Expeditions", url: "/destinations" },
                      { label: "Stories", url: "/blog" },
                      { label: "About Us", url: "/about" },
                    ]
                ).map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      className="text-sm font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 transition-all duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs opacity-40 uppercase tracking-wider">
              &copy; {new Date().getFullYear()} {tenantName}. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs opacity-40">
              <a href="#" className="hover:opacity-100 transition-opacity duration-300 uppercase tracking-wider">Privacy</a>
              <a href="#" className="hover:opacity-100 transition-opacity duration-300 uppercase tracking-wider">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
