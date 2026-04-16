"use client";

export default function FooterNewsletter() {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email address"
        className="px-4 py-2.5 rounded-lg text-sm bg-white/10 border border-white/20 placeholder-white/50 text-white focus:outline-none focus:border-white/50 transition-all duration-300"
      />
      <button
        type="submit"
        className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:opacity-90"
        style={{
          backgroundColor: "var(--theme-accent)",
          color: "var(--theme-primary)",
        }}
      >
        Subscribe
      </button>
    </form>
  );
}
