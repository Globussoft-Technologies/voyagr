import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { token, password } = (await req.json()) as {
    token?: string;
    password?: string;
  };

  if (!token || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Invalid request. Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const record = await db.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired reset link. Please request a new one." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.update({
    where: { email: record.email },
    data: { passwordHash },
  });

  await db.passwordResetToken.delete({ where: { id: record.id } });

  return NextResponse.json({ ok: true });
}
