import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendBulk, testSmtpConnection } from "@/lib/email";

const UpdateNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  content: z.string().min(1, "Content is required"),
});

async function getMembershipAndNewsletter(newsletterId: string, userId: string) {
  const membership = await db.membership.findFirst({
    where: { userId },
    include: { tenant: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) return { membership: null, newsletter: null };

  const newsletter = await db.newsletter.findFirst({
    where: { id: newsletterId, tenantId: membership.tenant.id },
  });

  return { membership, newsletter };
}

/* GET — single newsletter */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { membership, newsletter } = await getMembershipAndNewsletter(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
  }

  return NextResponse.json(newsletter);
}

/* PUT — update newsletter (only drafts) */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { membership, newsletter } = await getMembershipAndNewsletter(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
  }
  if (newsletter.status !== "draft") {
    return NextResponse.json(
      { error: "Only draft newsletters can be edited" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const parsed = UpdateNewsletterSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }

  const updated = await db.newsletter.update({
    where: { id: newsletter.id },
    data: {
      subject: parsed.data.subject,
      content: parsed.data.content,
    },
  });

  return NextResponse.json({ ok: true, id: updated.id });
}

/* POST — send newsletter (action=send) */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { membership, newsletter } = await getMembershipAndNewsletter(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.action !== "send") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (newsletter.status === "sent") {
    return NextResponse.json(
      { error: "Newsletter has already been sent" },
      { status: 400 },
    );
  }

  // Verify SMTP connection before sending
  const smtpCheck = await testSmtpConnection();
  if (!smtpCheck.ok) {
    return NextResponse.json(
      { error: "SMTP is not configured. Go to Settings \u2192 Email to configure." },
      { status: 503 },
    );
  }

  // Mark as sending
  await db.newsletter.update({
    where: { id: newsletter.id },
    data: { status: "sending" },
  });

  // Get active subscribers
  const subscribers = await db.subscriber.findMany({
    where: { tenantId: membership.tenant.id, status: "active" },
    select: { email: true, name: true },
  });

  if (subscribers.length === 0) {
    await db.newsletter.update({
      where: { id: newsletter.id },
      data: { status: "sent", sentAt: new Date(), sentCount: 0 },
    });
    return NextResponse.json({ ok: true, sent: 0, failed: 0 });
  }

  const result = await sendBulk(
    subscribers.map((s) => ({ email: s.email, name: s.name ?? undefined })),
    newsletter.subject,
    newsletter.content,
  );

  await db.newsletter.update({
    where: { id: newsletter.id },
    data: {
      status: "sent",
      sentAt: new Date(),
      sentCount: result.sent,
    },
  });

  return NextResponse.json({ ok: true, ...result });
}

/* DELETE — delete newsletter */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { membership, newsletter } = await getMembershipAndNewsletter(id, session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "No workspace found" }, { status: 403 });
  }
  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
  }

  await db.newsletter.delete({ where: { id: newsletter.id } });

  return NextResponse.json({ ok: true });
}
