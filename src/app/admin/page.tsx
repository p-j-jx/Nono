import { prisma } from "@/db/prisma"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  FolderKanban,
  Sparkles,
  BarChart3,
  Calendar,
  Activity,
  Crown,
  Package,
} from "lucide-react"
import { platformLabels, contentTypeLabels } from "@/types"

export const dynamic = "force-dynamic"

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "刚刚"
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  return `${Math.floor(days / 30)} 个月前`
}

export default async function AdminDashboard() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400_000)

  const [
    totalUsers,
    totalProjects,
    monthlyGenerations,
    monthlyAnalyses,
    newUsersThisMonth,
    activeUsersSevenDay,
    topUsers,
    recentGenerations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.productProject.count(),
    prisma.generationRecord.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.analysisRecord
      .count({ where: { createdAt: { gte: monthStart } } })
      .catch(() => 0),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({
      where: {
        projects: {
          some: {
            records: { some: { createdAt: { gte: sevenDaysAgo } } },
          },
        },
      },
    }),
    // Top 10 users by total generation count
    prisma.user
      .findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: { select: { projects: true } },
          projects: {
            select: { _count: { select: { records: true } } },
          },
        },
        take: 50, // get 50, then sort in JS by generation count
      })
      .then((users) =>
        users
          .map((u) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            createdAt: u.createdAt,
            projectCount: u._count.projects,
            generationCount: u.projects.reduce(
              (sum, p) => sum + p._count.records,
              0
            ),
          }))
          .sort((a, b) => b.generationCount - a.generationCount)
          .slice(0, 10)
      ),
    prisma.generationRecord.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            productName: true,
            platform: true,
            user: { select: { email: true, name: true } },
          },
        },
      },
    }),
  ])

  const stats = [
    {
      label: "总用户数",
      value: totalUsers,
      hint: `本月新增 ${newUsersThisMonth}`,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "总项目数",
      value: totalProjects,
      hint: "全部用户累计",
      icon: FolderKanban,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "本月生成",
      value: monthlyGenerations,
      hint: "GenerationRecord",
      icon: Sparkles,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "本月分析",
      value: monthlyAnalyses,
      hint: "竞品 / 质量 / 税务",
      icon: BarChart3,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "7 日活跃",
      value: activeUsersSevenDay,
      hint: "过去 7 天有生成记录",
      icon: Activity,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "活跃率",
      value:
        totalUsers > 0
          ? `${Math.round((activeUsersSevenDay / totalUsers) * 100)}%`
          : "0%",
      hint: "7 日活跃 / 总用户",
      icon: Calendar,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">平台概览</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          实时数据，每次访问从数据库直接读取
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex size-9 items-center justify-center rounded-lg ${s.bg}`}>
                    <Icon className={`size-4 ${s.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold tabular-nums">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground/70">
                  {s.hint}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Two-column layout: top users + recent activity */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Top users */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="border-b border-border/40 px-5 py-3 flex items-center gap-2">
            <Crown className="size-4 text-amber-500" />
            <h2 className="text-sm font-semibold">活跃用户 TOP 10</h2>
            <span className="text-[11px] text-muted-foreground ml-auto">
              按生成量排序
            </span>
          </div>
          <CardContent className="p-0">
            {topUsers.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                还没有用户数据
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {topUsers.map((u, i) => (
                  <li key={u.id} className="px-5 py-3 flex items-center gap-3">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tabular-nums ${
                        i < 3 ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">
                        {u.name || u.email.split("@")[0]}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {u.email}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold tabular-nums">
                        {u.generationCount}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {u.projectCount} 项目
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-3 overflow-hidden">
          <div className="border-b border-border/40 px-5 py-3 flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">最近 30 条生成记录</h2>
            <span className="text-[11px] text-muted-foreground ml-auto">
              GenerationRecord
            </span>
          </div>
          <CardContent className="p-0">
            {recentGenerations.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                还没有生成记录
              </div>
            ) : (
              <ul className="divide-y divide-border/40 max-h-[600px] overflow-y-auto">
                {recentGenerations.map((r) => (
                  <li
                    key={r.id}
                    className="px-5 py-2.5 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <Package className="size-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium">
                          {contentTypeLabels[r.contentType] || r.contentType}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {r.project.productName}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {r.project.user.email}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[11px] text-muted-foreground">
                        {platformLabels[r.project.platform] || r.project.platform}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70">
                        {relativeTime(r.createdAt)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer hint */}
      <p className="mt-8 text-xs text-muted-foreground text-center">
        💡 想看更细的数据？跑 <code className="bg-muted rounded px-1 py-0.5 font-mono">npx prisma studio</code> 直接浏览数据库
      </p>
    </div>
  )
}
