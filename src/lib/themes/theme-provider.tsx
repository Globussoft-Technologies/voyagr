"use client";

import { type ReactNode, useMemo } from "react";
import type { ThemeConfig } from "./registry";

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const style = useMemo(
    () =>
      ({
        "--theme-primary": theme.colors.primary,
        "--theme-secondary": theme.colors.secondary,
        "--theme-accent": theme.colors.accent,
        "--theme-background": theme.colors.background,
        "--theme-text": theme.colors.text,
        "--theme-font-heading": theme.fonts.heading,
        "--theme-font-body": theme.fonts.body,
      }) as React.CSSProperties,
    [theme],
  );

  return (
    <div
      style={style}
      className="contents"
      data-theme={theme.key}
    >
      {children}
    </div>
  );
}
