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
      {/* Transparent header overlaying hero */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between">
        <a
          href="/"
          className="text-lg font-medium tracking-wide text-white drop-shadow-md"
        >
          {tenantName}
        </a>
        {navItems.length > 0 && (
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-sm text-white/80 hover:text-white transition-colors drop-shadow-md"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Minimal chrome footer */}
      <footer className="px-6 py-6 text-center text-xs opacity-40">
        &copy; {new Date().getFullYear()} {tenantName}
      </footer>
    </div>
  );
}
