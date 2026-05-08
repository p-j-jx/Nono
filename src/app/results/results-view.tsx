"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  FileText,
  ListOrdered,
  AlignLeft,
  BookOpen,
  ImageIcon,
  ImagePlus,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Download,
  Save,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  Star,
} from "lucide-react"
import { toast } from "sonner"

type Project = {
  id: string
  productName: string
  category: string | null
  features: string | null
  sellingPoints: string | null
  keywords: string | null
  useScenario: string | null
  targetAudience: string | null
  priceRange: string | null
  brandTone: string | null
  platform: string
  language: string
  createdAt: Date
  updatedAt: Date
  records: Array<{
    id: string
    contentType: string
    content: string | null
    imageUrl: string | null
    prompt: string | null
    favorited: boolean
    createdAt: Date
  }>
}

const platformLabels: Record<string, string> = {
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok Shop",
}

const languageLabels: Record<string, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
}

const contentTypeInfo: Record<
  string,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    type: "copy" | "image"
  }
> = {
  title: {
    label: "商品标题",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    type: "copy",
  },
  bulletPoints: {
    label: "要点描述",
    icon: ListOrdered,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    type: "copy",
  },
  shortDesc: {
    label: "短描述",
    icon: AlignLeft,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    type: "copy",
  },
  longDesc: {
    label: "长描述",
    icon: BookOpen,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    type: "copy",
  },
  mainImage: {
    label: "商品主图",
    icon: ImageIcon,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    type: "image",
  },
  sceneImage: {
    label: "场景图",
    icon: ImagePlus,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    type: "image",
  },
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ResultsView({ project }: { project: Project }) {
  const router = useRouter()
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [records, setRecords] = useState(project.records)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleCopy(content: string | null, recordId: string) {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopiedId(recordId)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("已复制到剪贴板")
  }

  async function handleRegenerate(contentType: string) {
    setRegenerating(contentType)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          contentType,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setRecords((prev) => [data.record, ...prev])
      toast.success(
        `${contentTypeInfo[contentType]?.label || contentType} 重新生成成功！`
      )
    } catch {
      toast.error("生成失败，请稍后再试")
    } finally {
      setRegenerating(null)
    }
  }

  async function handleDelete(recordId: string) {
    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      setRecords((prev) => prev.filter((r) => r.id !== recordId))
      setDeletingId(null)
      toast.success("已删除")
    } catch {
      toast.error("删除失败")
    }
  }

  async function handleToggleFavorite(recordId: string, current: boolean) {
    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorited: !current }),
      })
      if (!res.ok) throw new Error()
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId ? { ...r, favorited: !current } : r
        )
      )
      toast.success(current ? "已取消收藏" : "已收藏")
    } catch {
      toast.error("操作失败")
    }
  }

  function startEdit(record: typeof records[0]) {
    setEditingId(record.id)
    setEditContent(record.content || "")
  }

  function cancelEdit() {
    setEditingId(null)
    setEditContent("")
  }

  async function saveEdit(recordId: string) {
    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      })
      if (!res.ok) throw new Error()
      setRecords((prev) =>
        prev.map((r) => (r.id === recordId ? { ...r, content: editContent } : r))
      )
      setEditingId(null)
      toast.success("已保存")
    } catch {
      toast.error("保存失败")
    }
  }

  function handleExportAll() {
    const text = records
      .filter((r) => r.content)
      .map((r) => {
        const label = contentTypeInfo[r.contentType]?.label || r.contentType
        return `【${label}】\n${r.content}\n`
      })
      .join("\n---\n\n")

    if (!text) {
      toast.error("暂无内容可导出")
      return
    }

    downloadTextFile(text, `${project.productName}-全部内容.txt`)
    toast.success("已导出为 TXT 文件")
  }

  function handleCopyAll() {
    const text = records
      .filter((r) => r.content)
      .map((r) => {
        const label = contentTypeInfo[r.contentType]?.label || r.contentType
        return `【${label}】\n${r.content}\n`
      })
      .join("\n---\n\n")

    if (!text) {
      toast.error("暂无内容可复制")
      return
    }

    navigator.clipboard.writeText(text)
    toast.success("全部内容已复制到剪贴板")
  }

  function handleSaveToHistory() {
    toast.success("所有记录已自动保存")
  }

  function handleDownloadRecord(record: typeof records[0]) {
    if (!record.content) return
    const label = contentTypeInfo[record.contentType]?.label || record.contentType
    downloadTextFile(
      `【${label}】\n${record.content}`,
      `${project.productName}-${label}.txt`
    )
  }

  const getLatestRecord = (contentType: string) => {
    return records.find((r) => r.contentType === contentType)
  }

  const copyTypes = ["title", "bulletPoints", "shortDesc", "longDesc"]
  const imageTypes = ["mainImage", "sceneImage"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link
                href={`/dashboard/${project.id}`}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">返回项目</span>
              </Link>
              <Separator orientation="vertical" className="h-5 hidden sm:block" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold tracking-tight truncate">
                  {project.productName}
                </h1>
                <div className="hidden sm:flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-xs">
                    {platformLabels[project.platform] || project.platform}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {languageLabels[project.language] || project.language}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="size-4 sm:mr-1.5" />
                <span className="hidden sm:inline">复制全部</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAll}>
                <Download className="size-4 sm:mr-1.5" />
                <span className="hidden sm:inline">导出 TXT</span>
              </Button>
              <Button size="sm" onClick={handleSaveToHistory}>
                <Save className="size-4 sm:mr-1.5" />
                <span className="hidden sm:inline">保存记录</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary */}
        {records.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="text-sm text-muted-foreground">
              已生成 {records.length} 项内容
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              平台：{platformLabels[project.platform] || project.platform}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              语言：{languageLabels[project.language] || project.language}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              收藏：{records.filter((r) => r.favorited).length} 项
            </span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Copy Results - Left */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                <FileText className="size-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">文案结果</h2>
            </div>

            {copyTypes.map((type) => {
              const info = contentTypeInfo[type]
              if (!info) return null
              const Icon = info.icon
              const record = getLatestRecord(type)

              return (
                <Card
                  key={type}
                  className={`mb-4 border-l-4 overflow-hidden ${
                    record ? "" : "opacity-50"
                  }`}
                  style={{
                    borderLeftColor: record
                      ? `var(--${type === "title" ? "blue" : type === "bulletPoints" ? "emerald" : type === "shortDesc" ? "violet" : "amber"}-500)`
                      : undefined,
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-5 ${info.color}`} />
                        <CardTitle className="text-sm">{info.label}</CardTitle>
                        {record?.favorited && (
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      {record && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleToggleFavorite(record.id, record.favorited)
                            }
                            title={record.favorited ? "取消收藏" : "收藏"}
                          >
                            <Star
                              className={`size-4 ${
                                record.favorited
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }`}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {record?.content ? (
                      editingId === record.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={6}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveEdit(record.id)}
                            >
                              保存
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              取消
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-lg bg-muted/30 p-4">
                            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                              {record.content}
                            </pre>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                handleCopy(record.content, record.id)
                              }
                              title="复制"
                            >
                              {copiedId === record.id ? (
                                <Check className="size-4 text-emerald-500" />
                              ) : (
                                <Copy className="size-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => startEdit(record)}
                              title="编辑"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDownloadRecord(record)}
                              title="下载"
                            >
                              <Download className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleRegenerate(type)}
                              disabled={regenerating !== null}
                              title="重新生成"
                            >
                              {regenerating === type ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <RefreshCw className="size-4" />
                              )}
                            </Button>
                            <div className="ml-auto">
                              <Dialog
                                open={deletingId === record.id}
                                onOpenChange={(open) =>
                                  !open && setDeletingId(null)
                                }
                              >
                                <DialogTrigger
                                  render={
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => setDeletingId(record.id)}
                                      title="删除"
                                      className="hover:text-destructive"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  }
                                />
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>确认删除</DialogTitle>
                                    <DialogDescription>
                                      删除此{info.label}的生成记录？
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose
                                      render={
                                        <Button variant="outline">
                                          取消
                                        </Button>
                                      }
                                    />
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDelete(record.id)}
                                    >
                                      确认删除
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      <div className="rounded-lg bg-muted/10 p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          暂未生成{info.label}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleRegenerate(type)}
                          disabled={regenerating !== null}
                        >
                          <Sparkles className="size-3.5 mr-1.5" />
                          立即生成
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Image Results - Right */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                <ImageIcon className="size-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">图片结果</h2>
            </div>

            {imageTypes.map((type) => {
              const info = contentTypeInfo[type]
              if (!info) return null
              const Icon = info.icon
              const record = getLatestRecord(type)

              return (
                <Card
                  key={type}
                  className={`mb-4 border-l-4 overflow-hidden ${
                    record ? "" : "opacity-50"
                  }`}
                  style={{
                    borderLeftColor: record
                      ? `var(--${type === "mainImage" ? "pink" : "cyan"}-500)`
                      : undefined,
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-5 ${info.color}`} />
                        <CardTitle className="text-sm">{info.label}</CardTitle>
                        {record?.favorited && (
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      {record && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleToggleFavorite(record.id, record.favorited)
                            }
                            title={record.favorited ? "取消收藏" : "收藏"}
                          >
                            <Star
                              className={`size-4 ${
                                record.favorited
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }`}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {record?.imageUrl ? (
                      <div className="space-y-3">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted/20">
                          <img
                            src={record.imageUrl}
                            alt={info.label}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              const a = document.createElement("a")
                              a.href = record.imageUrl!
                              a.download = `${project.productName}-${info.label}.png`
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              toast.success("图片已下载")
                            }}
                            title="下载图片"
                          >
                            <Download className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleRegenerate(type)}
                            disabled={regenerating !== null}
                            title="重新生成"
                          >
                            {regenerating === type ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <RefreshCw className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              handleToggleFavorite(record.id, record.favorited)
                            }
                            title={record.favorited ? "取消收藏" : "收藏"}
                          >
                            <Star
                              className={`size-4 ${
                                record.favorited
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }`}
                            />
                          </Button>
                          <div className="ml-auto">
                            <Dialog
                              open={deletingId === record.id}
                              onOpenChange={(open) =>
                                !open && setDeletingId(null)
                              }
                            >
                              <DialogTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() =>
                                      setDeletingId(record.id)
                                    }
                                    title="删除"
                                    className="hover:text-destructive"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                }
                              />
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>确认删除</DialogTitle>
                                  <DialogDescription>
                                    删除此{info.label}的生成记录？
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose
                                    render={
                                      <Button variant="outline">
                                        取消
                                      </Button>
                                    }
                                  />
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleDelete(record.id)
                                    }
                                  >
                                    确认删除
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        {record.content && (
                          <details className="group">
                            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                              查看生成提示词
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap text-xs font-sans text-muted-foreground bg-muted/20 rounded-lg p-3">
                              {record.content}
                            </pre>
                          </details>
                        )}
                      </div>
                    ) : record?.content ? (
                      <>
                        <div className="rounded-lg bg-muted/30 p-4">
                          <p className="text-xs text-muted-foreground mb-2">
                            生成的提示词：
                          </p>
                          {editingId === record.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={6}
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit(record.id)}
                                >
                                  保存
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEdit}
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                                {record.content}
                              </pre>
                              <div className="flex items-center gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() =>
                                    handleCopy(record.content, record.id)
                                  }
                                  title="复制"
                                >
                                  {copiedId === record.id ? (
                                    <Check className="size-4 text-emerald-500" />
                                  ) : (
                                    <Copy className="size-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => startEdit(record)}
                                  title="编辑"
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleDownloadRecord(record)}
                                  title="下载"
                                >
                                  <Download className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleRegenerate(type)}
                                  disabled={regenerating !== null}
                                  title="重新生成"
                                >
                                  {regenerating === type ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <RefreshCw className="size-4" />
                                  )}
                                </Button>
                                {record.prompt && (
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() =>
                                      handleCopy(
                                        record.prompt,
                                        `prompt-${record.id}`
                                      )
                                    }
                                    title="复制提示词"
                                  >
                                    {copiedId === `prompt-${record.id}` ? (
                                      <Check className="size-4 text-emerald-500" />
                                    ) : (
                                      <Copy className="size-4" />
                                    )}
                                  </Button>
                                )}
                                <div className="ml-auto">
                                  <Dialog
                                    open={deletingId === record.id}
                                    onOpenChange={(open) =>
                                      !open && setDeletingId(null)
                                    }
                                  >
                                    <DialogTrigger
                                      render={
                                        <Button
                                          variant="ghost"
                                          size="icon-sm"
                                          onClick={() =>
                                            setDeletingId(record.id)
                                          }
                                          title="删除"
                                          className="hover:text-destructive"
                                        >
                                          <Trash2 className="size-4" />
                                        </Button>
                                      }
                                    />
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>确认删除</DialogTitle>
                                        <DialogDescription>
                                          删除此{info.label}的生成记录？
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <DialogClose
                                          render={
                                            <Button variant="outline">
                                              取消
                                            </Button>
                                          }
                                        />
                                        <Button
                                          variant="destructive"
                                          onClick={() =>
                                            handleDelete(record.id)
                                          }
                                        >
                                          确认删除
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="rounded-lg bg-muted/10 p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          暂未生成{info.label}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleRegenerate(type)}
                          disabled={regenerating !== null}
                        >
                          <Sparkles className="size-3.5 mr-1.5" />
                          立即生成
                        </Button>
                      </div>
                    )}

                    {/* Reserved extensions */}
                    {type === "mainImage" && (
                      <div className="mt-3 rounded-lg border border-dashed border-muted-foreground/20 p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          + Banner 图（预留扩展）
                        </p>
                      </div>
                    )}
                    {type === "sceneImage" && (
                      <div className="mt-3 rounded-lg border border-dashed border-muted-foreground/20 p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          + 社媒图（预留扩展）
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-xl border bg-background/50 p-3 sm:p-4">
          <Button variant="outline" size="sm" className="sm:hidden" onClick={() => router.push(`/dashboard/${project.id}`)}>
            <ArrowLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden" onClick={() => router.push("/dashboard/new")}>
            <Plus className="size-4" />
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => router.push(`/dashboard/${project.id}`)}>
            <ArrowLeft className="size-4 mr-1.5" />
            继续编辑商品
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => router.push("/dashboard/new")}>
            <Plus className="size-4 mr-1.5" />
            新建商品
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <Button variant="secondary" size="sm" onClick={handleSaveToHistory}>
            <Save className="size-4 sm:mr-1.5" />
            <span className="hidden sm:inline">保存到历史记录</span>
          </Button>
          <Button variant="default" size="sm" onClick={handleCopyAll}>
            <Copy className="size-4 sm:mr-1.5" />
            <span className="hidden sm:inline">复制全部内容</span>
          </Button>
          <Button variant="default" size="sm" onClick={handleExportAll}>
            <Download className="size-4 sm:mr-1.5" />
            <span className="hidden sm:inline">导出 TXT 文件</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
