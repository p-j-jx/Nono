import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-12" />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

export function GenerationCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  )
}
