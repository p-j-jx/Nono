import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Skeleton className="h-4 w-24 mb-6" />

      {/* Project Info */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Generation Options */}
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-5">
            <Skeleton className="size-10 rounded-lg mb-3" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
