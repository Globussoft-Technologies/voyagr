"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError({ message: data.error ?? "Something went wrong", field: data.field });
        return;
      }
      router.push("/sign-in?signedUp=1");
    } catch {
      setError({ message: "Network error — please try again" });
    } finally {
      setPending(false);
    }
  }

  const fieldError = (name: string) =>
    error?.field === name ? error.message : null;
  const generalError = error && !error.field ? error.message : null;

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight">Create your Voyagr account</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Set up your travel company workspace.
        </p>

        <form method="post" action="/api/auth/sign-up" onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Your name" name="name" type="text" autoComplete="name" />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            error={fieldError("email")}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            hint="At least 8 characters"
            error={fieldError("password")}
          />
          <hr className="border-zinc-200 dark:border-zinc-800" />
          <Field
            label="Travel company name"
            name="tenantName"
            type="text"
            required
            error={fieldError("tenantName")}
          />
          <Field
            label="Subdomain"
            name="tenantSlug"
            type="text"
            required
            placeholder="acme-travels"
            hint="Used as yourname.voyagr.globusdemos.com"
            error={fieldError("tenantSlug")}
          />

          {generalError && (
            <p className="text-sm text-red-600 dark:text-red-400">{generalError}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
  placeholder,
  hint,
  error,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200"
      />
      {hint && !error && (
        <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </label>
  );
}
