import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-zinc-50 dark:from-zinc-950 via-zinc-50 dark:via-zinc-950 to-indigo-50/30 dark:to-indigo-950/20 px-6 min-h-screen overflow-hidden">
      {/* Decorative background elements */}
      <div className="top-0 left-0 absolute bg-gradient-to-br from-indigo-500/10 dark:from-indigo-500/5 to-purple-500/10 dark:to-purple-500/5 blur-3xl rounded-full w-96 h-96 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
      <div className="right-0 bottom-0 absolute bg-gradient-to-tl from-blue-500/10 dark:from-blue-500/5 to-cyan-500/10 dark:to-cyan-500/5 blur-3xl rounded-full w-96 h-96 translate-x-1/2 translate-y-1/2" aria-hidden="true" />
      
      <main className="z-10 relative flex flex-col items-center gap-10 max-w-2xl text-center animate-fadeIn">
        {/* Logo/Icon */}
        <div className="flex justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-indigo-500/25 shadow-lg dark:shadow-indigo-500/10 rounded-2xl w-20 h-20">
          <svg
            className="w-11 h-11 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>

        {/* Title and description */}
        <div className="space-y-4">
          <h1 className="font-bold text-zinc-900 dark:text-zinc-50 text-5xl md:text-6xl leading-tight tracking-tight">
            Control de registro
            <span className="block bg-clip-text bg-gradient-to-r from-indigo-600 dark:from-indigo-400 to-purple-600 dark:to-purple-400 mt-2 text-transparent">
              de firmas
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            Sistema profesional para la gestión y seguimiento de adhesiones y firmas de la organización UNION
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex sm:flex-row flex-col items-center gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="group relative bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-indigo-700 hover:to-indigo-800 shadow-indigo-500/25 shadow-lg hover:shadow-indigo-500/40 hover:shadow-xl dark:hover:shadow-indigo-500/30 dark:shadow-indigo-500/20 px-8 py-3.5 rounded-xl w-full sm:w-auto font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 transform"
          >
            <span className="flex justify-center items-center gap-2">
              Iniciar sesión
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </Link>
          
          <Link
            href="/signup"
            className="group bg-white/80 hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-900 backdrop-blur-sm px-8 py-3.5 border border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600 rounded-xl w-full sm:w-auto font-semibold text-zinc-900 dark:text-zinc-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 transform"
          >
            <span className="flex justify-center items-center gap-2">
              Crear cuenta
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Features */}
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-3 mt-8 w-full">
          {[
            { icon: "📊", title: "Dashboard", desc: "Análisis en tiempo real" },
            { icon: "🔒", title: "Seguro", desc: "Datos protegidos" },
            { icon: "⚡", title: "Rápido", desc: "Respuesta inmediata" },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/50 dark:bg-zinc-900/50 hover:shadow-lg backdrop-blur-sm p-6 border border-zinc-200/50 hover:border-indigo-200 dark:border-zinc-800/50 dark:hover:border-indigo-900/50 rounded-xl transition-all duration-200"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
