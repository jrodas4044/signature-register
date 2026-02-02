"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Error al crear la cuenta");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 px-6 min-h-screen">
        <main className="space-y-6 w-full max-w-sm text-center">
          <h1 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl">
            Revisa tu email
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Te enviamos un enlace para confirmar tu cuenta. Haz clic en el enlace
            y luego podrás iniciar sesión.
          </p>
          <Link
            href="/login"
            className="inline-block bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-4 py-2.5 rounded-lg font-medium text-white dark:text-zinc-900"
          >
            Ir a iniciar sesión
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 px-6 min-h-screen">
      <main className="space-y-8 w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl">
            Crear cuenta
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm">
            Control de registro de firmas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-red-700 dark:text-red-400 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 font-medium text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-white dark:bg-zinc-900 px-4 py-2.5 border border-zinc-300 focus:border-zinc-500 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-500 w-full text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 font-medium text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="bg-white dark:bg-zinc-900 px-4 py-2.5 border border-zinc-300 focus:border-zinc-500 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-500 w-full text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 disabled:opacity-50 px-4 py-2.5 rounded-lg w-full font-medium text-white dark:text-zinc-900 transition-colors"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm text-center">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 dark:text-zinc-50 underline hover:no-underline"
          >
            Iniciar sesión
          </Link>
        </p>

        <p className="text-center">
          <Link
            href="/"
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 dark:text-zinc-400 text-sm"
          >
            ← Volver al inicio
          </Link>
        </p>
      </main>
    </div>
  );
}
