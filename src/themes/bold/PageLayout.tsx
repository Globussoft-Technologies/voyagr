import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div
      className="pt-24 min-h-screen"
      style={{
        backgroundColor: "var(--theme-background, #000000)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/30 hover:text-white/60 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </a>
      </div>

      {/* Title */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-10 pb-8">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-white"
          style={{ fontFamily: "var(--theme-font-heading)" }}
        >
          {title}
        </h1>
        <div
          className="mt-6 w-20 h-1"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>

      {/* Content — narrow, high contrast */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">
        <div
          className="prose prose-lg prose-invert max-w-none [&_a]:no-underline [&_a]:font-semibold [&_a]:transition-colors [&_a]:duration-300"
          style={{
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--theme-font-body)",
            "--tw-prose-headings": "#ffffff",
            "--tw-prose-links": "var(--theme-accent)",
            "--tw-prose-bold": "#ffffff",
            "--tw-prose-quotes": "rgba(255,255,255,0.6)",
            "--tw-prose-quote-borders": "var(--theme-accent)",
          } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
