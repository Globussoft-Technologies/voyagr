import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      <h1
        className="text-3xl md:text-4xl font-serif font-bold mb-10 pb-4 border-b-2"
        style={{ color: "var(--theme-primary)", borderColor: "var(--theme-primary)" }}
      >
        {title}
      </h1>
      {/* Two-column magazine layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
        <div className="prose prose-lg max-w-none" style={{ color: "var(--theme-text)" }}>
          {children}
        </div>
        <aside className="space-y-8">
          <div className="border-t-2 pt-4" style={{ borderColor: "var(--theme-accent)" }}>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 opacity-70">
              Trending
            </h3>
            <div className="space-y-3 text-sm opacity-60">
              <p>Discover the latest travel stories and editorial picks.</p>
            </div>
          </div>
          <div className="border-t-2 pt-4" style={{ borderColor: "var(--theme-accent)" }}>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 opacity-70">
              Newsletter
            </h3>
            <p className="text-sm opacity-60">
              Subscribe for weekly editorial picks and travel inspiration.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
