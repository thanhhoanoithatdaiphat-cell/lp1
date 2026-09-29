import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted", className)}
      {...props}
    />
  );
}
