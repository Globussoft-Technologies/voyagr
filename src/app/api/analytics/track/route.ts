import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simple in-memory rate limiter: 100 per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  return entry.count > 100;
}

function extractTenantSlug(req: NextRequest): string | null {
  // Try Origin header first, then Referer
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin) return null;

  try {
    const url = new URL(origin);
    const host = url.hostname;
    // Extract subdomain: e.g. "mysite.example.com" -> "mysite"
    const parts = host.split(".");
    if (parts.length >= 2) {
      return parts[0];
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  let body: { path?: string; referrer?: string };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const path = body.path;
  if (!path || typeof path !== "string") {
    return new NextResponse(null, { status: 400 });
  }

  const tenantSlug = extractTenantSlug(req);
  if (!tenantSlug) {
    return new NextResponse(null, { status: 204 });
  }

  const tenant = await db.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) {
    return new NextResponse(null, { status: 204 });
  }

  const userAgent = req.headers.get("user-agent") || undefined;

  await db.pageView.create({
    data: {
      tenantId: tenant.id,
      path,
      referrer: body.referrer || null,
      userAgent: userAgent || null,
    },
  });

  return new NextResponse(null, { status: 204 });
}
