import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-10">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-3xl md:text-4xl font-semibold mb-8"
          style={{ color: "var(--theme-primary)" }}
        >
          {title}
        </h1>
        <div className="prose prose-lg max-w-none" style={{ color: "var(--theme-text)" }}>
          {children}
        </div>
      </div>

      {/* Sidebar — itinerary */}
      <aside className="lg:w-72 shrink-0">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(180deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 80%, #001a33))",
          }}
        >
          <div className="p-5">
            <h2 className="text-base font-semibold text-white mb-4">
              Itinerary
            </h2>
            <ol className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                  1
                </span>
                <span>Departure port</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                  2
                </span>
                <span>Sea day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                  3
                </span>
                <span>Port of call</span>
              </li>
            </ol>
          </div>
        </div>
      </aside>
    </div>
  );
}
