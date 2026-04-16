"use client";

import { useState } from "react";

export function SubscribeWidget({ tenantId }: { tenantId: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribers", {
        method: "POST",
        body: JSON.stringify({ email, tenantId }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Subscribed successfully!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-lg font-semibold tracking-tight">
        Subscribe to our newsletter
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Get the latest updates delivered to your inbox.
      </p>

      {status === "success" ? (
        <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {message}
        </p>
      )}
    </div>
  );
}
