import { NextRequest, NextResponse } from "next/server";

export function publicUrl(req: NextRequest, path: string): URL {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  return new URL(path, `${proto}://${host}`);
}

export function jsonOrRedirect(
  req: NextRequest,
  json: Record<string, unknown>,
  redirectPath: string,
): NextResponse {
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("application/json") || accept.includes("text/x-component")) {
    return NextResponse.json(json);
  }
  return NextResponse.redirect(publicUrl(req, redirectPath), 303);
}
