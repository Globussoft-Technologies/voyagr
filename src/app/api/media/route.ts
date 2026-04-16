import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { uploadFile, StorageError } from "@/lib/storage";

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

  const formData = await req.formData();
  const files = formData.getAll("file") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 422 });
  }

  const results = [];

  for (const file of files) {
    try {
      const stored = await uploadFile(file, membership.tenant.slug);

      const media = await db.media.create({
        data: {
          tenantId: membership.tenant.id,
          uploadedById: session.user.id,
          filename: stored.filename,
          originalName: file.name,
          mimeType: stored.mimeType,
          size: stored.size,
          url: stored.url,
        },
      });

      results.push({
        id: media.id,
        url: media.url,
        alt: media.alt,
        filename: media.filename,
        originalName: media.originalName,
        mimeType: media.mimeType,
        size: media.size,
        createdAt: media.createdAt,
      });
    } catch (e) {
      if (e instanceof StorageError) {
        return NextResponse.json({ error: e.message }, { status: 422 });
      }
      throw e;
    }
  }

  return NextResponse.json({ ok: true, media: results.length === 1 ? results[0] : results });
}

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
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)));
  const skip = (page - 1) * limit;

  const [media, total] = await Promise.all([
    db.media.findMany({
      where: { tenantId: membership.tenant.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.media.count({ where: { tenantId: membership.tenant.id } }),
  ]);

  return NextResponse.json({
    ok: true,
    media,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
