"use server";

import { createClient } from "@/lib/supabase/server";

export type AppRole = "administrador" | "digitador" | "auditor";

export interface Profile {
  id: string;
  user_id: string;
  role: AppRole;
  display_name: string | null;
}

/**
 * Returns the current user's profile and role, or null if not authenticated or no profile.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, user_id, role, display_name")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) return null;
  return profile as Profile;
}

/**
 * Returns the current user's role, or null if not authenticated or no profile.
 */
export async function getCurrentUserRole(): Promise<AppRole | null> {
  const profile = await getProfile();
  return profile?.role ?? null;
}

/**
 * Throws if the current user does not have one of the allowed roles.
 * Use in Server Actions that require specific roles.
 */
export async function requireRole(
  allowedRoles: AppRole[]
): Promise<{ role: AppRole; profile: Profile }> {
  const profile = await getProfile();
  if (!profile) {
    throw new Error("No autenticado o sin perfil.");
  }
  if (!allowedRoles.includes(profile.role)) {
    throw new Error(
      `Acceso denegado. Se requiere uno de los roles: ${allowedRoles.join(", ")}.`
    );
  }
  return { role: profile.role, profile };
}

/**
 * Check if current user has one of the roles (no throw).
 */
export async function hasRole(allowedRoles: AppRole[]): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role !== null && allowedRoles.includes(role);
}
