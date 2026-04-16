import type { ComponentType, ReactNode } from "react";
import { getTheme } from "@/lib/themes/registry";

interface TenantLayoutProps {
  tenantName: string;
  children: ReactNode;
  navItems?: { label: string; url: string }[];
  tenantSlug?: string;
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

export interface TemplateComponents {
  TenantLayout: ComponentType<TenantLayoutProps>;
  HeroSection: ComponentType<HeroSectionProps>;
  PageLayout: ComponentType<PageLayoutProps>;
}

const LAYOUT_LOADERS: Record<string, () => Promise<TemplateComponents>> = {
  starter: () => loadLayout("starter"),
  adventure: () => loadLayout("adventure"),
  luxury: () => loadLayout("luxury"),
  backpacker: () => loadLayout("backpacker"),
  cruise: () => loadLayout("cruise"),
  cultural: () => loadLayout("cultural"),
  family: () => loadLayout("family"),
  safari: () => loadLayout("safari"),
  urban: () => loadLayout("urban"),
  wellness: () => loadLayout("wellness"),
  magazine: () => loadLayout("magazine"),
  minimal: () => loadLayout("minimal"),
  bold: () => loadLayout("bold"),
  gallery: () => loadLayout("gallery"),
  elegant: () => loadLayout("elegant"),
};

async function loadLayout(name: string): Promise<TemplateComponents> {
  const [TenantLayout, HeroSection, PageLayout] = await Promise.all([
    import(`./${name}/TenantLayout`).then((m) => m.default),
    import(`./${name}/HeroSection`).then((m) => m.default),
    import(`./${name}/PageLayout`).then((m) => m.default),
  ]);
  return { TenantLayout, HeroSection, PageLayout };
}

export async function getTemplateComponents(
  themeKey: string,
): Promise<TemplateComponents> {
  const theme = getTheme(themeKey);
  const layout = theme.layout || "starter";
  const loader = LAYOUT_LOADERS[layout] ?? LAYOUT_LOADERS.starter;
  return loader();
}
