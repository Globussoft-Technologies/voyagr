import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="pt-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-all duration-300 hover:gap-3 opacity-60 hover:opacity-100"
          style={{ color: "var(--theme-primary)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </a>
      </div>

      {/* Title */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-8 pb-12">
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight"
          style={{
            color: "var(--theme-text)",
            fontFamily: "var(--theme-font-heading)",
          }}
        >
          {title}
        </h1>
        <div
          className="mt-4 w-20 h-1 rounded-full"
          style={{ backgroundColor: "var(--theme-primary)" }}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-20">
        <div
          className="prose prose-lg max-w-none"
          style={{
            color: "var(--theme-text)",
            fontFamily: "var(--theme-font-body)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
