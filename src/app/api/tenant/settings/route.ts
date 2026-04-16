import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { themes } from "@/lib/themes/registry";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }

  const { tenant } = membership;
  return NextResponse.json({
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    themeKey: tenant.themeKey,
    description: tenant.description,
    onboardingCompleted: tenant.onboardingCompleted,
    customDomain: tenant.customDomain,
  });
}

const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

const UpdateSettingsSchema = z.object({
  themeKey: z
    .string()
    .refine((k) => k in themes, { message: "Unknown theme" })
    .optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  onboardingCompleted: z.boolean().optional(),
  customDomain: z
    .string()
    .transform((v) => v.trim().toLowerCase())
    .refine((v) => v === "" || domainRegex.test(v), {
      message: "Invalid domain format. Use a hostname like example.com (no protocol or spaces).",
    })
    .optional(),
});

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = UpdateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }

  const data: Record<string, string | boolean | null> = {};
  if (parsed.data.themeKey) data.themeKey = parsed.data.themeKey;
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.description !== undefined) data.description = parsed.data.description;
  if (parsed.data.onboardingCompleted !== undefined) data.onboardingCompleted = parsed.data.onboardingCompleted;
  if (parsed.data.customDomain !== undefined) {
    data.customDomain = parsed.data.customDomain === "" ? null : parsed.data.customDomain;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 422 });
  }

  const tenant = await db.tenant.update({
    where: { id: membership.tenant.id },
    data,
  });

  return NextResponse.json({
    ok: true,
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    themeKey: tenant.themeKey,
    description: tenant.description,
    onboardingCompleted: tenant.onboardingCompleted,
    customDomain: tenant.customDomain,
  });
}
