"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FileText, Sparkles, Copy, Loader2 } from "lucide-react"
import { platformLabels, languageLabels } from "@/types"

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "刚刚"
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  return `${months} 个月前`
}

const platformBadgeColors: Record<string, string> = {
  amazon: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  shopify: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  tiktok: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  ebay: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  etsy: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  walmart: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  aliexpress: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
}

const platformTopBars: Record<string, string> = {
  amazon: "bg-gradient-to-r from-amber-500 to-orange-500",
  shopify: "bg-gradient-to-r from-emerald-500 to-green-600",
  tiktok: "bg-gradient-to-r from-cyan-500 to-teal-500",
  ebay: "bg-gradient-to-r from-blue-500 to-indigo-500",
  etsy: "bg-gradient-to-r from-orange-500 to-red-500",
  walmart: "bg-gradient-to-r from-blue-500 to-sky-500",
  aliexpress: "bg-gradient-to-r from-red-500 to-rose-500",
}

type ProjectCardProps = {
  id: string
  productName: string
  platform: string
  language: string
  recordCount: number
  updatedAt: Date
}

export function ProjectCard({ id, productName, platform, language, recordCount, updatedAt }: ProjectCardProps) {
  const router = useRouter()
  const [cloning, setCloning] = useState(false)
  const platformLabel = platformLabels[platform] || platform
  const badgeColor = platformBadgeColors[platform] || "bg-muted text-muted-foreground"
  const topBar = platformTopBars[platform] || "bg-gradient-to-r from-primary to-primary/50"
  const platformInitial = platformLabel.charAt(0)

  async function handleClone(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (cloning) return

    setCloning(true)
    try {
      const res = await fetch(`/api/projects/${id}/clone`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "复制失败")
      toast.success(`已复制：${data.project.productName}`)
      router.push(`/dashboard/${data.projectId}`)
      router.refresh()
    } catch (err) {
      console.error("Clone project failed:", err)
      toast.error("复制项目失败")
      setCloning(false)
    }
    // Don't reset cloning state on success — navigation will unmount this card
  }

  return (
    <Link href={`/dashboard/${id}`}>
      <Card className="group relative overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-transparent cursor-pointer">
        {/* Platform-colored top bar */}
        <div aria-hidden className={`absolute top-0 left-0 right-0 h-[3px] ${topBar} opacity-80`} />

        {/* Hover glow overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <CardHeader className="pb-2 relative">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary shrink-0">
                {platformInitial}
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm truncate group-hover:text-primary transition-colors">{productName}</CardTitle>
                <CardDescription className="truncate text-xs">
                  {languageLabels[language] || language}
                </CardDescription>
              </div>
            </div>
            <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColor}`}>
              {platformLabel}
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
            <span className="flex items-center gap-1">
              <FileText className="size-3" />
              {recordCount} 条
            </span>
            {recordCount === 0 && (
              <span className="flex items-center gap-1 text-primary">
                <Sparkles className="size-3" />
                开始生成
              </span>
            )}
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
              style={{ width: `${Math.min((recordCount / 10) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground">
              {recordCount >= 10 ? "内容完整" : `${recordCount}/10 条内容`}
            </span>
            <time className="text-[10px] text-muted-foreground">{relativeTime(updatedAt)}</time>
          </div>
          {/* Copy project shortcut */}
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClone}
              disabled={cloning}
              title="一键复制项目（不复制生成内容）"
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {cloning ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  复制中...
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  复制项目
                </>
              )}
            </button>
            <Link
              href={`/results?projectId=${id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <Sparkles className="size-3" />
              查看结果
            </Link>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
