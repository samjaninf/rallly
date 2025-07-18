import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "./lib/utils";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "md" | "lg";
  error?: boolean;
};

const inputVariants = cva(
  cn(
    "w-full focus:ring-2 focus:ring-ring focus-visible:border-gray-300",
    "h-9 rounded-md border border-input bg-white file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  ),
  {
    variants: {
      size: {
        sm: "h-7 px-1 text-xs",
        md: "h-8 px-2 text-sm",
        lg: "h-12 px-3 text-base",
      },
      variant: {
        default: "border-primary-400 focus-visible:border-primary-400",
        error: "border-rose-400 focus-visible:border-rose-400",
        ghost: "border-transparent focus-visible:border-primary-400",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ size }),
          error
            ? "focus-visible:border-rose-400 focus-visible:ring-rose-100"
            : "focus-visible:border-primary-400 focus-visible:ring-primary-100",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
