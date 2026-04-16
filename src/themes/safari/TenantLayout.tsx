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
      {/* Nature-inspired header with warm earthy tones */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: "var(--theme-primary)",
          borderBottom: "3px solid var(--theme-accent)",
        }}
      >
        {/* Leaf/compass-inspired branding */}
        <a href="/" className="flex items-center gap-3 group">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-background)",
            }}
          >
            {tenantName.charAt(0)}
          </span>
          <span
            className="text-xl font-bold tracking-wide uppercase"
            style={{ color: "var(--theme-background)" }}
          >
            {tenantName}
          </span>
        </a>

        {navItems.length > 0 && (
          <nav className="flex gap-5">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-sm font-medium tracking-wider uppercase hover:opacity-80 transition-opacity"
                style={{ color: "var(--theme-background)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Earthy footer with textured border */}
      <footer
        className="px-6 py-8 text-center text-sm"
        style={{
          backgroundColor: "var(--theme-primary)",
          borderTop: "3px solid var(--theme-accent)",
          color: "var(--theme-background)",
          opacity: 0.9,
        }}
      >
        <p className="tracking-wide uppercase text-xs mb-1">
          Wild journeys await
        </p>
        <p>
          &copy; {new Date().getFullYear()} {tenantName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
