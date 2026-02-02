interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "neutral";
}

const variantStyles = {
  default:
    "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
  success:
    "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20",
  warning:
    "border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20",
  neutral:
    "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80",
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}: KpiCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${variantStyles[variant]}`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-zinc-600 dark:text-zinc-400 text-sm">
            {title}
          </p>
          <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50 text-2xl truncate tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-zinc-500 dark:text-zinc-400 text-xs">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex justify-center items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg size-10 text-zinc-600 dark:text-zinc-400 shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
