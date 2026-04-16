import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { jsonOrRedirect } from "@/lib/api-helpers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { validateTenantSlug } from "@/lib/tenant";
import { rateLimit } from "@/lib/rate-limit";

const SignUpSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  tenantName: z.string().min(1).max(100),
  tenantSlug: z.string().transform((v) => v.toLowerCase()),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  if (!rateLimit(`signup:${ip}`, 5, 300_000)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await req.formData();
  const raw = {
    email: body.get("email"),
    password: body.get("password"),
    name: body.get("name") || undefined,
    tenantName: body.get("tenantName"),
    tenantSlug: body.get("tenantSlug"),
  };
  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }
  const { email, password, name, tenantName, tenantSlug } = parsed.data;
  const slugError = validateTenantSlug(tenantSlug);
  if (slugError) {
    return NextResponse.json(
      { error: slugError, field: "tenantSlug" },
      { status: 422 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name: name || null, passwordHash },
      });
      const tenant = await tx.tenant.create({
        data: { name: tenantName, slug: tenantSlug },
      });
      await tx.membership.create({
        data: { userId: user.id, tenantId: tenant.id, role: "OWNER" },
      });
    });

    // Send verification email (outside transaction, non-blocking)
    const token = crypto.randomUUID();
    await db.emailVerificationToken.deleteMany({ where: { email } });
    await db.emailVerificationToken.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    const verifyUrl = `${process.env.AUTH_URL}/api/auth/verify-email?token=${token}`;
    await sendEmail(
      email,
      "Verify Your Email",
      `<h2>Verify Your Email</h2>
<p>Click the link below to verify your email address.</p>
<p><a href="${verifyUrl}" style="background:#0d9488;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Verify Email</a></p>`,
    );
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const target = (e.meta?.target as string[] | undefined)?.[0] ?? "";
      if (target === "email")
        return NextResponse.json(
          { error: "Email already in use", field: "email" },
          { status: 409 },
        );
      if (target === "slug")
        return NextResponse.json(
          { error: "Subdomain already taken", field: "tenantSlug" },
          { status: 409 },
        );
      return NextResponse.json(
        { error: "A unique value is already taken" },
        { status: 409 },
      );
    }
    throw e;
  }

  return jsonOrRedirect(req, { ok: true }, "/sign-in?signedUp=1");
}
