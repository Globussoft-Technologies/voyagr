import { NextRequest, NextResponse } from "next/server";
import { extractSubdomain, isCustomDomain } from "@/lib/domain";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2)).*)",
  ],
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const subdomain = extractSubdomain(host);
  const url = req.nextUrl.clone();

  // Block direct /sites access
  if (url.pathname.startsWith("/sites")) {
    return new NextResponse(null, { status: 404 });
  }

  // Custom domain: rewrite to /sites/{hostname}/...
  if (isCustomDomain(host)) {
    const hostname = host!.split(":")[0].toLowerCase();
    url.pathname = `/sites/${hostname}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // No subdomain (apex): pass through
  if (!subdomain) return NextResponse.next();

  // Subdomain: allow auth/dashboard pages, rewrite rest to /sites/
  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up")
  ) {
    return NextResponse.next();
  }

  url.pathname = `/sites/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}
