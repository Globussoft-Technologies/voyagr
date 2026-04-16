import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="pt-24" style={{ backgroundColor: "var(--theme-background)" }}>
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-50 hover:opacity-100 transition-all duration-300"
          style={{ color: "var(--theme-text)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </a>
      </div>

      {/* Title with accent left-border */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-8 pb-10">
        <div
          className="pl-6"
          style={{ borderLeft: "4px solid var(--theme-accent)" }}
        >
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-tight"
            style={{
              color: "var(--theme-text)",
              fontFamily: "var(--theme-font-heading)",
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Content — wide, clean, readable */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-20">
        <div
          className="prose prose-lg max-w-none prose-headings:uppercase prose-headings:tracking-wider prose-headings:font-extrabold prose-a:font-semibold"
          style={{
            color: "var(--theme-text)",
            fontFamily: "var(--theme-font-body)",
            "--tw-prose-headings": "var(--theme-text)",
            "--tw-prose-links": "var(--theme-accent)",
          } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
