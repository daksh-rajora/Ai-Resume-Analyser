import { NavLink } from "react-router-dom";
import { LayoutGrid, FileText, BarChart3, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/resumes", icon: FileText, label: "Resumes" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/versions", icon: Layers, label: "Versions" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[var(--surface)]/95 backdrop-blur-lg border-t border-[var(--border)] px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl px-2 py-1 transition-colors select-none",
                isActive
                  ? "text-[var(--ink)] font-semibold"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center transition-transform",
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] scale-105"
                      : "text-[var(--ink-muted)]"
                  )}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
