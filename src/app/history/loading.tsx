import { Skeleton } from "@/components/ui/skeleton"

export default function HistoryLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Skeleton className="h-7 w-32 mb-1" />
      <Skeleton className="h-4 w-48 mb-6" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-lg" />
      </div>

      {/* Records */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="size-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
