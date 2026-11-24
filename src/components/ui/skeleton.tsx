import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * A pulsing placeholder used by the route-level `loading.tsx` screens while
 * their content streams in. Respects `prefers-reduced-motion: reduce`.
 */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("motion-safe:animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
