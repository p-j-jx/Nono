import { Sparkles } from "lucide-react"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return "夜深了"
  if (hour < 12) return "上午好"
  if (hour < 14) return "中午好"
  if (hour < 18) return "下午好"
  return "晚上好"
}

export function WelcomeHeader({
  userName,
  projectCount,
  todayRecords,
  totalGenerations,
}: {
  userName: string
  projectCount: number
  todayRecords: number
  totalGenerations: number
}) {
  const greeting = getGreeting()

  return (
    <div className="relative">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="absolute -top-8 -left-8 w-48 h-48 bg-gradient-to-br from-primary/10 via-primary/[0.04] to-transparent rounded-full blur-2xl"
      />

      <div className="relative">
        {/* Welcome badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-4 py-1 text-xs font-medium text-primary shadow-sm">
          <Sparkles className="size-3" />
          欢迎回来
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {greeting}，<span className="text-primary">{userName}</span>
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          {projectCount > 0
            ? `你有 ${projectCount} 个活跃项目，今日已生成 ${todayRecords} 条内容`
            : "开始你的第一个跨境电商项目"}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 text-xs font-medium ring-1 ring-primary/10">
            <span className="text-primary font-semibold tabular-nums">{projectCount}</span>
            <span className="text-muted-foreground">项目</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-3 py-1.5 text-xs font-medium ring-1 ring-amber-500/10">
            <span className="text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
              {totalGenerations}
            </span>
            <span className="text-muted-foreground">累计生成</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 px-3 py-1.5 text-xs font-medium ring-1 ring-emerald-500/10">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
              {todayRecords}
            </span>
            <span className="text-muted-foreground">今日生成</span>
          </div>
        </div>
      </div>
    </div>
  )
}
