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
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        {greeting}，<span className="text-primary">{userName}</span>
      </h1>

      <p className="mt-1.5 text-sm text-muted-foreground">
        {projectCount > 0
          ? `${projectCount} 个活跃项目，今日已生成 ${todayRecords} 条内容，累计 ${totalGenerations} 条`
          : "开始你的第一个跨境电商项目"}
      </p>
    </div>
  )
}
