export default function TenantNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="text-center">
        <h1 className="text-6xl font-bold" style={{ color: "var(--theme-primary)" }}>404</h1>
        <p className="mt-4 text-lg opacity-60">This page could not be found.</p>
        <a href="/" className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "var(--theme-primary)" }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}
