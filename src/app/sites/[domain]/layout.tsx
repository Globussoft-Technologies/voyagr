import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getTheme } from "@/lib/themes/registry";
import { ThemeProvider } from "@/lib/themes/theme-provider";
import { getTemplateComponents } from "@/themes";
import TrackingScript from "@/components/analytics/TrackingScript";

export const dynamic = "force-dynamic";

function buildGoogleFontsUrl(heading: string, body: string): string {
  // Extract font family name (before the comma/fallback)
  const extractName = (font: string) => font.split(",")[0].trim();
  const headingName = extractName(heading);
  const bodyName = extractName(body);

  const families: string[] = [];
  families.push(`family=${encodeURIComponent(headingName)}:wght@400;600;700`);
  if (bodyName !== headingName) {
    families.push(`family=${encodeURIComponent(bodyName)}:wght@300;400;500;600;700`);
  }

  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export default async function TenantSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const tenant = await db.tenant.findFirst({
    where: {
      OR: [
        { slug: domain },
        { customDomain: domain },
      ],
    },
    include: {
      menuItems: {
        where: { parentId: null },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!tenant) notFound();

  const theme = getTheme(tenant.themeKey);
  const { TenantLayout } = await getTemplateComponents(tenant.themeKey);
  const navItems = tenant.menuItems.map((m) => ({
    label: m.label,
    url: m.url,
  }));

  const fontsUrl = buildGoogleFontsUrl(theme.fonts.heading, theme.fonts.body);

  return (
    <ThemeProvider theme={theme}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontsUrl} />
      <TrackingScript />
      <TenantLayout tenantName={tenant.name} navItems={navItems} tenantSlug={tenant.slug}>
        {children}
      </TenantLayout>
    </ThemeProvider>
  );
}
