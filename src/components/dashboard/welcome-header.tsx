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
    <div>
      {/* Badge */}
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-4 py-1 text-xs font-medium text-primary animate-fade-in">
        <Sparkles className="size-3" />
        欢迎回来
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight animate-fade-up">
        {greeting}，
        <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
          {userName}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-muted-foreground animate-fade-up animation-delay-100">
        {projectCount > 0
          ? `你有 ${projectCount} 个活跃项目，今日已生成 ${todayRecords} 条内容`
          : "开始你的第一个跨境电商项目"}
      </p>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3 mt-4 animate-fade-up animation-delay-200">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/8 px-3 py-1.5 text-xs font-medium">
          <span className="text-primary">{projectCount}</span>
          <span className="text-muted-foreground">项目</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/8 px-3 py-1.5 text-xs font-medium">
          <span className="text-amber-600 dark:text-amber-400">{totalGenerations}</span>
          <span className="text-muted-foreground">累计生成</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/8 px-3 py-1.5 text-xs font-medium">
          <span className="text-emerald-600 dark:text-emerald-400">{todayRecords}</span>
          <span className="text-muted-foreground">今日生成</span>
        </div>
      </div>
    </div>
  )
}
