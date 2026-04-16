import React from "react";
import FooterNewsletter from "./FooterNewsletter";
import MobileMenu from "./MobileMenu";
import HeaderSearch from "./HeaderSearch";

interface TenantLayoutProps {
  tenantName: string;
  children: React.ReactNode;
  navItems?: { label: string; url: string }[];
  tenantSlug?: string;
}

export default function TenantLayout({
  tenantName,
  children,
  navItems = [],
  tenantSlug,
}: TenantLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        color: "var(--theme-text)",
        backgroundColor: "var(--theme-background)",
        fontFamily: "var(--theme-font-body)",
      }}
    >
      {/* Header — transparent overlay on hero, becomes solid on scroll via CSS */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.15)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-white drop-shadow-sm"
            style={{ fontFamily: "var(--theme-font-heading)" }}
          >
            {tenantName}
          </a>
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="text-sm font-medium text-white/90 hover:text-white transition-all duration-300 relative group"
                >
                  {item.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: "var(--theme-accent)" }}
                  />
                </a>
              ))}
            </nav>
          )}
          {/* Search + Mobile menu */}
          <div className="flex items-center gap-2">
            {tenantSlug && <HeaderSearch tenantSlug={tenantSlug} />}
            <MobileMenu navItems={navItems} />
          </div>
        </div>
      </header>

      {/* Main content — full width */}
      <main className="flex-1">{children}</main>

      {/* Footer — premium multi-column */}
      <footer
        style={{ backgroundColor: "var(--theme-primary)", color: "rgba(255,255,255,0.9)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1: Brand */}
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--theme-font-heading)" }}
              >
                {tenantName}
              </h3>
              <p className="text-sm leading-relaxed opacity-80 mb-6">
                Curating unforgettable travel experiences across the globe.
                Let us help you discover your next adventure with handpicked
                destinations and personalized itineraries.
              </p>
              {/* Social icons */}
              <div className="flex gap-4">
                {[
                  { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { label: "Twitter", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-wider mb-6"
                style={{ color: "var(--theme-accent)" }}
              >
                Quick Links
              </h4>
              <ul className="space-y-3">
                {(navItems.length > 0
                  ? navItems
                  : [
                      { label: "Home", url: "/" },
                      { label: "Destinations", url: "/destinations" },
                      { label: "Blog", url: "/blog" },
                      { label: "About", url: "/about" },
                    ]
                ).map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      className="text-sm opacity-80 hover:opacity-100 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-wider mb-6"
                style={{ color: "var(--theme-accent)" }}
              >
                Contact Us
              </h4>
              <ul className="space-y-4 text-sm opacity-80">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>hello@voyagr.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Worldwide Adventures</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4
                className="text-sm font-semibold uppercase tracking-wider mb-6"
                style={{ color: "var(--theme-accent)" }}
              >
                Newsletter
              </h4>
              <p className="text-sm opacity-80 mb-4">
                Get travel inspiration and exclusive deals delivered to your inbox.
              </p>
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs opacity-60">
              &copy; {new Date().getFullYear()} {tenantName}. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs opacity-60">
              <a href="#" className="hover:opacity-100 transition-opacity duration-300">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 transition-opacity duration-300">Terms of Service</a>
              <a href="#" className="hover:opacity-100 transition-opacity duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
