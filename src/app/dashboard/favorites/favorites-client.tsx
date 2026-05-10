"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Copy,
  Check,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { contentTypeLabels, downloadTextFile } from "@/types"

type FavoriteRecord = {
  id: string
  contentType: string
  content: string | null
  imageUrl: string | null
  createdAt: Date
  project: {
    productName: string
    platform: string
  }
}

export function FavoritesClient({
  records,
  activeTab,
}: {
  records: FavoriteRecord[]
  activeTab: string
}) {
  const router = useRouter()
  const [items, setItems] = useState(records)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleRemoveFavorite(recordId: string) {
    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorited: false }),
      })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((r) => r.id !== recordId))
      toast.success("已取消收藏")
    } catch {
      toast.error("操作失败")
    }
  }

  function handleCopy(content: string | null, recordId: string) {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopiedId(recordId)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("已复制")
  }

  function handleDownload(record: FavoriteRecord) {
    if (!record.content) return
    const label = contentTypeLabels[record.contentType] || record.contentType
    const text = `【${label}】\n${record.content}`
    downloadTextFile(text, `${record.project.productName}-${label}.txt`)
  }

  async function handleDownloadImage(record: FavoriteRecord) {
    if (!record.imageUrl) return
    try {
      const res = await fetch(record.imageUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${record.project.productName}-${record.contentType}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("图片已下载")
    } catch {
      toast.error("下载失败")
    }
  }

  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      {items.map((record) => {
        const isCopy = activeTab === "copy"

        return (
          <Card key={record.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary shrink-0">
                    {contentTypeLabels[record.contentType] || record.contentType}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {record.project.productName}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(record.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              {/* Content */}
              {isCopy && record.content ? (
                <pre className="whitespace-pre-wrap text-sm font-sans text-foreground/90 leading-relaxed mb-3 bg-muted/30 rounded-lg p-3">
                  {record.content}
                </pre>
              ) : record.imageUrl ? (
                <div className="mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={record.imageUrl}
                    alt={record.content || "收藏图片"}
                    className="max-h-64 w-full object-contain rounded-lg border border-border/50 bg-muted/20"
                  />
                  {record.content && (
                    <details className="mt-2 text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground transition-colors">
                        查看提示词
                      </summary>
                      <pre className="mt-1 whitespace-pre-wrap font-sans text-foreground/80 leading-relaxed">
                        {record.content}
                      </pre>
                    </details>
                  )}
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex items-center gap-1">
                {isCopy && record.content && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopy(record.content, record.id)}
                      title="复制"
                    >
                      {copiedId === record.id ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDownload(record)}
                      title="下载"
                    >
                      <Download className="size-3.5" />
                    </Button>
                  </>
                )}
                {!isCopy && record.imageUrl && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDownloadImage(record)}
                      title="下载图片"
                    >
                      <Download className="size-3.5" />
                    </Button>
                    <a
                      href={record.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon-sm" title="查看原图">
                        <ExternalLink className="size-3.5" />
                      </Button>
                    </a>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveFavorite(record.id)}
                  title="取消收藏"
                  className="text-destructive/60 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
