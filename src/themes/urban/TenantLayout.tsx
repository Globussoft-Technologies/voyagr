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
      {/* Sharp geometric header with dark/light contrast */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: "var(--theme-primary)",
          borderBottom: "2px solid var(--theme-accent)",
        }}
      >
        <a href="/" className="flex items-center gap-3">
          {/* Geometric square accent */}
          <span
            className="w-7 h-7 flex items-center justify-center text-xs font-black"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-primary)",
            }}
          >
            {tenantName.charAt(0).toUpperCase()}
          </span>
          <span
            className="text-lg font-black tracking-tight uppercase"
            style={{ color: "var(--theme-background)" }}
          >
            {tenantName}
          </span>
        </a>

        {navItems.length > 0 && (
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-xs font-bold tracking-wider uppercase px-3 py-1.5 hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--theme-background)",
                  borderLeft: "1px solid var(--theme-accent)",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Metropolitan footer */}
      <footer
        className="px-6 py-6 flex items-center justify-between"
        style={{
          backgroundColor: "var(--theme-primary)",
          borderTop: "2px solid var(--theme-accent)",
        }}
      >
        <p
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "var(--theme-background)", opacity: 0.6 }}
        >
          &copy; {new Date().getFullYear()} {tenantName}
        </p>
        <p
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "var(--theme-accent)" }}
        >
          Explore the city
        </p>
      </footer>
    </div>
  );
}
