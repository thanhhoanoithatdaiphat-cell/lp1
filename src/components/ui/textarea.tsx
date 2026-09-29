import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-border bg-surface px-4 py-3 text-base text-fg md:text-sm placeholder:text-subtle outline-none transition-colors duration-150 focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}
