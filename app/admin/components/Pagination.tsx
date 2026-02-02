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
      className="flex justify-between items-center gap-4 px-4 py-3 border-zinc-200 dark:border-zinc-800 border-t"
      aria-label="Paginación"
    >
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {prevPage ? (
          <Link
            href={buildHref(prevPage)}
            className="inline-flex items-center gap-1 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 text-sm"
          >
            <span aria-hidden>←</span>
            Anterior
          </Link>
        ) : (
          <span
            aria-disabled
            className="inline-flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium text-zinc-400 dark:text-zinc-500 text-sm cursor-not-allowed"
          >
            <span aria-hidden>←</span>
            Anterior
          </span>
        )}
        {nextPage ? (
          <Link
            href={buildHref(nextPage)}
            className="inline-flex items-center gap-1 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 text-sm"
          >
            Siguiente
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <span
            aria-disabled
            className="inline-flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium text-zinc-400 dark:text-zinc-500 text-sm cursor-not-allowed"
          >
            Siguiente
            <span aria-hidden>→</span>
          </span>
        )}
      </div>
    </nav>
  );
}
