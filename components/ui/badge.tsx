import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background-color] overflow-hidden shadow-xs",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-border/50 bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/80 dark:text-secondary-foreground",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive dark:bg-destructive/25 dark:text-red-300 dark:border-destructive/40",
        outline:
          "text-foreground border-border bg-background/50 hover:bg-accent hover:text-accent-foreground",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40",
        info:
          "border-blue-500/30 bg-blue-500/10 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40",
        gold:
          "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 dark:bg-amber-500/25 dark:border-amber-500/50 font-bold",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
