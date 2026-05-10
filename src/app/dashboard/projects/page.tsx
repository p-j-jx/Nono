import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Search, SlidersHorizontal, ArrowUpDown, Plus, FolderKanban } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/dashboard/project-card"

export const dynamic = "force-dynamic"

const platformOptions = [
  { value: "", label: "全部平台" },
  { value: "amazon", label: "Amazon" },
  { value: "shopify", label: "Shopify" },
  { value: "tiktok", label: "TikTok Shop" },
  { value: "ebay", label: "eBay" },
  { value: "etsy", label: "Etsy" },
  { value: "walmart", label: "Walmart" },
  { value: "aliexpress", label: "AliExpress" },
]

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; platform?: string; sort?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { q, platform, sort } = await searchParams

  const where: Record<string, unknown> = { userId: session.user.id }
  if (platform) where.platform = platform
  if (q) where.productName = { contains: q }

  const orderBy: Record<string, string> = {}
  if (sort === "name") orderBy.productName = "asc"
  else if (sort === "created") orderBy.createdAt = "desc"
  else orderBy.updatedAt = "desc"

  const projects = await prisma.productProject.findMany({
    where: where as any,
    orderBy: orderBy as any,
    include: { _count: { select: { records: true } } },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">项目列表</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              共 {projects.length} 个项目
            </p>
          </div>
          <Button render={<Link href="/dashboard/new" />} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="size-4" />
            新建项目
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <form className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q || ""}
            placeholder="搜索项目名称..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        <select
          name="platform"
          defaultValue={platform || ""}
          className="flex h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {platformOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={sort || "updated"}
          className="flex h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <option value="updated">最近更新</option>
          <option value="created">最新创建</option>
          <option value="name">按名称</option>
        </select>

        <Button type="submit" variant="secondary" size="sm" className="h-9">
          <Search className="size-3.5" />
          搜索
        </Button>
      </form>

      {projects.length === 0 ? (
        <Card className="relative overflow-hidden border-dashed">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02]" />
          <CardContent className="flex flex-col items-center justify-center text-center py-16">
            <div className="size-14 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center mb-4">
              <FolderKanban className="size-7 text-primary/40" />
            </div>
            <h3 className="text-base font-semibold mb-1">
              {q || platform ? "没有找到匹配的项目" : "还没有项目"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm">
              {q || platform
                ? "试试调整搜索条件或筛选条件"
                : "创建你的第一个项目，开始 AI 跨境电商之旅"}
            </p>
            <div className="flex gap-3">
              <Button render={<Link href="/dashboard/new" />} className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="size-4" />
                创建项目
              </Button>
              <Button variant="outline" render={<Link href="/dashboard/templates" />} className="gap-2">
                浏览模板
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              productName={project.productName}
              platform={project.platform}
              language={project.language}
              recordCount={project._count.records}
              updatedAt={project.updatedAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
