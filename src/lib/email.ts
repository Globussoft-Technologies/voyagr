import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

export async function testSmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  if (!isSmtpConfigured()) {
    return {
      ok: false,
      error:
        "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in your environment variables.",
    };
  }

  try {
    await transporter.verify();
    return { ok: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown SMTP error";

    if (message.includes("ECONNREFUSED")) {
      return { ok: false, error: "Connection refused. Check SMTP_HOST and SMTP_PORT." };
    }
    if (message.includes("ENOTFOUND")) {
      return { ok: false, error: "SMTP host not found. Check SMTP_HOST." };
    }
    if (message.includes("ETIMEDOUT") || message.includes("timeout")) {
      return { ok: false, error: "Connection timed out. Check SMTP_HOST and SMTP_PORT." };
    }
    if (
      message.includes("Invalid login") ||
      message.includes("authentication") ||
      message.includes("535")
    ) {
      return { ok: false, error: "Authentication failed. Check SMTP_USER and SMTP_PASS." };
    }

    return { ok: false, error: message };
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendBulk(
  recipients: { email: string; name?: string }[],
  subject: string,
  html: string,
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  const batchSize = 10;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (recipient) => {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: recipient.name
              ? `"${recipient.name}" <${recipient.email}>`
              : recipient.email,
            subject,
            html,
          });
          sent++;
        } catch (err) {
          console.error(
            `[email] Failed to send to ${recipient.email}:`,
            err,
          );
          failed++;
        }
      }),
    );

    // Delay between batches (skip after the last batch)
    if (i + batchSize < recipients.length) {
      await delay(1000);
    }
  }

  return { sent, failed };
}
