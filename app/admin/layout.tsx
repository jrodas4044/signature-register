import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { AdminNav } from "./components/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gradient-to-br from-zinc-50 dark:from-zinc-950 via-zinc-50 dark:via-zinc-950 to-zinc-100/50 dark:to-zinc-900/50 min-h-screen">
      {/* Sidebar */}
      <aside className="top-0 left-0 z-40 fixed bg-white/80 dark:bg-zinc-900/80 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 border-r w-64 h-screen shrink-0">
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center px-6 border-zinc-200/50 dark:border-zinc-800/50 border-b h-16">
            <Link
              href="/admin"
              className="group flex items-center gap-2.5 font-bold text-zinc-900 dark:text-zinc-50 transition-all"
            >
              <span
                className="flex justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-indigo-500/25 shadow-lg dark:shadow-indigo-500/10 rounded-xl size-9 text-white group-hover:scale-110 transition-transform"
                aria-hidden
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25 2.25H18a2.25 2.25 0 002.25-2.25V13.5a2.25 2.25 0 00-2.25-2.25h-2.25a2.25 2.25 0 00-2.25 2.25v2.25z"
                  />
                </svg>
              </span>
              <span className="text-lg tracking-tight">UNION Admin</span>
            </Link>
          </div>

          <AdminNav />

          {/* Footer */}
          <div className="space-y-1 mt-auto p-4 border-zinc-200/50 dark:border-zinc-800/50 border-t">
            <Link
              href="/"
              className="group flex items-center gap-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 px-3 py-2.5 rounded-xl text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 dark:text-zinc-400 text-sm transition-all"
            >
              <svg
                className="size-5 transition-transform group-hover:-translate-x-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span className="font-medium">Volver al sitio</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="group flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2.5 rounded-xl w-full text-zinc-600 hover:text-red-600 dark:hover:text-red-400 dark:text-zinc-400 text-sm text-left transition-all"
              >
                <svg
                  className="size-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <header className="top-0 z-30 sticky flex items-center bg-white/80 dark:bg-zinc-900/80 shadow-sm shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-xl px-8 border-zinc-200/50 dark:border-zinc-800/50 border-b h-16">
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                Panel de administración
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                Sistema de control de registro de firmas
              </p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg">
              <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />
              <span className="font-medium text-indigo-700 dark:text-indigo-300 text-xs">
                Sistema activo
              </span>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
