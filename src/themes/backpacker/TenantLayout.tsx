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
      {/* Playful header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        <a
          href="/"
          className="text-xl font-bold px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: "var(--theme-background)",
            color: "var(--theme-primary)",
          }}
        >
          {tenantName}
        </a>
        {navItems.length > 0 && (
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "var(--theme-background)",
                  color: "var(--theme-primary)",
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

      {/* Fun footer */}
      <footer
        className="px-6 py-8 text-center"
        style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-background)" }}
      >
        <p className="font-bold text-lg mb-1">
          Happy travels!
        </p>
        <p className="text-sm opacity-70">
          &copy; {new Date().getFullYear()} {tenantName}
        </p>
      </footer>
    </div>
  );
}
