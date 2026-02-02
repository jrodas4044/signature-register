interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "neutral";
}

const variantStyles = {
  default: {
    container: "border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm",
    icon: "bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-lg shadow-zinc-500/25 dark:shadow-zinc-500/10",
    value: "text-zinc-900 dark:text-zinc-50",
  },
  success: {
    container: "border-emerald-200/50 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50/80 to-white/80 dark:from-emerald-950/30 dark:to-zinc-900/80 backdrop-blur-sm",
    icon: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/10",
    value: "text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    container: "border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/80 to-white/80 dark:from-amber-950/30 dark:to-zinc-900/80 backdrop-blur-sm",
    icon: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 dark:shadow-amber-500/10",
    value: "text-amber-700 dark:text-amber-300",
  },
  neutral: {
    container: "border-indigo-200/50 dark:border-indigo-800/50 bg-gradient-to-br from-indigo-50/80 to-white/80 dark:from-indigo-950/30 dark:to-zinc-900/80 backdrop-blur-sm",
    icon: "bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/10",
    value: "text-indigo-700 dark:text-indigo-300",
  },
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}: KpiCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <div
      className={`group relative rounded-2xl border p-6 shadow-lg shadow-zinc-900/5 dark:shadow-zinc-950/50 transition-all duration-200 hover:shadow-xl hover:shadow-zinc-900/10 dark:hover:shadow-zinc-950/70 hover:-translate-y-0.5 ${styles.container}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
            {title}
          </p>
          <p className={`mt-2 font-bold text-3xl truncate tracking-tight ${styles.value}`}>
            {value}
          </p>
          {subtitle && (
            <p className="flex items-center gap-1.5 mt-2 text-zinc-600 dark:text-zinc-400 text-xs">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`flex justify-center items-center rounded-xl size-12 text-white shrink-0 transition-transform group-hover:scale-110 ${styles.icon}`}>
            {icon}
          </div>
        )}
      </div>
      
      {/* Decorative element */}
      <div className="right-0 bottom-0 absolute bg-gradient-to-tl from-zinc-100/50 dark:from-zinc-800/50 to-transparent dark:to-transparent opacity-0 group-hover:opacity-100 rounded-br-2xl w-24 h-24 transition-opacity pointer-events-none" aria-hidden="true" />
    </div>
  );
}
