"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/roles";
import type { AppRole } from "@/lib/auth/roles";

export interface UserWithProfile {
  user_id: string;
  email: string;
  role: AppRole;
  display_name: string | null;
}

export interface ListUsersResult {
  data: UserWithProfile[];
  total: number;
  page: number;
  pageSize: number;
  error: string | null;
}

export async function listUsers(
  page = 1,
  pageSize = 10
): Promise<ListUsersResult> {
  try {
    await requireRole(["administrador"]);
    const admin = createAdminClient();

    const { data: authData, error: authError } =
      await admin.auth.admin.listUsers({
        page,
        perPage: pageSize,
      });

    if (authError) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        error: authError.message,
      };
    }

    const users = authData?.users ?? [];
    const total = authData?.total ?? 0;

    if (users.length === 0) {
      return {
        data: [],
        total,
        page,
        pageSize,
        error: null,
      };
    }

    const userIds = users.map((u) => u.id);
    const { data: profiles, error: profilesError } = await admin
      .from("profiles")
      .select("user_id, role, display_name")
      .in("user_id", userIds);

    if (profilesError) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        error: profilesError.message,
      };
    }

    const profileByUserId = new Map(
      (profiles ?? []).map((p) => [p.user_id, p])
    );

    const data: UserWithProfile[] = users.map((u) => {
      const profile = profileByUserId.get(u.id);
      return {
        user_id: u.id,
        email: u.email ?? "",
        role: (profile?.role ?? "digitador") as AppRole,
        display_name: profile?.display_name ?? null,
      };
    });

    return {
      data,
      total,
      page,
      pageSize,
      error: null,
    };
  } catch (e) {
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      error: e instanceof Error ? e.message : "Error al listar usuarios.",
    };
  }
}

export interface CreateUserResult {
  success: boolean;
  error?: string;
}

export async function createUser(
  email: string,
  password: string,
  role: AppRole,
  displayName?: string | null
): Promise<CreateUserResult> {
  try {
    await requireRole(["administrador"]);
    const admin = createAdminClient();

    const { data: userData, error: createError } =
      await admin.auth.admin.createUser({
        email: email.trim(),
        password,
        email_confirm: true,
        user_metadata: displayName ? { full_name: displayName } : undefined,
      });

    if (createError) {
      return { success: false, error: createError.message };
    }

    if (!userData?.user?.id) {
      return { success: false, error: "Usuario creado pero sin ID." };
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update({
        role,
        display_name: displayName?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userData.user.id);

    if (updateError) {
      return {
        success: false,
        error: `Usuario creado pero falló asignar rol: ${updateError.message}`,
      };
    }

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Error al crear usuario.",
    };
  }
}

export interface UpdateUserRoleResult {
  success: boolean;
  error?: string;
}

export async function updateUserRole(
  userId: string,
  role: AppRole
): Promise<UpdateUserRoleResult> {
  try {
    await requireRole(["administrador"]);
    const admin = createAdminClient();

    const { error } = await admin
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Error al actualizar rol.",
    };
  }
}
