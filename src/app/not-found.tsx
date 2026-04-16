import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">This page could not be found.</p>
        <Link href="/" className="mt-6 inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
          Go home
        </Link>
      </div>
    </div>
  );
}
