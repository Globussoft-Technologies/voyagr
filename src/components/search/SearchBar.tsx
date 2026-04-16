"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
}

interface SearchResponse {
  pages: SearchResult[];
  posts: SearchResult[];
}

export default function SearchBar({ tenantSlug }: { tenantSlug: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&domain=${encodeURIComponent(tenantSlug)}`
        );
        if (res.ok) {
          setResults(await res.json());
        }
      } finally {
        setLoading(false);
      }
    },
    [tenantSlug]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchResults(val), 300);
  };

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setResults(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setResults(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const hasResults =
    results && (results.pages.length > 0 || results.posts.length > 0);
  const showDropdown = results !== null;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        {/* Magnifying glass icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: "var(--theme-text)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search pages and posts..."
          autoFocus
          className="w-full pl-10 pr-4 py-3 rounded-lg text-sm border transition-all duration-200 focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--theme-primary)",
            color: "var(--theme-text)",
            backgroundColor: "var(--theme-background)",
          }}
        />
      </div>

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
          style={{
            backgroundColor: "var(--theme-background)",
            border: "1px solid var(--theme-primary)",
          }}
        >
          {loading && (
            <div className="px-4 py-3 text-sm opacity-50" style={{ color: "var(--theme-text)" }}>
              Searching...
            </div>
          )}

          {!loading && !hasResults && (
            <div className="px-4 py-3 text-sm opacity-50" style={{ color: "var(--theme-text)" }}>
              No results found.
            </div>
          )}

          {!loading && hasResults && (
            <>
              {results.pages.length > 0 && (
                <div>
                  <div
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--theme-accent)", backgroundColor: "rgba(0,0,0,0.03)" }}
                  >
                    Pages
                  </div>
                  {results.pages.map((page) => (
                    <a
                      key={page.id}
                      href={`/${page.slug}`}
                      className="block px-4 py-3 transition-colors duration-150 hover:opacity-80"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                    >
                      <div className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>
                        {page.title}
                      </div>
                      <div className="text-xs mt-1 opacity-50 line-clamp-1" style={{ color: "var(--theme-text)" }}>
                        {page.excerpt}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {results.posts.length > 0 && (
                <div>
                  <div
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--theme-accent)", backgroundColor: "rgba(0,0,0,0.03)" }}
                  >
                    Posts
                  </div>
                  {results.posts.map((post) => (
                    <a
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block px-4 py-3 transition-colors duration-150 hover:opacity-80"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                    >
                      <div className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>
                        {post.title}
                      </div>
                      <div className="text-xs mt-1 opacity-50 line-clamp-1" style={{ color: "var(--theme-text)" }}>
                        {post.excerpt}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
