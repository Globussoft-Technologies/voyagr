import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const CreateMenuItemSchema = z.object({
  label: z.string().min(1).max(100),
  url: z.string().min(1).max(500),
  position: z.number().int().min(0).optional(),
  parentId: z.string().nullish(),
});

const BulkUpdateSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number().int().min(0),
    parentId: z.string().nullish(),
  }),
);

async function getTenantId() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  return membership?.tenant.id ?? null;
}

export async function GET() {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const items = await db.menuItem.findMany({
    where: { tenantId },
    orderBy: { position: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateMenuItemSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }

  // Default position to max + 1
  let position = parsed.data.position;
  if (position === undefined) {
    const last = await db.menuItem.findFirst({
      where: { tenantId, parentId: parsed.data.parentId ?? null },
      orderBy: { position: "desc" },
    });
    position = (last?.position ?? -1) + 1;
  }

  const item = await db.menuItem.create({
    data: {
      tenantId,
      label: parsed.data.label,
      url: parsed.data.url,
      position,
      parentId: parsed.data.parentId ?? null,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = BulkUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  await db.$transaction(
    parsed.data.map((item) =>
      db.menuItem.update({
        where: { id: item.id, tenantId },
        data: { position: item.position, parentId: item.parentId ?? null },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
