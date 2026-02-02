import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { AdminNav } from "./components/AdminNav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Sidebar */}
      <aside className="top-0 left-0 z-40 fixed bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 border-r w-64 h-screen shrink-0">
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center px-6 border-zinc-200 dark:border-zinc-800 border-b h-16">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50"
            >
              <span
                className="flex justify-center items-center bg-indigo-600 rounded-lg size-8 text-white"
                aria-hidden
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25 2.25H18a2.25 2.25 0 002.25-2.25V13.5a2.25 2.25 0 00-2.25-2.25h-2.25a2.25 2.25 0 00-2.25 2.25v2.25z"
                  />
                </svg>
              </span>
              <span className="text-lg tracking-tight">Admin</span>
            </Link>
          </div>

          <AdminNav />

          {/* Footer */}
          <div className="space-y-0.5 mt-auto p-4 border-zinc-200 dark:border-zinc-800 border-t">
            <Link
              href="/"
              className="flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 dark:text-zinc-400 text-sm transition-colors"
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
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Volver al sitio
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-2.5 rounded-lg w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 dark:text-zinc-400 text-sm text-left transition-colors"
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
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v3.75M15.75 9l-3-3m0 0l-3 3m3-3h8.25M8.25 21H5.625a2.25 2.25 0 01-2.25-2.25V15m13.5 6v.75a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V15m0 0h3.75"
                  />
                </svg>
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <header className="top-0 z-30 sticky flex items-center bg-white/95 supports-backdrop-filter:bg-white/80 dark:bg-zinc-900/95 dark:supports-backdrop-filter:bg-zinc-900/80 backdrop-blur px-8 border-zinc-200 dark:border-zinc-800 border-b h-14">
          <p className="font-medium text-zinc-600 dark:text-zinc-400 text-sm">
            Panel de administración
          </p>
        </header>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
