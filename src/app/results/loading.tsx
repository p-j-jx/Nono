import { Skeleton, GenerationCardSkeleton } from "@/components/ui/skeleton"

export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <div>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Copy column */}
          <div>
            <Skeleton className="h-5 w-20 mb-5" />
            {Array.from({ length: 4 }).map((_, i) => (
              <GenerationCardSkeleton key={i} />
            ))}
          </div>
          {/* Image column */}
          <div>
            <Skeleton className="h-5 w-20 mb-5" />
            {Array.from({ length: 2 }).map((_, i) => (
              <GenerationCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
