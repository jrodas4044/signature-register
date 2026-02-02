import { listUsers } from "@/app/actions/users";
import { UsersContent } from "./UsersContent";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(50, Math.max(5, parseInt(params.pageSize ?? "10", 10) || 10));
  const { data: users, total, error } = await listUsers(page, pageSize);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Usuarios
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          Crear usuarios y asignar roles (administrador, digitador, auditor).
        </p>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <UsersContent
        users={users ?? []}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
}
