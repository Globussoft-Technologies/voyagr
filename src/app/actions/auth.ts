"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { validateTenantSlug } from "@/lib/tenant";
import { signOut as authSignOut } from "@/auth";

const SignUpSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  tenantName: z.string().min(1).max(100),
  tenantSlug: z.string().transform((v) => v.toLowerCase()),
});

export type SignUpResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

export async function signUpAction(
  _prev: SignUpResult | null,
  formData: FormData,
): Promise<SignUpResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name") || undefined,
    tenantName: formData.get("tenantName"),
    tenantSlug: formData.get("tenantSlug"),
  };
  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      error: issue?.message ?? "Invalid input",
      field: issue?.path[0]?.toString(),
    };
  }
  const { email, password, name, tenantName, tenantSlug } = parsed.data;
  const slugError = validateTenantSlug(tenantSlug);
  if (slugError) return { ok: false, error: slugError, field: "tenantSlug" };

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name: name || null, passwordHash },
      });
      const tenant = await tx.tenant.create({
        data: { name: tenantName, slug: tenantSlug },
      });
      await tx.membership.create({
        data: { userId: user.id, tenantId: tenant.id, role: "OWNER" },
      });
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const target = (e.meta?.target as string[] | undefined)?.[0] ?? "";
      if (target === "email")
        return { ok: false, error: "Email already in use", field: "email" };
      if (target === "slug")
        return {
          ok: false,
          error: "Subdomain already taken",
          field: "tenantSlug",
        };
      return { ok: false, error: "A unique value is already taken" };
    }
    throw e;
  }

  redirect("/sign-in?signedUp=1");
}

export async function signOutAction() {
  await authSignOut({ redirectTo: "/" });
}
