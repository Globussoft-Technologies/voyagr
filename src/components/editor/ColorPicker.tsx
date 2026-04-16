"use client";

import { useState, useRef, useEffect } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  "#000000",
  "#DC2626",
  "#2563EB",
  "#16A34A",
  "#EA580C",
  "#9333EA",
  "#EC4899",
  "#6B7280",
  "#0D9488",
  "#92400E",
];

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={label ?? "Pick color"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
      >
        <span
          className="inline-block h-4 w-4 rounded border border-zinc-400 dark:border-zinc-500"
          style={{ backgroundColor: color || "#000000" }}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div className="grid grid-cols-5 gap-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`h-6 w-6 rounded border transition-transform hover:scale-110 ${
                  color === c
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <label className="text-xs text-zinc-500 dark:text-zinc-400">Custom:</label>
            <input
              type="color"
              value={color || "#000000"}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(false);
              }}
              className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
