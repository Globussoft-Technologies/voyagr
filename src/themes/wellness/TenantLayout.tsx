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
      }}
    >
      {/* Soft rounded header with breathing room */}
      <header className="px-8 py-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          {/* Soft circle accent */}
          <span
            className="w-8 h-8 rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))",
              opacity: 0.7,
            }}
          />
          <span
            className="text-xl font-light tracking-widest"
            style={{ color: "var(--theme-primary)" }}
          >
            {tenantName}
          </span>
        </a>

        {navItems.length > 0 && (
          <nav className="flex gap-8">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-sm font-light tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "var(--theme-text)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Soft divider */}
      <div
        className="h-px mx-12"
        style={{
          background: "linear-gradient(to right, transparent, var(--theme-primary), transparent)",
          opacity: 0.25,
        }}
      />

      {/* Main content with generous whitespace */}
      <main className="flex-1">{children}</main>

      {/* Calm footer */}
      <div
        className="h-px mx-12"
        style={{
          background: "linear-gradient(to right, transparent, var(--theme-primary), transparent)",
          opacity: 0.25,
        }}
      />
      <footer className="px-8 py-10 text-center">
        <p
          className="text-xs font-light tracking-widest uppercase"
          style={{ color: "var(--theme-text)", opacity: 0.5 }}
        >
          Breathe. Explore. Restore.
        </p>
        <p
          className="text-sm font-light mt-2"
          style={{ color: "var(--theme-text)", opacity: 0.4 }}
        >
          &copy; {new Date().getFullYear()} {tenantName}
        </p>
      </footer>
    </div>
  );
}
