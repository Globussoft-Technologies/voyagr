"use client";

import { useState } from "react";
import { themes } from "@/lib/themes/registry";
import type { ThemeConfig } from "@/lib/themes/registry";

interface ThemePickerProps {
  currentTheme: string;
  onSelect: (key: string) => void;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="h-6 w-6 rounded-full border border-zinc-300 dark:border-zinc-600"
      style={{ backgroundColor: color }}
      title={label}
    />
  );
}

function ThemeCard({
  config,
  selected,
  onSelect,
}: {
  config: ThemeConfig;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col rounded-xl border-2 p-3 text-left transition-all hover:shadow-md sm:p-4 ${
        selected
          ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
          : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          &#10003;
        </span>
      )}

      {/* Color swatches preview */}
      <div className="flex gap-1.5">
        <ColorSwatch color={config.colors.primary} label="Primary" />
        <ColorSwatch color={config.colors.secondary} label="Secondary" />
        <ColorSwatch color={config.colors.accent} label="Accent" />
        <ColorSwatch color={config.colors.background} label="Background" />
        <ColorSwatch color={config.colors.text} label="Text" />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {config.name}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {config.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {config.features.slice(0, 3).map((f) => (
          <span
            key={f}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {f}
          </span>
        ))}
      </div>
    </button>
  );
}

export default function ThemePicker({ currentTheme, onSelect }: ThemePickerProps) {
  const [search, setSearch] = useState("");
  const themeList = Object.values(themes);

  const filtered = themeList.filter((config) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      config.name.toLowerCase().includes(q) ||
      config.description.toLowerCase().includes(q) ||
      config.features.some((f) => f.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter themes by name or niche..."
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No themes match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((config) => (
            <ThemeCard
              key={config.key}
              config={config}
              selected={config.key === currentTheme}
              onSelect={() => onSelect(config.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
