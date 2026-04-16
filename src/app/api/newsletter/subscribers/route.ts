import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const AddSubscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(200).optional(),
  tenantId: z.string().min(1, "Tenant ID is required"),
});

/* GET — list subscribers (auth required) */
export async function GET(req: NextRequest) {
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

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 50));
  const skip = (page - 1) * limit;

  const where: Prisma.SubscriberWhereInput = {
    tenantId: membership.tenant.id,
    ...(status ? { status } : {}),
  };

  const [subscribers, total] = await Promise.all([
    db.subscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
      skip,
      take: limit,
    }),
    db.subscriber.count({ where }),
  ]);

  return NextResponse.json({ subscribers, total, page, limit });
}

/* POST — add subscriber (public, no auth) */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  if (!rateLimit(`subscribe:${ip}`, 10, 300_000)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: unknown;
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    body = await req.json();
  } else {
    const form = await req.formData();
    body = {
      email: form.get("email"),
      name: form.get("name") || undefined,
      tenantId: form.get("tenantId"),
    };
  }

  const parsed = AddSubscriberSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Invalid input", field: issue?.path[0] },
      { status: 422 },
    );
  }

  // Verify tenant exists
  const tenant = await db.tenant.findUnique({
    where: { id: parsed.data.tenantId },
  });
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  try {
    await db.subscriber.create({
      data: {
        tenantId: tenant.id,
        email: parsed.data.email.toLowerCase().trim(),
        name: parsed.data.name || null,
      },
    });
    return NextResponse.json({ ok: true, message: "Subscribed successfully" });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      // Already subscribed — reactivate if unsubscribed
      const existing = await db.subscriber.findUnique({
        where: {
          tenantId_email: {
            tenantId: tenant.id,
            email: parsed.data.email.toLowerCase().trim(),
          },
        },
      });
      if (existing && existing.status === "unsubscribed") {
        await db.subscriber.update({
          where: { id: existing.id },
          data: { status: "active", subscribedAt: new Date() },
        });
        return NextResponse.json({ ok: true, message: "Re-subscribed successfully" });
      }
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 },
      );
    }
    throw e;
  }
}
