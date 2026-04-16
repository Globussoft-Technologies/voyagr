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
      {/* Ornate header with pattern border */}
      <header
        className="relative px-6 py-5 flex items-center justify-between"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        {/* Decorative top pattern border */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              var(--theme-accent) 0px,
              var(--theme-accent) 8px,
              var(--theme-secondary) 8px,
              var(--theme-secondary) 16px
            )`,
          }}
        />

        <a href="/" className="flex items-center gap-3">
          <span
            className="text-2xl font-serif font-bold italic"
            style={{ color: "var(--theme-background)" }}
          >
            {tenantName}
          </span>
        </a>

        {navItems.length > 0 && (
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-sm font-serif tracking-wide hover:opacity-80 transition-opacity"
                style={{ color: "var(--theme-background)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Decorative bottom pattern border */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              var(--theme-accent) 0px,
              var(--theme-accent) 8px,
              var(--theme-secondary) 8px,
              var(--theme-secondary) 16px
            )`,
          }}
        />
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Rich heritage footer */}
      <footer
        className="relative px-6 py-8 text-center"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              var(--theme-accent) 0px,
              var(--theme-accent) 8px,
              var(--theme-secondary) 8px,
              var(--theme-secondary) 16px
            )`,
          }}
        />
        <p
          className="text-sm font-serif"
          style={{ color: "var(--theme-background)", opacity: 0.8 }}
        >
          &copy; {new Date().getFullYear()} {tenantName}. Celebrating heritage
          &amp; tradition.
        </p>
      </footer>
    </div>
  );
}
