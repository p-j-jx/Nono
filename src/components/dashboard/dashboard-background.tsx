export function DashboardBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-500/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-emerald-500/6 to-transparent rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
    </div>
  )
}
