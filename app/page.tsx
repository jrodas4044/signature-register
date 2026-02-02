import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 px-6 min-h-screen">
      <main className="flex flex-col items-center gap-8 max-w-md text-center">
        <h1 className="font-semibold text-zinc-900 dark:text-zinc-50 text-4xl leading-tight tracking-tight">
          Control de registro de firmas
        </h1>
        <Link
          href="/login"
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-8 py-3 rounded-lg font-medium text-white dark:text-zinc-900 transition-colors"
        >
          Iniciar sesión
        </Link>
      </main>
    </div>
  );
}
