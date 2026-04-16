import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="pt-24" style={{ backgroundColor: "var(--theme-background)" }}>
      {/* Breadcrumb */}
      <div className="max-w-2xl mx-auto px-8 pt-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] opacity-50 hover:opacity-80 transition-all duration-300"
          style={{ color: "var(--theme-text)", fontFamily: "var(--theme-font-body)" }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Return Home
        </a>
      </div>

      {/* Title area */}
      <div className="max-w-2xl mx-auto px-8 pt-12 pb-8 text-center">
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide leading-tight"
          style={{
            color: "var(--theme-text)",
            fontFamily: "var(--theme-font-heading)",
          }}
        >
          {title}
        </h1>
        {/* Thin accent line below title */}
        <div
          className="mx-auto mt-6 w-12 h-px"
          style={{ backgroundColor: "var(--theme-accent)" }}
        />
      </div>

      {/* Content — narrow column with drop-cap */}
      <div className="max-w-2xl mx-auto px-8 pb-24 pt-4">
        <div
          className="prose prose-lg max-w-none prose-p:font-light prose-p:leading-[1.9] prose-p:tracking-wide [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:font-light [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:leading-none"
          style={{
            color: "var(--theme-text)",
            fontFamily: "var(--theme-font-body)",
            "--tw-prose-headings": "var(--theme-text)",
          } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
