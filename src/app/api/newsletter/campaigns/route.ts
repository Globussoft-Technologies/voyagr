import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const CreateNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  content: z.string().min(1, "Content is required"),
});

/* GET — list newsletters for tenant */
export async function GET(_req: NextRequest) {
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

  const newsletters = await db.newsletter.findMany({
    where: { tenantId: membership.tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ newsletters });
}

/* POST — create newsletter */
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

  const body = await req.json();
  const parsed = CreateNewsletterSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }

  const newsletter = await db.newsletter.create({
    data: {
      tenantId: membership.tenant.id,
      subject: parsed.data.subject,
      content: parsed.data.content,
    },
  });

  return NextResponse.json({ ok: true, id: newsletter.id }, { status: 201 });
}
