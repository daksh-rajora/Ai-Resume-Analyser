import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-[var(--surface)] border border-[var(--border)] shadow-card transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:shadow-hover",
        accent:
          "bg-[var(--accent-hero)] text-white border-transparent bg-[image:linear-gradient(135deg,var(--accent-hero-2)_0%,var(--accent-hero)_55%,var(--accent-hero)_100%)]",
        flat: "",
      },
      radius: {
        md: "rounded-2xl",
        lg: "rounded-3xl",
      },
      padding: {
        none: "",
        sm: "p-3 sm:p-4",
        md: "p-3.5 sm:p-5",
        lg: "p-4 sm:p-6",
      },
    },
    defaultVariants: { variant: "default", radius: "md", padding: "md" },
  }
);

export const Card = forwardRef(
  ({ className, variant, radius, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, radius, padding }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-wrap sm:flex-nowrap items-start justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-4 min-w-0",
      className
    )}
    {...props}
  />
);

export const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-sm font-semibold text-[var(--ink)] tracking-tight break-words",
      className
    )}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-xs text-[var(--ink-muted)] break-words", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("", className)} {...props} />
);
