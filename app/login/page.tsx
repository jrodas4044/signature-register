"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Error al iniciar sesión");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-zinc-50 dark:from-zinc-950 via-zinc-50 dark:via-zinc-950 to-indigo-50/30 dark:to-indigo-950/20 px-6 min-h-screen overflow-hidden">
      {/* Decorative background */}
      <div className="top-1/4 left-1/4 absolute bg-gradient-to-br from-indigo-500/10 dark:from-indigo-500/5 to-purple-500/10 dark:to-purple-500/5 blur-3xl rounded-full w-96 h-96 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      
      <main className="z-10 relative space-y-8 bg-white/80 dark:bg-zinc-900/80 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-xl p-8 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl w-full max-w-md animate-fadeIn">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="flex justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-indigo-500/25 shadow-lg dark:shadow-indigo-500/10 rounded-xl w-14 h-14">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>
          </div>
          <h1 className="font-bold text-zinc-900 dark:text-zinc-50 text-3xl tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Accede a tu cuenta para gestionar el registro de firmas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800/50 rounded-xl text-red-700 dark:text-red-400 text-sm animate-slideIn"
              role="alert"
            >
              <svg
                className="flex-shrink-0 mt-0.5 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block font-semibold text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <div className="top-0 bottom-0 left-0 absolute flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-white dark:bg-zinc-900/50 py-3 pr-4 pl-10 border border-zinc-300 focus:border-indigo-500 dark:border-zinc-700 dark:focus:border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full text-zinc-900 dark:text-zinc-50 transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block font-semibold text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="top-0 bottom-0 left-0 absolute flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-white dark:bg-zinc-900/50 py-3 pr-4 pl-10 border border-zinc-300 focus:border-indigo-500 dark:border-zinc-700 dark:focus:border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full text-zinc-900 dark:text-zinc-50 transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative bg-gradient-to-r from-indigo-600 hover:from-indigo-700 disabled:from-indigo-400 to-indigo-700 hover:to-indigo-800 disabled:to-indigo-500 shadow-indigo-500/25 shadow-lg hover:shadow-indigo-500/40 hover:shadow-xl disabled:shadow-md dark:hover:shadow-indigo-500/30 dark:shadow-indigo-500/20 py-3 rounded-xl w-full font-semibold text-white hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 transition-all duration-200 disabled:cursor-not-allowed transform"
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <div className="space-y-4 pt-4 border-zinc-200 dark:border-zinc-800 border-t">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm text-center">
            ¿No tienes cuenta?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-300 dark:text-indigo-400 transition-colors"
            >
              Crear una cuenta
            </Link>
          </p>

          <p className="text-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 dark:text-zinc-400 text-sm transition-colors"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-zinc-50 dark:from-zinc-950 via-zinc-50 dark:via-zinc-950 to-indigo-50/30 dark:to-indigo-950/20 px-6 min-h-screen overflow-hidden">
      <div className="top-1/4 left-1/4 absolute bg-gradient-to-br from-indigo-500/10 dark:from-indigo-500/5 to-purple-500/10 dark:to-purple-500/5 blur-3xl rounded-full w-96 h-96 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      
      <main className="z-10 relative space-y-8 bg-white/80 dark:bg-zinc-900/80 shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/50 backdrop-blur-xl p-8 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl w-full max-w-md">
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="flex justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-indigo-500/25 shadow-lg dark:shadow-indigo-500/10 rounded-xl w-14 h-14 animate-pulse">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </div>
          </div>
          <h1 className="font-bold text-zinc-900 dark:text-zinc-50 text-3xl tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Cargando...
          </p>
        </div>
      </main>
    </div>
  );
}
