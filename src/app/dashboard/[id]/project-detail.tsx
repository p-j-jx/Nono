"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Loader2,
  FileText,
  ListOrdered,
  AlignLeft,
  BookOpen,
  ImageIcon,
  ImagePlus,
  Copy,
  Check,
  Trash2,
  Eye,
  Pencil,
  Download,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Star,
  Megaphone,
  Search,
  Video,
  PanelTop,
  Share2,
  ImageDown,
} from "lucide-react"
import { toast } from "sonner"
import type { Project, GenerationRecord } from "@/types"
import {
  platformLabels,
  languageLabels,
  contentTypeLabels,
  categoryLabel,
  downloadTextFile,
  generationTypeConfig,
  contentTypeGroups,
} from "@/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, ListOrdered, AlignLeft, BookOpen, ImageIcon, ImagePlus,
  Megaphone, Search, Video, PanelTop, Share2, ImageDown,
}

const generationTypes = generationTypeConfig.map((cfg) => ({
  key: cfg.key,
  label: cfg.label,
  desc: cfg.desc,
  icon: iconMap[cfg.iconName] || FileText,
  gradient: cfg.gradient,
  iconColor: cfg.iconColor,
  borderColor: cfg.borderColor,
}))

export function ProjectDetail({ project }: { project: Project }) {
  const router = useRouter()
  const [generating, setGenerating] = useState<string | null>(null)
  const [records, setRecords] = useState(project.records)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)
  const [batchProgress, setBatchProgress] = useState<{
    running: boolean
    completed: number
    total: number
    errors: string[]
  } | null>(null)
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set())
  const [compareMode, setCompareMode] = useState<{
    contentType: string
    versionA: string | null
    versionB: string | null
  } | null>(null)

  // Track recently viewed
  useEffect(() => {
    try {
      const recent = JSON.parse(
        localStorage.getItem("recentProjects") || "[]"
      ) as Array<{ id: string; name: string; viewedAt: number }>
      const updated = [
        { id: project.id, name: project.productName, viewedAt: Date.now() },
        ...recent.filter((p) => p.id !== project.id),
      ].slice(0, 5)
      localStorage.setItem("recentProjects", JSON.stringify(updated))
    } catch {
      // ignore
    }
  }, [project.id, project.productName])

  async function handleGenerate(contentType: string) {
    setGenerating(contentType)

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
      toast.success(`${contentTypeLabels[contentType] || contentType} 生成成功！`)
    } catch {
      toast.error("生成失败，请稍后再试")
    } finally {
      setGenerating(null)
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

  async function handleDeleteProject() {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      toast.success("项目已删除")
      router.push("/dashboard")
    } catch {
      toast.error("删除失败")
    }
  }

  function handleCopy(content: string | null, recordId: string) {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopiedId(recordId)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("已复制到剪贴板")
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

  async function handleDownloadRecord(record: typeof records[0]) {
    if (!record.content) return
    const label = contentTypeLabels[record.contentType] || record.contentType
    const text = `【${label}】\n${record.content}`
    downloadTextFile(text, `${project.productName}-${label}.txt`)
  }

  async function handleBatchGenerate() {
    const types = generationTypes.map((t) => t.key)
    const errors: string[] = []
    let completed = 0

    setBatchProgress({ running: true, completed: 0, total: types.length, errors: [] })

    for (const type of types) {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: project.id, contentType: type }),
        })
        const data = await res.json()
        if (res.ok) {
          setRecords((prev) => [data.record, ...prev])
        } else {
          errors.push(type)
        }
      } catch {
        errors.push(type)
      }
      completed++
      setBatchProgress((prev) =>
        prev ? { ...prev, completed, errors: [...errors] } : null
      )
    }

    if (errors.length > 0) {
      toast.error(
        `已完成 ${types.length - errors.length}/${types.length}，${errors.length} 项生成失败`
      )
    } else {
      toast.success("全部 6 项内容生成完成！")
    }
    setBatchProgress(null)
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
        prev.map((r) => (r.id === recordId ? { ...r, favorited: !current } : r))
      )
    } catch {
      toast.error("操作失败")
    }
  }

  // Group records by contentType
  const groupedRecords: Record<string, typeof records> = {}
  for (const record of records) {
    const key = record.contentType
    if (!groupedRecords[key]) groupedRecords[key] = []
    groupedRecords[key].push(record)
  }

  function toggleExpand(type: string) {
    setExpandedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        返回工作台
      </Link>

      {/* Project Info Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">
              {project.productName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {platformLabels[project.platform] || project.platform}
              </span>
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {languageLabels[project.language] || project.language}
              </span>
              {project.category && (
                <span className="text-xs text-muted-foreground">
                  {categoryLabel(project.category)}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {records.length} 条记录
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/dashboard/${project.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Pencil className="size-4" />
              编辑
            </Link>
            <Link
              href={`/results?projectId=${project.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Eye className="size-4" />
              查看完整结果
            </Link>
            <Dialog open={deleteProjectOpen} onOpenChange={setDeleteProjectOpen}>
              <DialogTrigger render={
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-4" />
                </Button>
              } />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>确认删除项目</DialogTitle>
                  <DialogDescription>
                    此操作将永久删除项目「{project.productName}」及其所有{" "}
                    {records.length} 条生成记录。此操作不可撤销。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">取消</Button>} />
                  <Button
                    variant="destructive"
                    onClick={handleDeleteProject}
                  >
                    确认删除
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Details Summary */}
        {(project.features ||
          project.sellingPoints ||
          project.keywords ||
          project.targetAudience) && (
          <Card className="mt-4">
            <CardContent className="pt-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.features && (
                  <div>
                    <span className="text-xs text-muted-foreground">产品特点</span>
                    <p className="mt-0.5">{project.features}</p>
                  </div>
                )}
                {project.sellingPoints && (
                  <div>
                    <span className="text-xs text-muted-foreground">核心卖点</span>
                    <p className="mt-0.5">{project.sellingPoints}</p>
                  </div>
                )}
                {project.keywords && (
                  <div>
                    <span className="text-xs text-muted-foreground">关键词</span>
                    <p className="mt-0.5">{project.keywords}</p>
                  </div>
                )}
                {project.targetAudience && (
                  <div>
                    <span className="text-xs text-muted-foreground">目标人群</span>
                    <p className="mt-0.5">{project.targetAudience}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Batch Generate */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">选择要生成的内容</h2>
        <Button
          variant="default"
          size="sm"
          onClick={handleBatchGenerate}
          disabled={batchProgress?.running || generating !== null}
          className="gap-2"
        >
          {batchProgress?.running ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {batchProgress?.running
            ? `生成中 ${batchProgress.completed}/${batchProgress.total}`
            : "生成全部"}
        </Button>
      </div>

      {/* Batch Progress */}
      {batchProgress?.running && (
        <div className="mb-4 p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              正在生成... {batchProgress.completed}/{batchProgress.total}
            </span>
            <Loader2 className="size-4 animate-spin" />
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${(batchProgress.completed / batchProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Generation Options */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {generationTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.key}
              type="button"
              disabled={generating !== null || batchProgress?.running || false}
              onClick={() => handleGenerate(type.key)}
              className={`group relative rounded-xl border ${type.borderColor} bg-gradient-to-br ${type.gradient} p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
            >
              <div
                className={`flex size-10 items-center justify-center rounded-lg bg-background/80 ring-1 ring-border/50 mb-3 ${type.iconColor}`}
              >
                {generating === type.key ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Icon className="size-5" />
                )}
              </div>
              <h3 className="font-semibold text-sm mb-1">{type.label}</h3>
              <p className="text-xs text-muted-foreground">{type.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Generated Results - Version Grouped */}
      {records.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4">生成记录</h2>
          <div className="space-y-4">
            {generationTypes.map((type) => {
              const typeRecords = groupedRecords[type.key]
              if (!typeRecords || typeRecords.length === 0) return null

              const Icon = type.icon
              const isExpanded = expandedTypes.has(type.key)

              return (
                <Card key={type.key} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/30 transition-colors py-3"
                    onClick={() => toggleExpand(type.key)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`size-5 ${type.iconColor}`} />
                        <CardTitle className="text-sm">
                          {contentTypeLabels[type.key]}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                          {typeRecords.length} 个版本
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-3">
                      {/* Compare mode toggle */}
                      {typeRecords.length >= 2 && (
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (compareMode?.contentType === type.key) {
                                setCompareMode(null)
                              } else {
                                // Default: compare oldest vs newest
                                const sorted = [...typeRecords].sort(
                                  (a, b) =>
                                    new Date(a.createdAt).getTime() -
                                    new Date(b.createdAt).getTime()
                                )
                                setCompareMode({
                                  contentType: type.key,
                                  versionA: sorted[0].id,
                                  versionB: sorted[sorted.length - 1].id,
                                })
                              }
                            }}
                          >
                            {compareMode?.contentType === type.key
                              ? "退出对比"
                              : "版本对比"}
                          </Button>
                        </div>
                      )}

                      {/* Compare view */}
                      {compareMode?.contentType === type.key && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          {typeRecords
                            .filter(
                              (r) =>
                                r.id === compareMode.versionA ||
                                r.id === compareMode.versionB
                            )
                            .map((r) => (
                              <div key={r.id} className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground mb-2">
                                  {new Date(r.createdAt).toLocaleString("zh-CN")}
                                </div>
                                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                                  {r.content || "(无内容)"}
                                </pre>
                              </div>
                            ))}
                        </div>
                      )}

                      {typeRecords.map((record, index) => (
                        <div
                          key={record.id}
                          className="rounded-lg border border-border/50 overflow-hidden"
                        >
                          {/* Version header */}
                          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/20 border-b border-border/50">
                            <span className="text-xs text-muted-foreground">
                              v{typeRecords.length - index} ·{" "}
                              {new Date(record.createdAt).toLocaleString("zh-CN")}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  handleDownloadRecord(record)
                                }
                                title="下载"
                                disabled={!record.content}
                              >
                                <Download className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  handleToggleFavorite(
                                    record.id,
                                    record.favorited
                                  )
                                }
                                title="收藏"
                              >
                                <Star
                                  className={`size-3.5 ${
                                    record.favorited
                                      ? "fill-amber-400 text-amber-400"
                                      : ""
                                  }`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => {
                                  handleCopy(
                                    record.content || record.imageUrl,
                                    record.id
                                  )
                                }}
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
                                onClick={() => startEdit(record)}
                                title="编辑"
                                disabled={!record.content}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
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
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  }
                                />
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>确认删除</DialogTitle>
                                    <DialogDescription>
                                      删除此
                                      {contentTypeLabels[record.contentType] ||
                                        record.contentType}
                                      的生成记录？
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

                          {/* Content */}
                          <div className="p-3">
                            {editingId === record.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) =>
                                    setEditContent(e.target.value)
                                  }
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
                            ) : (record.contentType === "mainImage" ||
                                record.contentType === "sceneImage") &&
                              record.imageUrl ? (
                              <div className="space-y-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={record.imageUrl}
                                  alt={record.content || "生成图片"}
                                  className="w-full rounded-lg border border-border/50"
                                />
                                {record.content && (
                                  <details className="text-xs text-muted-foreground">
                                    <summary className="cursor-pointer hover:text-foreground transition-colors">
                                      查看提示词
                                    </summary>
                                    <pre className="mt-2 whitespace-pre-wrap font-sans text-foreground/80 leading-relaxed">
                                      {record.content}
                                    </pre>
                                  </details>
                                )}
                              </div>
                            ) : record.content ? (
                              <pre className="whitespace-pre-wrap text-sm font-sans text-foreground/90 leading-relaxed">
                                {record.content}
                              </pre>
                            ) : record.imageUrl ? (
                              <div className="space-y-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={record.imageUrl}
                                  alt="生成图片"
                                  className="w-full rounded-lg border border-border/50"
                                />
                                <a
                                  href={record.imageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline block"
                                >
                                  查看原图
                                </a>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                (无内容)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
