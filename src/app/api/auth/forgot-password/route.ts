import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return NextResponse.json({ ok: true });
  }

  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user) {
    const token = crypto.randomUUID();

    // Remove any existing tokens for this email
    await db.passwordResetToken.deleteMany({ where: { email: user.email } });

    await db.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${token}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `<h2>Reset Your Password</h2>
<p>Click the link below to reset your password. This link expires in 1 hour.</p>
<p><a href="${resetUrl}" style="background:#0d9488;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>`,
    );
  }

  // Always return 200 to avoid leaking whether the email exists
  return NextResponse.json({ ok: true });
}
