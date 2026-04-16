import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const record = await db.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  await db.user.update({
    where: { email: record.email },
    data: { emailVerified: true },
  });

  await db.emailVerificationToken.delete({ where: { id: record.id } });

  return NextResponse.redirect(new URL("/sign-in?verified=1", req.url));
}
