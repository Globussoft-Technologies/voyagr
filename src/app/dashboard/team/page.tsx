"use client";

import { useEffect, useState } from "react";

interface Member {
  id: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface TeamData {
  members: Member[];
  currentRole: string;
  currentUserId: string;
}

const roleBadge: Record<string, string> = {
  OWNER:
    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  ADMIN:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  EDITOR:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
};

export default function TeamPage() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function loadTeam() {
    try {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Failed to load team");
      const json = await res.json();
      setData(json);
    } catch {
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName,
          password: invitePassword,
          role: inviteRole,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", message: json.error ?? "Failed to invite member" });
        return;
      }
      setFeedback({ type: "success", message: "Team member added successfully" });
      setInviteEmail("");
      setInviteName("");
      setInvitePassword("");
      setInviteRole("EDITOR");
      await loadTeam();
    } catch {
      setFeedback({ type: "error", message: "Something went wrong" });
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleRoleChange(memberId: string, newRole: string) {
    setFeedback(null);
    try {
      const res = await fetch(`/api/team/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", message: json.error ?? "Failed to update role" });
        return;
      }
      await loadTeam();
    } catch {
      setFeedback({ type: "error", message: "Something went wrong" });
    }
  }

  async function handleRemove(memberId: string, memberName: string | null) {
    if (!confirm(`Remove ${memberName ?? "this member"} from the team?`)) return;
    setFeedback(null);
    try {
      const res = await fetch(`/api/team/${memberId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", message: json.error ?? "Failed to remove member" });
        return;
      }
      setFeedback({ type: "success", message: "Member removed" });
      await loadTeam();
    } catch {
      setFeedback({ type: "error", message: "Something went wrong" });
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="mt-4 text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="mt-4 text-sm text-red-600">{error || "Failed to load"}</p>
      </div>
    );
  }

  const isOwner = data.currentRole === "OWNER";

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage your workspace members and their roles.
      </p>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Invite form — only for OWNER */}
      {isOwner && (
        <form
          onSubmit={handleInvite}
          className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h2 className="font-medium">Invite member</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add a new member to your workspace.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="member@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Name
              </label>
              <input
                type="text"
                required
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Temporary password
              </label>
              <input
                type="text"
                required
                minLength={8}
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="min 8 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={inviteLoading}
            className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {inviteLoading ? "Inviting..." : "Invite member"}
          </button>
        </form>
      )}

      {/* Team members table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              {isOwner && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {data.members.map((m) => {
              const isSelf = m.user.id === data.currentUserId;
              const isTargetOwner = m.role === "OWNER";

              return (
                <tr
                  key={m.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="px-4 py-3 font-medium">
                    {m.user.name ?? "-"}
                    {isSelf && (
                      <span className="ml-2 text-xs text-zinc-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {m.user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${roleBadge[m.role] ?? ""}`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  {isOwner && (
                    <td className="px-4 py-3 text-right">
                      {!isSelf && !isTargetOwner && (
                        <div className="flex items-center justify-end gap-3">
                          <select
                            value={m.role}
                            onChange={(e) => handleRoleChange(m.id, e.target.value)}
                            className="rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="EDITOR">Editor</option>
                          </select>
                          <button
                            onClick={() => handleRemove(m.id, m.user.name)}
                            className="text-xs text-red-600 hover:underline dark:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
