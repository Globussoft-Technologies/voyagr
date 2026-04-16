import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-lg mx-auto px-6 py-16 md:py-24">
      <h1
        className="text-2xl font-light tracking-tight mb-12"
        style={{ color: "var(--theme-text)" }}
      >
        {title}
      </h1>
      <div
        className="prose max-w-none leading-[1.9] text-base font-light"
        style={{ color: "var(--theme-text)" }}
      >
        {children}
      </div>
    </div>
  );
}
