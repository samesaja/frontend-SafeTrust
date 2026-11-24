import { Skeleton } from "@/components/ui/skeleton";

export type DashboardSkeletonVariant = "overview" | "table" | "form" | "list";

export function DashboardPageSkeleton({
  variant,
  label,
}: {
  variant: DashboardSkeletonVariant;
  label: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-busy="true"
      className="w-full min-w-0 space-y-6"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      {variant === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                data-testid="skeleton-stat-tile"
                className="dashboard-glass-card rounded-xl p-6 space-y-3"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>

          <div
            data-testid="skeleton-table-block"
            className="dashboard-glass-card rounded-xl p-6 space-y-4"
          >
            <Skeleton className="h-6 w-48 max-w-full" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      )}

      {variant === "table" && (
        <div className="dashboard-glass-card rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-10 w-64 max-w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                data-testid="skeleton-table-row"
                className="h-12 w-full"
              />
            ))}
          </div>
        </div>
      )}

      {variant === "form" && (
        <div className="dashboard-glass-card max-w-2xl rounded-xl p-6 space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              data-testid="skeleton-form-field"
              className="space-y-2"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="dashboard-glass-card rounded-xl p-6 space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              data-testid="skeleton-list-row"
              className="flex items-center gap-3"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-48 max-w-full" />
                <Skeleton className="h-3 w-72 max-w-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
