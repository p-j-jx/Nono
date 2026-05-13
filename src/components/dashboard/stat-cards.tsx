import { Card, CardContent } from "@/components/ui/card"
import { Package, Sparkles, BarChart3, Star, Globe } from "lucide-react"

type StatDef = {
  key: string
  icon: typeof Package
  label: string
  value: string
  iconBg: string
  iconColor: string
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
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      key: "generations",
      icon: Sparkles,
      label: "生成次数",
      value: String(props.totalGenerations),
      iconBg: "bg-platform-amazon-muted",
      iconColor: "text-platform-amazon",
    },
    {
      key: "today",
      icon: BarChart3,
      label: "今日生成",
      value: String(props.todayRecords),
      iconBg: "bg-platform-shopify-muted",
      iconColor: "text-platform-shopify",
    },
    {
      key: "favorites",
      icon: Star,
      label: "收藏内容",
      value: String(props.favoritedCount),
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      key: "platforms",
      icon: Globe,
      label: "支持平台",
      value: "7",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-600 dark:text-sky-400",
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
            className="relative overflow-hidden"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon className={`size-[18px] ${stat.iconColor}`} />
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
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
