import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> &
    VariantProps<typeof labelVariants> & {
      required?: boolean;
      error?: boolean;
    }
>(({ className, required, error, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      labelVariants(),
      error && "text-red-600",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
));
Label.displayName = "Label";

export { Label };