"use client";

import React, { useState } from "react";

interface MobileMenuProps {
  navItems: { label: string; url: string }[];
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        className="md:hidden text-white p-2"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 z-[101] h-full w-72 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--theme-primary, #1a1a2e)" }}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            className="text-white p-2"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-2 px-6 mt-4">
          {navItems.map((item) => (
            <a
              key={item.url}
              href={item.url}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-white/90 hover:text-white py-3 border-b border-white/10 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
