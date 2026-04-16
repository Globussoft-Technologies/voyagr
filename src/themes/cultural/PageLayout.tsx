import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      {/* Elegant page title with ornate underline */}
      <div className="mb-10">
        <h1
          className="text-3xl md:text-4xl font-serif font-bold"
          style={{ color: "var(--theme-primary)" }}
        >
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-3">
          <span
            className="block h-px flex-1 max-w-16"
            style={{ backgroundColor: "var(--theme-accent)" }}
          />
          <span
            className="block w-1.5 h-1.5 rotate-45"
            style={{ backgroundColor: "var(--theme-accent)" }}
          />
          <span
            className="block h-px flex-1 max-w-16"
            style={{ backgroundColor: "var(--theme-accent)" }}
          />
        </div>
      </div>

      {/* Two-column layout: main content + cultural highlights sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <div
            className="prose prose-lg max-w-none font-serif"
            style={{ color: "var(--theme-text)" }}
          >
            {children}
          </div>
        </div>

        {/* Sidebar for cultural highlights */}
        <aside className="lg:col-span-1">
          <div
            className="p-6 sticky top-8"
            style={{
              backgroundColor: "var(--theme-secondary)",
              border: "2px double var(--theme-accent)",
            }}
          >
            <h2
              className="text-lg font-serif font-bold mb-4"
              style={{ color: "var(--theme-primary)" }}
            >
              Cultural Highlights
            </h2>
            <div
              className="h-px mb-4"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <p
              className="text-sm font-serif leading-relaxed"
              style={{ color: "var(--theme-text)", opacity: 0.8 }}
            >
              Discover the rich heritage, timeless traditions, and vibrant
              cultural experiences that define this destination.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
