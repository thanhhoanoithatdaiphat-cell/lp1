import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md border border-border bg-surface px-4 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-150 focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}
