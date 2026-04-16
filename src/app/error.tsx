"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center px-6">
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-100">Something went wrong</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="mt-6 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
