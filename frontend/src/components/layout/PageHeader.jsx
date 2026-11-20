import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions, className }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 min-w-0",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--ink)] break-words">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-0.5 sm:mt-1 break-words">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
