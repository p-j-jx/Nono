import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import Link from "next/link"
import { Plus, Package, Clock, Globe, BarChart3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { RecentProjects } from "@/components/dashboard/recent-projects"

const platformLabels: Record<string, string> = {
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok Shop",
}

const platformColors: Record<string, string> = {
  amazon: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
  shopify:
    "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
  tiktok: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [projects, totalRecords, todayRecords] = await Promise.all([
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
  ])

  const favoritedCount = await prisma.generationRecord.count({
    where: {
      project: { userId: session.user.id },
      favorited: true,
    },
  })

  const totalGenerations = projects.reduce((sum, p) => sum + p._count.records, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            你好，{session.user.name || "用户"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理你的跨境电商项目
          </p>
        </div>
        <Button render={<Link href="/dashboard/new" />}>
          <Plus className="size-4" />
          新建项目
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div aria-hidden className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Package className="size-3.5" />
              项目总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              累计项目
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div aria-hidden className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5" />
              生成次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGenerations}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              累计生成
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div aria-hidden className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <BarChart3 className="size-3.5" />
              今日生成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRecords}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              今日新增
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div aria-hidden className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <StarIcon className="size-3.5" />
              收藏
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoritedCount}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              已收藏记录
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div aria-hidden className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Globe className="size-3.5" />
              支持平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">3</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Amazon · Shopify · TikTok
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recently viewed (client component) */}
      <RecentProjects />

      {/* Projects */}
      <h2 className="text-lg font-semibold mb-4">我的项目</h2>

      {projects.length === 0 ? (
        <Card className="py-16 overflow-hidden relative">
          <div aria-hidden className="absolute top-0 right-0 size-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
          <div aria-hidden className="absolute bottom-0 left-0 size-32 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-tr-full" />
          <CardContent className="flex flex-col items-center justify-center text-center relative">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 ring-1 ring-primary/20 mb-6">
              <Package className="size-8 text-primary/60" />
            </div>
            <h3 className="text-lg font-semibold mb-2">还没有项目</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              创建你的第一个项目，AI 将为你生成适配多平台的商品文案和营销图片
            </p>
            <Button render={<Link href="/dashboard/new" />} size="lg" className="gap-2">
              <Plus className="size-4" />
              创建第一个项目
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/${project.id}`}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 cursor-pointer group/card">
                <CardHeader>
                  <CardTitle className="text-base group-hover/card:text-primary transition-colors">{project.productName}</CardTitle>
                  <CardDescription>
                    {project.category || "未分类"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        platformColors[project.platform] ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {platformLabels[project.platform] || project.platform}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {project._count.records} 条记录
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
