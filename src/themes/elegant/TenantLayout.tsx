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
      {/* Centered serif logo with thin horizontal rules */}
      <header className="px-6 py-8 text-center">
        <hr className="border-current/15 mb-6" />
        <a
          href="/"
          className="text-2xl md:text-3xl font-serif italic tracking-wide"
          style={{ color: "var(--theme-primary)" }}
        >
          {tenantName}
        </a>
        {navItems.length > 0 && (
          <nav className="mt-5 flex justify-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-sm font-serif opacity-60 hover:opacity-100 transition-opacity"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <hr className="border-current/15 mt-6" />
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Classical footer */}
      <footer className="px-6 py-8 text-center">
        <hr className="border-current/15 mb-6" />
        <p className="text-sm font-serif opacity-40 italic">
          &copy; {new Date().getFullYear()} {tenantName}
        </p>
      </footer>
    </div>
  );
}
