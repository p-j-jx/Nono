import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import Link from "next/link"
import { Plus, Package, Sparkles, BarChart3, Globe, Clock, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { DashboardBackground } from "@/components/dashboard/dashboard-background"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { ProjectSearch } from "@/components/dashboard/project-search"
import { RecentProjects } from "@/components/dashboard/recent-projects"

const platformLabels: Record<string, string> = {
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok Shop",
}

const platformColors: Record<string, string> = {
  amazon: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
  shopify: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
  tiktok: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30",
}

async function getTrendData(userId: string) {
  const days: { day: string; start: Date; end: Date }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const end = new Date(start.getTime() + 86400000)
    days.push({
      day: start.toLocaleDateString("zh-CN", { weekday: "short", month: "numeric", day: "numeric" }).replace(/月/g, "/").replace(/日/g, ""),
      start,
      end,
    })
  }

  const counts = await Promise.all(
    days.map((d) =>
      prisma.generationRecord.count({
        where: {
          project: { userId },
          createdAt: { gte: d.start, lt: d.end },
        },
      })
    )
  )

  return days.map((d, i) => ({ day: d.day, count: counts[i] }))
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [projects, totalRecords, todayRecords, trendData] = await Promise.all([
    prisma.productProject.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { records: true } } },
    }),
    prisma.generationRecord.count({
      where: { project: { userId: session.user.id } },
    }),
    prisma.generationRecord.count({
      where: {
        project: { userId: session.user.id },
        createdAt: { gte: today },
      },
    }),
    getTrendData(session.user.id),
  ])

  const favoritedCount = await prisma.generationRecord.count({
    where: {
      project: { userId: session.user.id },
      favorited: true,
    },
  })

  const totalGenerations = projects.reduce((sum, p) => sum + p._count.records, 0)

  const yesterdayStart = new Date(today.getTime() - 86400000)
  const yesterdayRecords = await prisma.generationRecord.count({
    where: {
      project: { userId: session.user.id },
      createdAt: { gte: yesterdayStart, lt: today },
    },
  })

  const trendDelta = todayRecords - yesterdayRecords

  return (
    <>
      <DashboardBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <WelcomeHeader
          userName={session.user.name || "用户"}
          projectCount={projects.length}
          todayRecords={todayRecords}
          totalGenerations={totalGenerations}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* 项目数 */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md group/card">
            <div aria-hidden className="absolute top-0 right-0 size-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Package className="size-3.5" />
                项目总数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">累计项目</p>
            </CardContent>
          </Card>

          {/* 累计生成 */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md group/card">
            <div aria-hidden className="absolute top-0 right-0 size-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5" />
                累计生成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGenerations}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">全部记录</p>
            </CardContent>
          </Card>

          {/* 今日生成 + 趋势 */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md group/card lg:col-span-1 xl:col-span-2">
            <div aria-hidden className="absolute top-0 right-0 size-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <BarChart3 className="size-3.5" />
                近7日趋势
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold">{todayRecords}</div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {trendDelta >= 0 ? "较昨日 +" : "较昨日 "}{trendDelta}
                  </p>
                </div>
                <div className="w-28 h-12">
                  <TrendChart data={trendData} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 收藏 */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md group/card">
            <div aria-hidden className="absolute top-0 right-0 size-24 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Star className="size-3.5" />
                收藏
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoritedCount}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">已收藏记录</p>
            </CardContent>
          </Card>

          {/* 支持平台 */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md group/card">
            <div aria-hidden className="absolute top-0 right-0 size-24 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-bl-full" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Globe className="size-3.5" />
                支持平台
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Amazon · Shopify · TikTok</p>
            </CardContent>
          </Card>
        </div>

        {/* Recently viewed */}
        <RecentProjects />

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">我的项目</h2>
            <div className="flex items-center gap-3">
              <ProjectSearch />
              <Button render={<Link href="/dashboard/new" />} size="sm" className="gap-2 shrink-0">
                <Plus className="size-4" />
                新建项目
              </Button>
            </div>
          </div>

          {projects.length === 0 ? (
            <Card className="py-20 overflow-hidden relative">
              <div aria-hidden className="absolute top-0 right-0 size-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
              <div aria-hidden className="absolute bottom-0 left-0 size-32 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-tr-full" />
              <CardContent className="flex flex-col items-center justify-center text-center relative">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 ring-1 ring-primary/20 mb-6">
                  <Package className="size-10 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold mb-2">还没有项目</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
                  创建你的第一个项目，AI 将为你生成适配多平台的商品文案和营销图片，让跨境运营更高效
                </p>
                <div className="flex gap-3">
                  <Button render={<Link href="/dashboard/new" />} size="lg" className="gap-2">
                    <Plus className="size-4" />
                    创建第一个项目
                  </Button>
                  <Button render={<Link href="/dashboard/new?mode=batch" />} variant="outline" size="lg">
                    批量导入
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => {
                const recordCount = project._count.records
                const progressPercent = Math.min((recordCount / 8) * 100, 100)
                return (
                  <Link key={project.id} href={`/dashboard/${project.id}`} data-project-card data-project-name={project.productName}>
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 cursor-pointer group/card overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base truncate pr-2 group-hover/card:text-primary transition-colors">
                              {project.productName}
                            </CardTitle>
                            {project.category && (
                              <CardDescription className="mt-0.5">
                                {project.category}
                              </CardDescription>
                            )}
                          </div>
                          <span
                            className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              platformColors[project.platform] || "bg-muted text-muted-foreground"
                            }`}
                          >
                            {platformLabels[project.platform] || project.platform}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4 space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            创建于 {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                          </span>
                          <span>{recordCount} 条记录</span>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">生成进度</span>
                            <span className={recordCount >= 8 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}>
                              {recordCount >= 8 ? "已完成" : `${recordCount}/8`}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover/card:opacity-100 transition-all translate-x-[-4px] group-hover/card:translate-x-0">
                          查看详情 <ArrowRight className="size-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
