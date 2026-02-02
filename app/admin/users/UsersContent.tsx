"use client";

import { useState } from "react";
import { createUser, updateUserRole } from "@/app/actions/users";
import type { UserWithProfile } from "@/app/actions/users";
import type { AppRole } from "@/lib/auth/roles";
import { Pagination } from "../components/Pagination";

const ROLES: { value: AppRole; label: string }[] = [
  { value: "administrador", label: "Administrador" },
  { value: "digitador", label: "Digitador" },
  { value: "auditor", label: "Auditor" },
];

export function UsersContent({
  users: initialUsers,
  total,
  page,
  pageSize,
}: {
  users: UserWithProfile[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("digitador");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const result = await createUser(email, password, role, displayName || null);
    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: "Usuario creado correctamente." });
      setEmail("");
      setPassword("");
      setRole("digitador");
      setDisplayName("");
      window.location.reload();
    } else {
      setMessage({ type: "error", text: result.error ?? "Error al crear." });
    }
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    setMessage(null);
    setUpdatingUserId(userId);
    const result = await updateUserRole(userId, newRole);
    setUpdatingUserId(null);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );
      setMessage({ type: "success", text: "Rol actualizado." });
    } else {
      setMessage({ type: "error", text: result.error ?? "Error al actualizar." });
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Crear usuario (solo administrador)
        </h3>
        <form
          onSubmit={handleCreate}
          className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4 max-w-4xl"
        >
          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AppRole)}
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm">
              Nombre para mostrar (opcional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white text-sm"
            >
              {loading ? "Creando…" : "Crear usuario"}
            </button>
          </div>
        </form>
        {message && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              message.type === "success"
                ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <h3 className="px-6 py-4 border-zinc-200 dark:border-zinc-800 border-b font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Listado de usuarios
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Asignar rol</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-zinc-500 dark:text-zinc-400 text-center"
                  >
                    No hay usuarios. Crea uno arriba.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.user_id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 border-t"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {u.display_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {ROLES.find((r) => r.value === u.role)?.label ?? u.role}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.user_id, e.target.value as AppRole)
                        }
                        disabled={updatingUserId === u.user_id}
                        className="bg-white dark:bg-zinc-800 px-2 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 text-sm disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize) || 1}
          paramName="page"
        />
      </section>
    </div>
  );
}
