"use client";

import React, { useState } from "react";
import SearchBar from "@/components/search/SearchBar";

export default function HeaderSearch({ tenantSlug }: { tenantSlug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Search icon button */}
      <button
        onClick={() => setOpen(true)}
        className="text-white p-2 hover:text-white/80 transition-colors duration-200"
        aria-label="Open search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Search overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Search bar container */}
          <div className="fixed top-0 left-0 right-0 z-[201] pt-20 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <SearchBar tenantSlug={tenantSlug} />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute -top-10 right-0 text-white/80 hover:text-white p-1"
                  aria-label="Close search"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
