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
      {/* Ultra-minimal header: wordmark + hamburger-style text nav */}
      <header className="px-8 py-10 flex items-center justify-between">
        <a
          href="/"
          className="text-base font-light tracking-[0.2em] uppercase"
          style={{ color: "var(--theme-text)" }}
        >
          {tenantName}
        </a>
        {navItems.length > 0 && (
          <nav className="flex gap-8">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-xs tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main content with maximum whitespace */}
      <main className="flex-1 py-12">{children}</main>

      {/* Minimal footer */}
      <footer className="px-8 py-10 text-xs opacity-30 tracking-wider">
        &copy; {new Date().getFullYear()} {tenantName}
      </footer>
    </div>
  );
}
