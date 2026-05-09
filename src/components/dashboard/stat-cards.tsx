import { Card, CardContent } from "@/components/ui/card"
import { Package, Sparkles, BarChart3, Star, Globe } from "lucide-react"

const statDefs = [
  { key: "projects", icon: Package, label: "项目总数", accent: "text-primary", bg: "bg-primary/10" },
  { key: "generations", icon: Sparkles, label: "生成次数", accent: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  { key: "today", icon: BarChart3, label: "今日生成", accent: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "favorites", icon: Star, label: "收藏", accent: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
  { key: "platforms", icon: Globe, label: "支持平台", accent: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10" },
] as const

type StatCardsProps = {
  projectCount: number
  totalGenerations: number
  todayRecords: number
  favoritedCount: number
}

export function StatCards({ projectCount, totalGenerations, todayRecords, favoritedCount }: StatCardsProps) {
  const values: Record<string, string> = {
    projects: String(projectCount),
    generations: String(totalGenerations),
    today: String(todayRecords),
    favorites: String(favoritedCount),
    platforms: "7",
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statDefs.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.key} className="transition-all duration-200 hover:shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex size-9 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`size-4 ${stat.accent}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold mt-0.5">{values[stat.key]}</p>
                </div>
              </div>
              {stat.key === "platforms" && (
                <p className="text-[10px] text-muted-foreground mt-2 truncate">Amazon / Shopify / TikTok</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
