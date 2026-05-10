import { Card, CardContent } from "@/components/ui/card"
import { Package, Sparkles, BarChart3, Star, Globe } from "lucide-react"

type StatDef = {
  key: string
  icon: typeof Package
  label: string
  value: string
  gradient: string
  iconBg: string
  iconColor: string
  barColor: string
}

function buildStats(props: {
  projectCount: number
  totalGenerations: number
  todayRecords: number
  favoritedCount: number
}): StatDef[] {
  return [
    {
      key: "projects",
      icon: Package,
      label: "项目总数",
      value: String(props.projectCount),
      gradient: "from-primary/10 via-primary/5 to-transparent",
      iconBg: "bg-gradient-to-br from-primary to-violet-600",
      iconColor: "text-white",
      barColor: "bg-primary",
    },
    {
      key: "generations",
      icon: Sparkles,
      label: "生成次数",
      value: String(props.totalGenerations),
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      iconColor: "text-white",
      barColor: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
    {
      key: "today",
      icon: BarChart3,
      label: "今日生成",
      value: String(props.todayRecords),
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      iconColor: "text-white",
      barColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      key: "favorites",
      icon: Star,
      label: "收藏内容",
      value: String(props.favoritedCount),
      gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
      iconColor: "text-white",
      barColor: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      key: "platforms",
      icon: Globe,
      label: "支持平台",
      value: "7",
      gradient: "from-sky-500/10 via-sky-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
      iconColor: "text-white",
      barColor: "bg-gradient-to-r from-sky-500 to-blue-500",
    },
  ]
}

type StatCardsProps = {
  projectCount: number
  totalGenerations: number
  todayRecords: number
  favoritedCount: number
}

export function StatCards(props: StatCardsProps) {
  const stats = buildStats(props)

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card
            key={stat.key}
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-transparent"
          >
            {/* Top gradient bar */}
            <div
              aria-hidden
              className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.barColor}`}
            />

            {/* Background gradient glow */}
            <div
              aria-hidden
              className={`absolute inset-0 bg-gradient-to-b ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <CardContent className="p-4 relative">
              <div className="flex items-center gap-3">
                <div
                  className={`relative flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} shadow-lg shadow-current/10`}
                >
                  <Icon className={`size-[18px] ${stat.iconColor}`} />
                  {/* Decorative ring */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold tracking-tight mt-0.5 tabular-nums">
                    {stat.value}
                  </p>
                </div>
              </div>

              {stat.key === "platforms" && (
                <div className="mt-2.5 flex gap-1.5">
                  {["Amazon", "Shopify", "TikTok"].map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {/* Subtle decorative dot */}
              <div
                aria-hidden
                className="absolute -bottom-2 -right-2 size-16 rounded-full bg-gradient-to-br from-foreground/[0.02] to-transparent blur-sm"
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
