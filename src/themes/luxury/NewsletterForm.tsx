"use client";

import React, { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  return (
    <form
      action="#"
      method="POST"
      className="flex gap-0"
    >
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors duration-300"
        style={{ fontFamily: "var(--theme-font-body)" }}
      />
      <button
        type="submit"
        className="px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-300 hover:opacity-90"
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
