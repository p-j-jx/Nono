export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 w-32 rounded-md bg-muted/60" />
        <div className="h-4 w-48 rounded-md bg-muted/40 mt-2" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border/40">
        <div className="px-4 py-2.5">
          <div className="h-4 w-16 rounded-md bg-muted/60" />
        </div>
        <div className="px-4 py-2.5">
          <div className="h-4 w-16 rounded-md bg-muted/40" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="h-9 flex-1 max-w-xs rounded-md bg-muted/40" />
        <div className="h-9 w-32 rounded-md bg-muted/40" />
        <div className="h-9 w-32 rounded-md bg-muted/40" />
      </div>

      {/* Record cards */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card py-4 px-6">
            <div className="flex items-start gap-4">
              <div className="size-9 shrink-0 rounded-lg bg-muted/60" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/5 rounded-md bg-muted/60" />
                <div className="h-3 w-4/5 rounded-md bg-muted/40" />
                <div className="h-3 w-32 rounded-md bg-muted/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
