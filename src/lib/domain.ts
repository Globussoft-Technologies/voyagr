export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "lvh.me:3000";

export const ROOT_HOSTNAME = ROOT_DOMAIN.split(":")[0];

export function extractSubdomain(host: string | null | undefined): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  if (hostname === ROOT_HOSTNAME) return null;
  if (!hostname.endsWith("." + ROOT_HOSTNAME)) return null;
  const sub = hostname.slice(0, hostname.length - ROOT_HOSTNAME.length - 1);
  if (!sub || sub === "www") return null;
  return sub;
}

export function isCustomDomain(host: string | null | undefined): boolean {
  if (!host) return false;
  const hostname = host.split(":")[0].toLowerCase();
  if (hostname === ROOT_HOSTNAME) return false;
  if (hostname.endsWith("." + ROOT_HOSTNAME)) return false;
  return true;
}

export function tenantUrl(slug: string): string {
  const protocol = ROOT_DOMAIN.includes("localhost") || ROOT_DOMAIN.includes("lvh.me")
    ? "http"
    : "https";
  return `${protocol}://${slug}.${ROOT_DOMAIN}`;
}
