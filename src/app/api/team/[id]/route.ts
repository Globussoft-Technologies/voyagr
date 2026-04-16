import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { canManageTeam } from "@/lib/permissions";

const UpdateRoleSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
    return NextResponse.json({ error: "Only owners can change roles" }, { status: 403 });
  }

  const { id } = await params;

  const target = await db.membership.findFirst({
    where: { id, tenantId: membership.tenant.id },
  });
  if (!target) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Cannot demote self from OWNER
  if (target.userId === session.user.id) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = UpdateRoleSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }

  const updated = await db.membership.update({
    where: { id: target.id },
    data: { role: parsed.data.role },
  });

  return NextResponse.json({ ok: true, id: updated.id });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
    return NextResponse.json({ error: "Only owners can remove members" }, { status: 403 });
  }

  const { id } = await params;

  const target = await db.membership.findFirst({
    where: { id, tenantId: membership.tenant.id },
  });
  if (!target) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (target.userId === session.user.id) {
    return NextResponse.json({ error: "Cannot remove yourself" }, { status: 403 });
  }

  await db.membership.delete({ where: { id: target.id } });

  return NextResponse.json({ ok: true });
}
