"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SmtpStatus {
  configured: boolean;
  connected?: boolean;
  error?: string;
}

export default function EmailSettingsPage() {
  const [status, setStatus] = useState<SmtpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/newsletter/test-email")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to check SMTP status");
        return r.json();
      })
      .then((data: SmtpStatus) => setStatus(data))
      .catch(() =>
        setMessage({ type: "error", text: "Failed to check SMTP status." }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSendTest = async () => {
    if (!testEmail.trim()) return;
    setSending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail.trim() }),
      });

      const data = await res.json();

      if (data.ok) {
        setMessage({
          type: "success",
          text: `Test email sent successfully to ${testEmail.trim()}.`,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error ?? "Failed to send test email.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-zinc-500">
        Loading email settings...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Email Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your SMTP configuration for newsletters.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* SMTP Status */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          SMTP Status
        </h2>
        <div className="mt-3 flex items-center gap-2">
          {status?.configured ? (
            status.connected ? (
              <>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Connected
                </span>
              </>
            ) : (
              <>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  Connection failed{status.error ? `: ${status.error}` : ""}
                </span>
              </>
            )
          ) : (
            <>
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-400" />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Not configured
              </span>
            </>
          )}
        </div>
      </div>

      {/* Send Test Email */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Send Test Email
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Verify your SMTP settings by sending a test email.
        </p>

        <div className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="testEmail"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Recipient Email
            </label>
            <input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full max-w-md rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
            />
          </div>
          <button
            onClick={handleSendTest}
            disabled={sending || !testEmail.trim()}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {sending ? "Sending..." : "Send Test Email"}
          </button>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="mb-8 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Configuration
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Configure SMTP settings in your{" "}
          <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
            .env
          </code>{" "}
          file:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              SMTP_HOST
            </code>{" "}
            &mdash; SMTP server hostname
          </li>
          <li>
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              SMTP_PORT
            </code>{" "}
            &mdash; SMTP server port (default: 587)
          </li>
          <li>
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              SMTP_USER
            </code>{" "}
            &mdash; SMTP username
          </li>
          <li>
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              SMTP_PASS
            </code>{" "}
            &mdash; SMTP password
          </li>
          <li>
            <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
              SMTP_FROM
            </code>{" "}
            &mdash; Sender email address
          </li>
        </ul>
      </div>

      {/* Link to Newsletter */}
      <div>
        <Link
          href="/dashboard/newsletter"
          className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Go to Newsletter Dashboard
        </Link>
      </div>
    </div>
  );
}
