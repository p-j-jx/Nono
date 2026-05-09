export function DashboardBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-background" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-primary/20 via-primary/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-500/12 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />

      <div className="absolute top-32 left-[8%] size-2.5 rounded-full bg-primary/20 animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute top-60 right-[12%] size-2 rounded-full bg-cyan-400/25 animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-32 left-[15%] size-3 rounded-full bg-emerald-400/20 animate-float" style={{ animationDelay: "3s" }} />

      <div className="absolute -top-10 right-[10%] size-52 rounded-full border border-primary/5 animate-float-slow" style={{ animationDelay: "2s" }} />
    </div>
  )
}
