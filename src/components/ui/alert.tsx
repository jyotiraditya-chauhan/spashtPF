import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded-lg border p-4 text-sm leading-relaxed", {
  variants: {
    variant: {
      neutral: "border-border bg-muted-tint text-foreground",
      primary: "border-primary/20 bg-primary-tint text-primary",
      warning: "border-warning/25 bg-warning-tint text-warning",
      success: "border-success/25 bg-success-tint text-success",
      error: "border-error/25 bg-error-tint text-error",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="status" className={cn(alertVariants({ variant, className }))} {...props} />;
}

export { Alert, alertVariants };
