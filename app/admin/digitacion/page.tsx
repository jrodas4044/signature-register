import { DigitacionSpeedType } from "./DigitacionSpeedType";

export default function DigitacionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-2xl tracking-tight">
          Digitación (Speed-Type)
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm">
          Captura rápida con teclado. Ingrese número de hoja, cargue y complete las 5 líneas (Tab/Enter).
        </p>
      </div>
      <DigitacionSpeedType />
    </div>
  );
}
