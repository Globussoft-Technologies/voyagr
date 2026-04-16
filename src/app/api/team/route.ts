import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { canManageTeam } from "@/lib/permissions";
import bcrypt from "bcryptjs";

const InviteSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  name: z.string().min(1).max(200),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "EDITOR"]),
});

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

  const members = await db.membership.findMany({
    where: { tenantId: membership.tenant.id },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    members,
    currentRole: membership.role,
    currentUserId: session.user.id,
  });
}

export async function POST(req: NextRequest) {
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

  if (!canManageTeam(membership.role)) {
    return NextResponse.json({ error: "Only owners can invite members" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = InviteSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }

  // Check if user already has a membership in this tenant
  const existingUser = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    const existingMembership = await db.membership.findFirst({
      where: { userId: existingUser.id, tenantId: membership.tenant.id },
    });
    if (existingMembership) {
      return NextResponse.json(
        { error: "User is already a member of this workspace" },
        { status: 409 },
      );
    }

    // Create membership for existing user
    const newMembership = await db.membership.create({
      data: {
        userId: existingUser.id,
        tenantId: membership.tenant.id,
        role: parsed.data.role,
      },
    });
    return NextResponse.json({ ok: true, id: newMembership.id });
  }

  // Create new user and membership
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const newUser = await db.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
    },
  });

  const newMembership = await db.membership.create({
    data: {
      userId: newUser.id,
      tenantId: membership.tenant.id,
      role: parsed.data.role,
    },
  });

  return NextResponse.json({ ok: true, id: newMembership.id });
}
