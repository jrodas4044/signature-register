"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paramName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  paramName = "page",
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete(paramName);
    } else {
      params.set(paramName, String(page));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav
      className="flex justify-between items-center gap-4 bg-zinc-50/50 dark:bg-zinc-800/30 px-6 py-4 border-zinc-200/50 dark:border-zinc-800/50 border-t"
      aria-label="Paginación"
    >
      <p className="flex items-center gap-2 font-medium text-zinc-600 dark:text-zinc-400 text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        Página <span className="font-bold text-zinc-900 dark:text-zinc-50">{currentPage}</span> de <span className="font-bold text-zinc-900 dark:text-zinc-50">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        {prevPage ? (
          <Link
            href={buildHref(prevPage)}
            className="group inline-flex items-center gap-2 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 border border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500 rounded-xl font-semibold text-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 dark:text-zinc-300 text-sm transition-all"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Anterior
          </Link>
        ) : (
          <span
            aria-disabled
            className="inline-flex items-center gap-2 bg-zinc-100/50 dark:bg-zinc-800/30 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold text-zinc-400 dark:text-zinc-500 text-sm cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Anterior
          </span>
        )}
        {nextPage ? (
          <Link
            href={buildHref(nextPage)}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-indigo-700 hover:to-indigo-800 shadow-indigo-500/25 shadow-lg hover:shadow-indigo-500/40 hover:shadow-xl dark:hover:shadow-indigo-500/30 dark:shadow-indigo-500/20 px-4 py-2 rounded-xl font-semibold text-white text-sm hover:scale-[1.02] active:scale-[0.98] transition-all transform"
          >
            Siguiente
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ) : (
          <span
            aria-disabled
            className="inline-flex items-center gap-2 bg-zinc-100/50 dark:bg-zinc-800/30 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold text-zinc-400 dark:text-zinc-500 text-sm cursor-not-allowed"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        )}
      </div>
    </nav>
  );
}
