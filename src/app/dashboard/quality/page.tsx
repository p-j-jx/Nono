"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ShieldCheck,
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
  History,
  Clock,
  Trash2,
  Save,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { platformLabels, contentTypeLabels } from "@/types"
import ListingChecker from "@/components/dashboard/listing-checker"
import { checkListing } from "@/lib/listing-checker"

type AnalysisHistoryItem = {
  id: string
  projectName: string | null
  summary: string | null
  inputData: string
  resultData: string
  createdAt: string
}

type ProjectOption = {
  id: string
  productName: string
  platform: string
  keywords: string | null
  brandName: string | null
  sellingPoints: string | null
  bannedWords: string | null
  records: Array<{
    contentType: string
    content: string | null
  }>
}

const TEXT_TYPES = ["title", "bulletPoints", "shortDesc", "longDesc", "adCopy", "seoKeywords", "brandStory"]

export default function QualityPage() {
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(["title", "bulletPoints", "shortDesc", "longDesc"]))
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/analysis?type=quality&limit=20")
      const data = await res.json()
      if (res.ok && data.records) {
        setHistory(data.records)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const [projRes] = await Promise.all([fetch("/api/projects"), loadHistory()])
        const data = await projRes.json()
        if (projRes.ok && data.projects) {
          setProjects(data.projects)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [loadHistory])

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  // Get content records grouped by type
  const contentMap: Record<string, string> = {}
  if (selectedProject) {
    for (const r of selectedProject.records) {
      if (r.content && TEXT_TYPES.includes(r.contentType) && !contentMap[r.contentType]) {
        contentMap[r.contentType] = r.content
      }
    }
  }

  const contentTypes = Object.keys(contentMap)

  function toggleExpand(type: string) {
    setExpandedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  async function saveSnapshot() {
    if (!selectedProject || contentTypes.length === 0) return
    setSaving(true)
    try {
      // Run all checks
      const reports: Record<string, { score: number; checks: number; pass: number; fail: number }> = {}
      let totalScore = 0
      let totalFail = 0
      for (const ct of contentTypes) {
        const r = checkListing({
          platform: selectedProject.platform,
          contentType: ct,
          content: contentMap[ct],
          keywords: selectedProject.keywords,
          brandName: selectedProject.brandName,
          sellingPoints: selectedProject.sellingPoints,
          bannedWords: selectedProject.bannedWords,
        })
        const pass = r.checks.filter((c) => c.severity === "pass").length
        const fail = r.checks.filter((c) => c.severity === "fail").length
        reports[ct] = { score: r.score, checks: r.checks.length, pass, fail }
        totalScore += r.score
        totalFail += fail
      }
      const avg = Math.round(totalScore / contentTypes.length)
      const summary = `平均分 ${avg} · 检查 ${contentTypes.length} 项内容 · ${totalFail} 处失败`

      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          projectName: selectedProject.productName,
          analysisType: "quality",
          inputData: JSON.stringify({ contentMap, platform: selectedProject.platform }),
          resultData: JSON.stringify({ reports, avgScore: avg }),
          summary,
        }),
      })
      if (!res.ok) throw new Error()
      await loadHistory()
      toast.success("已保存本次检查快照")
    } catch {
      toast.error("保存失败")
    } finally {
      setSaving(false)
    }
  }

  async function deleteHistoryRecord(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/analysis/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setHistory((prev) => prev.filter((h) => h.id !== id))
      toast.success("已删除")
    } catch {
      toast.error("删除失败")
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">质量检查</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            基于平台规则检测 Listing 内容合规性，发现违禁词、长度问题和关键词覆盖不足
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedProject && contentTypes.length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={saveSnapshot}
              disabled={saving}
              className="gap-1.5"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              保存快照
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory((v) => !v)}
            className="gap-1.5"
          >
            <History className="size-4" />
            历史 {history.length > 0 && `(${history.length})`}
          </Button>
        </div>
      </div>

      {/* History panel */}
      {showHistory && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">检查历史</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="py-3 text-xs text-muted-foreground text-center">
                暂无历史记录，点击「保存快照」可记录当次检查
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/30 transition-colors"
                  >
                    <Clock className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {item.projectName || "未关联项目"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString("zh-CN")}
                        </span>
                      </div>
                      {item.summary && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => deleteHistoryRecord(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                      title="删除"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Project selector */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <label className="text-xs text-muted-foreground mb-1.5 block">选择要检查的项目</label>
          {loading ? (
            <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              加载项目...
            </div>
          ) : projects.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">
              暂无项目，请先创建一个项目并生成内容
            </p>
          ) : (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">选择项目...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productName} ({platformLabels[p.platform] || p.platform})
                </option>
              ))}
            </select>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {!selectedProject ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center py-16">
            <ShieldCheck className="size-10 text-muted-foreground/20 mb-3" />
            <h3 className="text-sm font-semibold mb-1">选择项目开始检查</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              选择一个已生成内容的项目，系统将自动检测各项文案的合规性
            </p>
          </CardContent>
        </Card>
      ) : contentTypes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center py-16">
            <Search className="size-10 text-muted-foreground/20 mb-3" />
            <h3 className="text-sm font-semibold mb-1">暂无可检查的内容</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              该项目尚未生成文案内容，请先在项目详情中生成内容
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {contentTypes.map((ct) => {
            const isExpanded = expandedTypes.has(ct)
            return (
              <Card key={ct} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-muted/20 transition-colors py-3"
                  onClick={() => toggleExpand(ct)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <CardTitle className="text-sm">
                        {contentTypeLabels[ct] || ct}
                      </CardTitle>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    {/* Show a preview of content */}
                    <div className="mb-4 rounded-lg bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground mb-1">检查内容预览</p>
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {contentMap[ct]}
                      </p>
                    </div>
                    <ListingChecker
                      platform={selectedProject.platform}
                      contentType={ct}
                      content={contentMap[ct]}
                      keywords={selectedProject.keywords}
                      brandName={selectedProject.brandName}
                      sellingPoints={selectedProject.sellingPoints}
                      bannedWords={selectedProject.bannedWords}
                    />
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
