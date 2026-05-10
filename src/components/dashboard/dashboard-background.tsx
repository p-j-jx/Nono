export function DashboardBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-background" />

      {/* Primary orb - large top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-primary/20 via-primary/8 to-transparent rounded-full blur-3xl" />

      {/* Accent orbs */}
      <div className="absolute top-60 -right-20 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/12 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl" />

      {/* Subtle floating ring decorative */}
      <div className="absolute top-1/4 right-1/4 size-32 rounded-full border border-primary/[0.03]" />
      <div className="absolute top-1/4 right-1/4 size-48 rounded-full border border-primary/[0.02]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
    </div>
  )
}
