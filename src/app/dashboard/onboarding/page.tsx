"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { themes, type ThemeConfig } from "@/lib/themes/registry";

const RichEditor = dynamic(() => import("@/components/editor/RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 animate-pulse" />
  ),
});

const FEATURED_THEME_KEYS = [
  "modern-luxury",
  "extreme-adventure",
  "tropical-paradise",
  "african-safari",
  "ancient-world",
  "yoga-retreat",
  "mediterranean-blue",
  "mountain-explorer",
  "festival-travel",
  "surf-coast",
  "culinary-heritage",
  "arctic-voyage",
];

const STEP_LABELS = [
  "Company Info",
  "Theme",
  "Navigation",
  "First Page",
  "All Set!",
];

const DEFAULT_MENU_ITEMS = [
  { label: "Home", url: "/" },
  { label: "About", url: "/about" },
  { label: "Destinations", url: "/destinations" },
  { label: "Blog", url: "/blog" },
  { label: "Contact", url: "/contact" },
];

type MenuItem = { label: string; url: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");

  // Step 2
  const [selectedTheme, setSelectedTheme] = useState("starter");

  // Step 3
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);

  // Step 4
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pagePublished, setPagePublished] = useState(true);

  // Load tenant info on mount
  useEffect(() => {
    fetch("/api/tenant/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.name) setCompanyName(data.name);
        if (data.slug) setTenantSlug(data.slug);
        if (data.themeKey) setSelectedTheme(data.themeKey);
        if (data.description) setDescription(data.description);
        if (data.onboardingCompleted) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "lvh.me:3000";
  const protocol =
    rootDomain.includes("localhost") || rootDomain.includes("lvh.me")
      ? "http"
      : "https";
  const liveUrl = `${protocol}://${tenantSlug}.${rootDomain}`;

  const clearError = useCallback(() => setError(""), []);

  async function saveStep1() {
    if (!companyName.trim()) {
      setError("Company name is required.");
      return false;
    }
    setSaving(true);
    clearError();
    try {
      const res = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyName.trim(), description: description.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        return false;
      }
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveStep2() {
    setSaving(true);
    clearError();
    try {
      const res = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeKey: selectedTheme }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save theme.");
        return false;
      }
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveStep3() {
    const valid = menuItems.filter((m) => m.label.trim() && m.url.trim());
    if (valid.length === 0) {
      setError("Add at least one menu item.");
      return false;
    }
    setSaving(true);
    clearError();
    try {
      for (let i = 0; i < valid.length; i++) {
        const res = await fetch("/api/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: valid[i].label.trim(),
            url: valid[i].url.trim(),
            position: i,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to save menu items.");
          return false;
        }
      }
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveStep4() {
    if (!pageTitle.trim()) {
      setError("Page title is required.");
      return false;
    }
    const slug = pageSlug || slugify(pageTitle);
    if (!slug) {
      setError("Page slug is required.");
      return false;
    }
    setSaving(true);
    clearError();
    try {
      const formData = new FormData();
      formData.append("title", pageTitle.trim());
      formData.append("slug", slug);
      formData.append("content", pageContent);
      formData.append("published", pagePublished ? "true" : "false");

      const res = await fetch("/api/pages", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create page.");
        return false;
      }
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function completeOnboarding() {
    setSaving(true);
    clearError();
    try {
      await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingCompleted: true }),
      });
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function skipOnboarding() {
    setSaving(true);
    try {
      await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingCompleted: true }),
      });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  }

  async function handleContinue() {
    clearError();
    let success = false;

    if (currentStep === 1) success = await saveStep1();
    else if (currentStep === 2) success = await saveStep2();
    else if (currentStep === 3) success = await saveStep3();
    else if (currentStep === 4) success = await saveStep4();
    else if (currentStep === 5) {
      await completeOnboarding();
      return;
    }

    if (success) setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    clearError();
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  function updateMenuItem(index: number, field: "label" | "url", value: string) {
    setMenuItems((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function removeMenuItem(index: number) {
    setMenuItems((items) => items.filter((_, i) => i !== index));
  }

  function addMenuItem() {
    setMenuItems((items) => [...items, { label: "", url: "/" }]);
  }

  const featuredThemes: ThemeConfig[] = FEATURED_THEME_KEYS.map(
    (key) => themes[key]
  ).filter(Boolean);

  return (
    <div className="w-full max-w-2xl">
      {/* Skip link */}
      <div className="flex justify-end mb-4">
        <button
          onClick={skipOnboarding}
          disabled={saving}
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          Skip setup
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isCompleted
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 ring-2 ring-zinc-900/20 dark:ring-white/20"
                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[11px] whitespace-nowrap ${
                    isActive || isCompleted
                      ? "font-medium text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-2 mt-[-18px] h-0.5 w-8 sm:w-12 ${
                    step < currentStep
                      ? "bg-zinc-900 dark:bg-white"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: Company Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Welcome to Voyagr! Let&apos;s set up your travel site.
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Start by confirming your company details.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Company name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your travel company"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Tagline / Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description of your travel business..."
                rows={3}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none resize-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
              />
            </div>
          </div>
        )}

        {/* Step 2: Choose Theme */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Pick a look that matches your brand
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Choose a theme to get started. You can always change it later.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {featuredThemes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => setSelectedTheme(theme.key)}
                  className={`group relative rounded-lg border-2 p-3 text-left transition-all ${
                    selectedTheme === theme.key
                      ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900"
                      : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {Object.values(theme.colors)
                      .slice(0, 4)
                      .map((color, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full border border-zinc-200 dark:border-zinc-700"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                  <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {theme.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 line-clamp-2">
                    {theme.description}
                  </div>
                  {selectedTheme === theme.key && (
                    <div className="absolute top-2 right-2">
                      <svg className="h-4 w-4 text-zinc-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Navigation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Create your site menu
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Set up the navigation links for your site. You can edit these anytime.
              </p>
            </div>
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateMenuItem(index, "label", e.target.value)}
                    placeholder="Label"
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => updateMenuItem(index, "url", e.target.value)}
                    placeholder="/path"
                    className="w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                  />
                  <button
                    onClick={() => removeMenuItem(index)}
                    className="flex-shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                    title="Remove item"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addMenuItem}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              + Add menu item
            </button>
          </div>
        )}

        {/* Step 4: First Page */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Write your first page
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Create a page to get some content on your site right away.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Page title
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => {
                  setPageTitle(e.target.value);
                  setPageSlug(slugify(e.target.value));
                }}
                placeholder="e.g. About Us"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                URL slug
              </label>
              <div className="flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 mb-1">
                <span>{tenantSlug}.{rootDomain}/</span>
              </div>
              <input
                type="text"
                value={pageSlug}
                onChange={(e) => setPageSlug(slugify(e.target.value))}
                placeholder="about-us"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Content
              </label>
              <RichEditor
                value={pageContent}
                onChange={setPageContent}
                placeholder="Write your page content here..."
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pagePublished}
                onChange={(e) => setPagePublished(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Publish immediately
              </span>
            </label>
          </div>
        )}

        {/* Step 5: All Set */}
        {currentStep === 5 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Your travel site is live!
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Great job setting everything up. Your site is ready for visitors.
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-3 dark:bg-zinc-900 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Your site URL</p>
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
              >
                {liveUrl}
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors"
              >
                View your site
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                onClick={completeOnboarding}
                disabled={saving}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
              >
                {saving ? "Saving..." : "Go to Dashboard"}
              </button>
            </div>
          </div>
        )}

        {/* Navigation buttons (steps 1-4) */}
        {currentStep < 5 && (
          <div className="mt-8 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                disabled={saving}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleContinue}
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
