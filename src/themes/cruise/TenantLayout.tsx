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
      {/* Header with wave-shaped bottom */}
      <div className="relative">
        <header
          className="px-6 py-5 flex items-center justify-between relative z-10"
          style={{
            background: "linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 70%, #001a33))",
          }}
        >
          <a
            href="/"
            className="text-xl font-semibold tracking-wide text-white"
          >
            {tenantName}
          </a>
          {navItems.length > 0 && (
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        {/* Wave SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full translate-y-[calc(100%-1px)]"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ height: "40px" }}
        >
          <path
            d="M0,0 C360,60 1080,0 1440,40 L1440,0 L0,0 Z"
            style={{ fill: "var(--theme-primary)" }}
          />
        </svg>
      </div>

      {/* Spacer for wave */}
      <div className="h-10" />

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer with wave top */}
      <div className="relative mt-12">
        <svg
          className="absolute top-0 left-0 w-full -translate-y-[calc(100%-1px)]"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ height: "40px" }}
        >
          <path
            d="M0,60 C360,0 1080,60 1440,20 L1440,60 L0,60 Z"
            style={{ fill: "var(--theme-primary)" }}
          />
        </svg>
        <footer
          className="px-6 py-8 text-center text-sm text-white/70"
          style={{
            background: "linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 70%, #001a33))",
          }}
        >
          &copy; {new Date().getFullYear()} {tenantName}. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
