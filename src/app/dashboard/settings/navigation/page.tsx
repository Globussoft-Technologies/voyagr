"use client";

import { useEffect, useState, useCallback } from "react";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  position: number;
  parentId: string | null;
}

export default function NavigationPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/menus");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Separate top-level and children
  const topLevel = items
    .filter((i) => !i.parentId)
    .sort((a, b) => a.position - b.position);

  function childrenOf(parentId: string) {
    return items
      .filter((i) => i.parentId === parentId)
      .sort((a, b) => a.position - b.position);
  }

  // Build ordered flat list for display: parent, then its children, then next parent...
  const orderedItems: MenuItem[] = [];
  for (const parent of topLevel) {
    orderedItems.push(parent);
    orderedItems.push(...childrenOf(parent.id));
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    setError("");

    const res = await fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label.trim(), url: url.trim() }),
    });

    if (res.ok) {
      setLabel("");
      setUrl("");
      fetchItems();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add item");
    }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/menus/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  }

  function startEditing(item: MenuItem) {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditUrl(item.url);
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/menus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editLabel, url: editUrl }),
    });
    if (res.ok) {
      setEditingId(null);
      fetchItems();
    }
  }

  function moveItem(
    list: MenuItem[],
    item: MenuItem,
    direction: "up" | "down",
  ) {
    // Get siblings (same parentId)
    const siblings = list
      .filter((i) => i.parentId === item.parentId)
      .sort((a, b) => a.position - b.position);
    const idx = siblings.findIndex((i) => i.id === item.id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === siblings.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const swapItem = siblings[swapIdx];

    // Swap positions
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, position: swapItem.position };
        if (i.id === swapItem.id) return { ...i, position: item.position };
        return i;
      }),
    );
  }

  async function saveOrder() {
    setSaving(true);
    const payload = items.map((i) => ({
      id: i.id,
      position: i.position,
      parentId: i.parentId,
    }));

    await fetch("/api/menus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Navigation</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your site menu links and their order.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={saveOrder}
            disabled={saving}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? "Saving..." : "Save order"}
          </button>
        )}
      </div>

      {orderedItems.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-950">
          <p className="text-zinc-600 dark:text-zinc-400">
            No menu items yet. Add one below.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {orderedItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 ${item.parentId ? "ml-8" : ""}`}
              >
                {editingId === item.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      placeholder="Label"
                    />
                    <input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      placeholder="URL"
                    />
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-zinc-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-1 items-center gap-3">
                      {item.parentId && (
                        <span className="text-zinc-300 dark:text-zinc-700">
                          --
                        </span>
                      )}
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {item.url}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(items, item, "up")}
                        className="rounded px-1.5 py-0.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="Move up"
                      >
                        &uarr;
                      </button>
                      <button
                        onClick={() => moveItem(items, item, "down")}
                        className="rounded px-1.5 py-0.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="Move down"
                      >
                        &darr;
                      </button>
                      <button
                        onClick={() => startEditing(item)}
                        className="text-xs text-zinc-600 hover:underline dark:text-zinc-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add menu item form */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium">Add menu item</h2>
        <form onSubmit={addItem} className="mt-3 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Home"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="/"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add
          </button>
        </form>
        {error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
