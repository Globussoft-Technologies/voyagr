import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let dbStatus: "connected" | "error" = "connected";

  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "error";
  }

  const status = dbStatus === "connected" ? "ok" : "degraded";
  const statusCode = dbStatus === "connected" ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      database: dbStatus,
      uptime: process.uptime(),
    },
    { status: statusCode }
  );
}
