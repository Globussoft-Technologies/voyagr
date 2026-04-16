import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      {/* Magazine-style header */}
      <div className="mb-12">
        <h1
          className="text-4xl md:text-5xl font-black uppercase tracking-tight"
          style={{ color: "var(--theme-primary)" }}
        >
          {title}
        </h1>
        <div
          className="w-full h-0.5 mt-4"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>

      {/* Magazine-style layout with wide content and pull-quote sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content — full-bleed friendly */}
        <div className="lg:col-span-3">
          <div
            className="prose prose-lg max-w-none"
            style={{ color: "var(--theme-text)" }}
          >
            {children}
          </div>
        </div>

        {/* Pull quote / highlight sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Pull quote block */}
            <div
              className="pl-4"
              style={{ borderLeft: "3px solid var(--theme-accent)" }}
            >
              <p
                className="text-lg font-black uppercase leading-snug"
                style={{ color: "var(--theme-primary)" }}
              >
                &ldquo;Every city has a story waiting to be explored.&rdquo;
              </p>
            </div>

            {/* Accent block */}
            <div
              className="p-4"
              style={{
                backgroundColor: "var(--theme-primary)",
              }}
            >
              <p
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "var(--theme-background)" }}
              >
                City Guide
              </p>
              <p
                className="text-sm mt-2"
                style={{ color: "var(--theme-background)", opacity: 0.7 }}
              >
                Dive into neighborhoods, street food, nightlife, and local
                culture.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
