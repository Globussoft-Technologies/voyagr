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
        color: "#ffffff",
        backgroundColor: "var(--theme-background, #000000)",
        fontFamily: "var(--theme-font-body)",
      }}
    >
      {/* Header — fixed, dark, stark */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          {/* Brand — accent colored */}
          <a
            href="/"
            className="text-xl md:text-2xl font-black uppercase tracking-wider"
            style={{
              color: "var(--theme-accent)",
              fontFamily: "var(--theme-font-heading)",
            }}
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
                  className="text-sm font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-all duration-300 relative group"
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
        </div>

        {/* Thin accent line at bottom of header */}
        <div className="w-full h-px" style={{ backgroundColor: "var(--theme-accent)", opacity: 0.3 }} />
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer — pure black, minimal single row */}
      <footer style={{ backgroundColor: "#000000" }}>
        <div
          className="w-full h-px"
          style={{ backgroundColor: "var(--theme-accent)", opacity: 0.2 }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <span
              className="text-lg font-black uppercase tracking-wider"
              style={{ color: "var(--theme-accent)", fontFamily: "var(--theme-font-heading)" }}
            >
              {tenantName}
            </span>

            {/* Links */}
            <div className="flex items-center gap-8">
              {(navItems.length > 0
                ? navItems
                : [
                    { label: "Home", url: "/" },
                    { label: "Destinations", url: "/destinations" },
                    { label: "Blog", url: "/blog" },
                    { label: "About", url: "/about" },
                  ]
              ).map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="text-xs font-semibold uppercase tracking-wider text-white/40 hover:text-white transition-all duration-300 relative group"
                >
                  {item.label}
                  <span
                    className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/30 uppercase tracking-wider">
              &copy; {new Date().getFullYear()} {tenantName}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
