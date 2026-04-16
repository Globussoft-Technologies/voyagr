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
      {/* Rounded, colorful header with playful elements */}
      <header className="px-6 py-4">
        <div
          className="rounded-2xl px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          <a href="/" className="flex items-center gap-3">
            {/* Playful rounded badge */}
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-background)",
              }}
            >
              {tenantName.charAt(0)}
            </span>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--theme-background)" }}
            >
              {tenantName}
            </span>
          </a>

          {navItems.length > 0 && (
            <nav className="flex gap-2">
              {navItems.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="text-sm font-semibold px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: "var(--theme-secondary)",
                    color: "var(--theme-text)",
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Playful colored dots decoration */}
        <div className="flex justify-center gap-2 mt-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--theme-primary)" }}
          />
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--theme-accent)" }}
          />
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--theme-secondary)" }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Friendly footer */}
      <footer className="px-6 pb-6">
        <div
          className="rounded-2xl px-6 py-6 text-center"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--theme-background)" }}
          >
            Making family memories, one trip at a time!
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--theme-background)", opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()} {tenantName}
          </p>
        </div>
      </footer>
    </div>
  );
}
