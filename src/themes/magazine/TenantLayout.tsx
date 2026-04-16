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
      {/* Newspaper-style masthead header */}
      <header className="border-b-2 border-current/20">
        <div className="px-6 py-2 text-center border-b border-current/10">
          <span className="text-xs uppercase tracking-[0.3em] opacity-50">
            Travel &middot; Culture &middot; Adventure
          </span>
        </div>
        <div className="px-6 py-6 text-center">
          <a
            href="/"
            className="text-4xl md:text-5xl font-serif font-bold tracking-tight"
            style={{ color: "var(--theme-primary)" }}
          >
            {tenantName}
          </a>
        </div>
        {navItems.length > 0 && (
          <nav className="border-t border-current/10 px-6 py-3 flex justify-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                className="text-sm uppercase tracking-wider font-medium hover:opacity-70 transition-opacity"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Multi-column footer */}
      <footer className="border-t-2 border-current/20 px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serif font-bold text-lg mb-3" style={{ color: "var(--theme-primary)" }}>
              {tenantName}
            </h4>
            <p className="text-sm opacity-60 leading-relaxed">
              Your trusted source for travel stories, guides, and inspiration from around the globe.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider mb-3 opacity-70">Sections</h5>
            <ul className="space-y-2 text-sm opacity-60">
              <li>Destinations</li>
              <li>Features</li>
              <li>Guides</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider mb-3 opacity-70">Topics</h5>
            <ul className="space-y-2 text-sm opacity-60">
              <li>Culture</li>
              <li>Food &amp; Drink</li>
              <li>Adventure</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider mb-3 opacity-70">About</h5>
            <ul className="space-y-2 text-sm opacity-60">
              <li>Contact</li>
              <li>Advertise</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-current/10 text-center text-xs opacity-40">
          &copy; {new Date().getFullYear()} {tenantName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
