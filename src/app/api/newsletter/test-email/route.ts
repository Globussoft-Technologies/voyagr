import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isSmtpConfigured, sendEmail, testSmtpConnection } from "@/lib/email";

/* GET — check SMTP configuration status */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const configured = isSmtpConfigured();
  if (!configured) {
    return NextResponse.json({ configured: false });
  }

  const result = await testSmtpConnection();
  return NextResponse.json({ configured: true, connected: result.ok, error: result.error });
}

/* POST — send a test email */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const to = typeof body.to === "string" ? body.to.trim() : "";

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 422 },
    );
  }

  // Check SMTP connection first
  const smtpCheck = await testSmtpConnection();
  if (!smtpCheck.ok) {
    return NextResponse.json({ ok: false, error: smtpCheck.error }, { status: 503 });
  }

  try {
    await sendEmail(
      to,
      "Voyagr Newsletter Test",
      `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #18181b;">Voyagr Newsletter Test</h2>
        <p style="color: #3f3f46; line-height: 1.6;">
          This is a test email from Voyagr. If you received this, your SMTP settings are configured correctly.
        </p>
      </div>`,
    );

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send test email.";
    console.error("[test-email] Send failed:", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
