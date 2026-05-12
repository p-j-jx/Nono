import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Clock,
  FileText,
  ListOrdered,
  AlignLeft,
  BookOpen,
  ImageIcon,
  ImagePlus,
  HistoryIcon,
  ExternalLink,
  RefreshCw,
  SearchX,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Highlight } from "@/components/highlight"

const PAGE_SIZE = 20

function BackButton() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ChevronLeft className="size-4" />
      返回工作台
    </Link>
  )
}

const contentTypeConfig: Record<
  string,
  { label: string; icon: typeof FileText; color: string }
> = {
  title: {
    label: "商品标题",
    icon: FileText,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  bulletPoints: {
    label: "要点描述",
    icon: ListOrdered,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  shortDesc: {
    label: "短描述",
    icon: AlignLeft,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
  longDesc: {
    label: "长描述",
    icon: BookOpen,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  mainImage: {
    label: "商品主图",
    icon: ImageIcon,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  },
  sceneImage: {
    label: "场景图",
    icon: ImagePlus,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  },
}

const platformLabels: Record<string, string> = {
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok Shop",
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "今天"
  if (days === 1) return "昨天"
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    contentType?: string
    platform?: string
    page?: string
    favorited?: string
  }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const sp = await searchParams
  const { q, contentType, platform } = sp
  const page = Math.max(1, Number(sp.page) || 1)
  const favorited = sp.favorited === "true"
  const hasFilters = !!(q || contentType || platform || favorited)

  // Build where clause
  const projectFilter: {
    userId: string
    productName?: { contains: string }
    platform?: string
  } = {
    userId: session.user.id,
  }
  if (q) projectFilter.productName = { contains: q }
  if (platform) projectFilter.platform = platform

  const where: {
    project: typeof projectFilter
    contentType?: string
    favorited?: boolean
  } = {
    project: projectFilter,
  }
  if (contentType) where.contentType = contentType
  if (favorited) where.favorited = true

  const [records, totalCount] = await Promise.all([
    prisma.generationRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        project: {
          select: {
            productName: true,
            platform: true,
            id: true,
          },
        },
      },
    }),
    prisma.generationRecord.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const allRecords = records.map((record) => ({
    ...record,
    projectName: record.project.productName,
    projectId: record.project.id,
    platform: record.project.platform,
  }))

  // Build query string for pagination
  function buildPageUrl(p: number): string {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (contentType) params.set("contentType", contentType)
    if (platform) params.set("platform", platform)
    if (favorited) params.set("favorited", "true")
    if (p > 1) params.set("page", String(p))
    return `/history?${params.toString()}`
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">历史记录</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {hasFilters
            ? `找到 ${totalCount} 条匹配的记录`
            : `共 ${totalCount} 条生成记录`}
        </p>
      </div>

      {/* Search & Filter */}
      <form className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            name="q"
            placeholder="搜索项目名称..."
            defaultValue={q || ""}
            className="h-9"
          />
        </div>
        <Select name="contentType" defaultValue={contentType || ""}>
          <SelectTrigger className="h-9 w-[130px]">
            <SelectValue placeholder="内容类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部类型</SelectItem>
            <SelectItem value="title">商品标题</SelectItem>
            <SelectItem value="bulletPoints">要点描述</SelectItem>
            <SelectItem value="shortDesc">短描述</SelectItem>
            <SelectItem value="longDesc">长描述</SelectItem>
            <SelectItem value="mainImage">商品主图</SelectItem>
            <SelectItem value="sceneImage">场景图</SelectItem>
          </SelectContent>
        </Select>
        <Select name="platform" defaultValue={platform || ""}>
          <SelectTrigger className="h-9 w-[130px]">
            <SelectValue placeholder="平台" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部平台</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
            <SelectItem value="tiktok">TikTok Shop</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="favorited" value={favorited ? "true" : ""} />
        <input type="hidden" name="page" value="1" />
        <Button type="submit" size="sm" variant="secondary">
          筛选
        </Button>
        {hasFilters && (
          <Button size="sm" variant="ghost" render={<a href="/history" />}>
            清除
          </Button>
        )}
      </form>

      {/* Favorite filter toggle */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href={favorited ? "/history" : `/history?favorited=true`}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            favorited
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Star
            className={`size-3.5 ${favorited ? "fill-amber-500 text-amber-500" : ""}`}
          />
          已收藏
        </Link>
      </div>

      {/* Records */}
      {allRecords.length === 0 ? (
        <Card className="py-16 overflow-hidden relative">
          <div aria-hidden className="absolute top-0 right-0 size-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
          <div aria-hidden className="absolute bottom-0 left-0 size-32 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-tr-full" />
          <CardContent className="flex flex-col items-center justify-center text-center relative">
            {hasFilters ? (
              <>
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/80 to-muted/30 ring-1 ring-border/50 mb-6">
                  <SearchX className="size-8 text-muted-foreground/60" />
                </div>
                <h3 className="text-lg font-semibold mb-2">没有匹配的记录</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  试试调整搜索条件或筛选器
                </p>
                <Link
                  href="/history"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  清除筛选
                </Link>
              </>
            ) : (
              <>
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-amber-500/10 ring-1 ring-primary/20 mb-6">
                  <HistoryIcon className="size-8 text-primary/60" />
                </div>
                <h3 className="text-lg font-semibold mb-2">还没有生成记录</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  创建一个项目并生成内容后，记录会出现在这里
                </p>
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  新建项目
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {allRecords.map((record) => {
              const config = contentTypeConfig[record.contentType]
              const Icon = config?.icon || FileText
              const label = config?.label || record.contentType
              const colorClass =
                config?.color || "bg-muted text-muted-foreground"

              return (
                <Card
                  key={record.id}
                  className="transition-all duration-300 hover:shadow-md hover:border-primary/20"
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                      >
                        <Icon className="size-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/results?projectId=${record.projectId}`}
                            className="text-sm font-medium hover:text-primary transition-colors truncate"
                          >
                            <Highlight
                              text={record.projectName}
                              query={q || undefined}
                            />
                          </Link>
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-[10px] px-1.5 py-0"
                          >
                            {label}
                          </Badge>
                          {record.platform && (
                            <span className="shrink-0 text-[10px] text-muted-foreground/60">
                              {platformLabels[record.platform] ||
                                record.platform}
                            </span>
                          )}
                          {record.favorited && (
                            <Star className="size-3 fill-amber-400 text-amber-400 shrink-0" />
                          )}
                        </div>

                        {record.content && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            <Highlight
                              text={record.content}
                              query={q || undefined}
                            />
                          </p>
                        )}
                        {record.imageUrl && !record.content && (
                          <p className="text-xs text-muted-foreground truncate">
                            🖼️ {record.imageUrl}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                            <Clock className="size-3" />
                            {formatDate(new Date(record.createdAt))}
                          </span>
                          <Link
                            href={`/results?projectId=${record.projectId}`}
                            className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
                          >
                            <ExternalLink className="size-3" />
                            查看详情
                          </Link>
                          <Link
                            href={`/dashboard/new?reuseProjectId=${record.projectId}`}
                            className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors"
                          >
                            <RefreshCw className="size-3" />
                            再次使用
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
              <p className="text-sm text-muted-foreground">
                共 {totalCount} 条记录
              </p>
              <div className="flex items-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildPageUrl(page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border/50 px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                    上一页
                  </Link>
                )}
                <span className="text-sm text-muted-foreground px-2">
                  第 {page}/{totalPages} 页
                </span>
                {page < totalPages && (
                  <Link
                    href={buildPageUrl(page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border/50 px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    下一页
                    <ChevronRight className="size-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
