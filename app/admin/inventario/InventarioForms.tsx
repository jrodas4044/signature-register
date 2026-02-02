"use client";

import { useState } from "react";
import { assignBulkSheets, receiveSheet } from "@/app/actions/hojas";
import type { Lider } from "@/lib/types/domain";

export function InventarioForms({
  lideres,
}: {
  lideres: Pick<Lider, "id" | "nombre" | "zona">[];
}) {
  const [assignResult, setAssignResult] = useState<{
    created: number;
    skipped: number;
    errors: string[];
  } | null>(null);
  const [receiveResult, setReceiveResult] = useState<{
    success: boolean;
    error: string | null;
  } | null>(null);

  return (
    <div className="gap-6 grid md:grid-cols-2">
      <section className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          RF-01 Asignación masiva
        </h3>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400 text-sm">
          Asignar un rango de números de hoja a un líder. Se crean 5 adhesiones por hoja.
        </p>
        <form
          className="space-y-4 mt-4"
          action={async (formData) => {
            const liderId = formData.get("lider_id") as string;
            const fromNum = Number(formData.get("from_num"));
            const toNum = Number(formData.get("to_num"));
            if (!liderId || Number.isNaN(fromNum) || Number.isNaN(toNum)) return;
            const result = await assignBulkSheets(liderId, fromNum, toNum);
            setAssignResult({
              created: result.created,
              skipped: result.skipped,
              errors: result.errors,
            });
            setReceiveResult(null);
          }}
        >
          <div>
            <label
              htmlFor="lider_id"
              className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Líder
            </label>
            <select
              id="lider_id"
              name="lider_id"
              required
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
            >
              <option value="">Seleccionar líder</option>
              {lideres.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre} {l.zona ? `(${l.zona})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="gap-4 grid grid-cols-2">
            <div>
              <label
                htmlFor="from_num"
                className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
              >
                Desde número
              </label>
              <input
                id="from_num"
                name="from_num"
                type="number"
                min={1}
                required
                className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="to_num"
                className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
              >
                Hasta número
              </label>
              <input
                id="to_num"
                name="to_num"
                type="number"
                min={1}
                required
                className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white text-sm"
          >
            Asignar rango
          </button>
        </form>
        {assignResult && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              assignResult.errors.length > 0
                ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200"
                : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
            }`}
          >
            <p>
              Creadas: {assignResult.created}, Omitidas (ya existían): {assignResult.skipped}
            </p>
            {assignResult.errors.length > 0 && (
              <ul className="mt-2 pl-4 list-disc">
                {assignResult.errors.slice(0, 5).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
                {assignResult.errors.length > 5 && (
                  <li>… y {assignResult.errors.length - 5} más</li>
                )}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-zinc-900 shadow-sm p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-50 text-lg">
          Recepción
        </h3>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400 text-sm">
          Registrar recepción de hoja (cambia estado de CIRCULACIÓN a RECIBIDA).
        </p>
        <form
          className="space-y-4 mt-4"
          action={async (formData) => {
            const numeroHoja = Number(formData.get("numero_hoja"));
            if (Number.isNaN(numeroHoja)) return;
            const result = await receiveSheet(numeroHoja);
            setReceiveResult(result);
            setAssignResult(null);
          }}
        >
          <div>
            <label
              htmlFor="numero_hoja"
              className="block font-medium text-zinc-700 dark:text-zinc-300 text-sm"
            >
              Número de hoja
            </label>
            <input
              id="numero_hoja"
              name="numero_hoja"
              type="number"
              min={1}
              required
              placeholder="Ej. 500"
              className="block bg-white dark:bg-zinc-800 mt-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg w-full text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium text-white text-sm"
          >
            Registrar recepción
          </button>
        </form>
        {receiveResult && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              receiveResult.success
                ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
            }`}
          >
            {receiveResult.success
              ? "Hoja registrada como recibida."
              : receiveResult.error}
          </div>
        )}
      </section>
    </div>
  );
}
