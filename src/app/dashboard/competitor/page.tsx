"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Swords,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  TrendingUp,
  Target,
  Search,
  History,
  Trash2,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { platformLabels, contentTypeLabels } from "@/types"
import {
  analyzeCompetitor,
  type CompetitorReport,
} from "@/lib/competitor-analysis"

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
  records: Array<{
    contentType: string
    content: string | null
  }>
}

export default function CompetitorPage() {
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [compTitle, setCompTitle] = useState("")
  const [compBullets, setCompBullets] = useState("")
  const [compDesc, setCompDesc] = useState("")
  const [report, setReport] = useState<CompetitorReport | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/analysis?type=competitor&limit=20")
      const data = await res.json()
      if (res.ok && data.records) {
        setHistory(data.records)
      }
    } catch {
      // ignore
    }
  }, [])

  // Fetch user's projects + history
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

  async function handleAnalyze() {
    if (!selectedProject) {
      toast.error("请先选择一个项目")
      return
    }
    if (!compTitle.trim() && !compBullets.trim() && !compDesc.trim()) {
      toast.error("请至少粘贴竞品的标题、要点或描述")
      return
    }

    setAnalyzing(true)

    // Extract your content from records
    const myContent: Record<string, string> = {}
    for (const r of selectedProject.records) {
      if (r.content && !myContent[r.contentType]) {
        myContent[r.contentType] = r.content
      }
    }

    const input = {
      platform: selectedProject.platform,
      your: {
        title: myContent.title,
        bulletPoints: myContent.bulletPoints,
        description: myContent.longDesc || myContent.shortDesc,
        keywords: selectedProject.keywords || undefined,
      },
      competitor: {
        title: compTitle.trim() || undefined,
        bulletPoints: compBullets.trim() || undefined,
        description: compDesc.trim() || undefined,
      },
    }

    const result = analyzeCompetitor(input)
    setReport(result)

    // Save to history
    try {
      const summary = `关键词缺口 ${result.keywordGap.missing.length} · 卖点差异 ${result.sellingPointDiff.competitorUnique.length} · 建议 ${result.suggestions.length}`
      await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          projectName: selectedProject.productName,
          analysisType: "competitor",
          inputData: JSON.stringify({
            competitorTitle: compTitle.trim(),
            competitorBullets: compBullets.trim(),
            competitorDesc: compDesc.trim(),
          }),
          resultData: JSON.stringify(result),
          summary,
        }),
      })
      await loadHistory()
    } catch {
      // ignore save errors
    }

    setAnalyzing(false)
    toast.success("分析完成")
  }

  function loadHistoryRecord(item: AnalysisHistoryItem) {
    try {
      const input = JSON.parse(item.inputData) as {
        competitorTitle?: string
        competitorBullets?: string
        competitorDesc?: string
      }
      const result = JSON.parse(item.resultData) as CompetitorReport

      setCompTitle(input.competitorTitle || "")
      setCompBullets(input.competitorBullets || "")
      setCompDesc(input.competitorDesc || "")
      setReport(result)
      setShowHistory(false)
      toast.success("已加载历史分析")
    } catch {
      toast.error("加载历史记录失败")
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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">竞品分析</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            对比竞品 Listing 内容，找出关键词差距和优化机会
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory((v) => !v)}
          className="gap-1.5"
        >
          <History className="size-4" />
          历史记录 {history.length > 0 && `(${history.length})`}
        </Button>
      </div>

      {/* History panel */}
      {showHistory && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">分析历史</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="py-3 text-xs text-muted-foreground text-center">
                暂无历史记录，完成一次分析后会自动保存
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryRecord(item)}
                    className="group flex items-start gap-3 rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-4">
          {/* Project selector */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">选择你的项目</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  加载项目...
                </div>
              ) : projects.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  暂无项目，请先创建一个项目并生成内容
                </p>
              ) : (
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value)
                    setReport(null)
                  }}
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

              {selectedProject && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedProject.records
                    .filter((r) => r.content)
                    .map((r) => r.contentType)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((ct) => (
                      <span
                        key={ct}
                        className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                      >
                        {contentTypeLabels[ct] || ct}
                      </span>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competitor input */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">粘贴竞品内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  竞品标题
                </label>
                <Textarea
                  value={compTitle}
                  onChange={(e) => setCompTitle(e.target.value)}
                  placeholder="粘贴竞品的商品标题..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  竞品要点/卖点
                </label>
                <Textarea
                  value={compBullets}
                  onChange={(e) => setCompBullets(e.target.value)}
                  placeholder="粘贴竞品的要点描述，每行一条..."
                  rows={4}
                  className="text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  竞品描述
                </label>
                <Textarea
                  value={compDesc}
                  onChange={(e) => setCompDesc(e.target.value)}
                  placeholder="粘贴竞品的产品描述..."
                  rows={4}
                  className="text-sm resize-none"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing || !selectedProjectId}
                className="w-full gap-2"
              >
                {analyzing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Swords className="size-4" />
                )}
                开始分析
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {!report ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center py-16">
                <Search className="size-10 text-muted-foreground/20 mb-3" />
                <h3 className="text-sm font-semibold mb-1">等待分析</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  选择你的项目，粘贴竞品的标题、要点和描述，点击开始分析
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Keyword Gap */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-sm">关键词差距</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {report.keywordGap.missing.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1">
                        <MinusCircle className="size-3" />
                        你缺少的关键词（{report.keywordGap.missing.length}）
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.keywordGap.missing.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex rounded-full border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 text-[11px] text-red-700 dark:text-red-300"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.keywordGap.unique.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        你独有的关键词（{report.keywordGap.unique.length}）
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.keywordGap.unique.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex rounded-full border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 text-[11px] text-green-700 dark:text-green-300"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.keywordGap.shared.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        共有关键词（{report.keywordGap.shared.length}）
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {report.keywordGap.shared.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Title Analysis */}
              {report.titleAnalysis && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-violet-600 dark:text-violet-400" />
                      <CardTitle className="text-sm">标题对比</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-[10px] text-muted-foreground mb-0.5">你的标题</p>
                        <p className="text-lg font-semibold">{report.titleAnalysis.yourLength}</p>
                        <p className="text-[10px] text-muted-foreground">字符</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-[10px] text-muted-foreground mb-0.5">竞品标题</p>
                        <p className="text-lg font-semibold">{report.titleAnalysis.competitorLength}</p>
                        <p className="text-[10px] text-muted-foreground">字符</p>
                      </div>
                    </div>
                    {report.titleAnalysis.missingKeywords.length > 0 && (
                      <div className="pt-1">
                        <p className="text-xs text-muted-foreground mb-1">
                          竞品标题中你没有的词：
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {report.titleAnalysis.missingKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="inline-flex rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 px-1.5 py-0.5 text-[11px] text-amber-700 dark:text-amber-300"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Selling Point Diff */}
              {(report.sellingPointDiff.competitorUnique.length > 0 ||
                report.sellingPointDiff.yourUnique.length > 0) && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Swords className="size-4 text-amber-600 dark:text-amber-400" />
                      <CardTitle className="text-sm">卖点差异</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {report.sellingPointDiff.competitorUnique.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                          竞品有而你没有的卖点
                        </p>
                        <ul className="space-y-1">
                          {report.sellingPointDiff.competitorUnique.map((p, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <MinusCircle className="size-3 mt-0.5 shrink-0 text-red-400" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {report.sellingPointDiff.yourUnique.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                          你独有的卖点
                        </p>
                        <ul className="space-y-1">
                          {report.sellingPointDiff.yourUnique.map((p, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <CheckCircle2 className="size-3 mt-0.5 shrink-0 text-green-400" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Suggestions & Notes */}
              {(report.suggestions.length > 0 || report.structureNotes.length > 0) && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                      <CardTitle className="text-sm">优化建议</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.suggestions.map((s, i) => (
                        <li key={`s-${i}`} className="flex items-start gap-2 text-xs">
                          <ArrowRight className="size-3 mt-0.5 shrink-0 text-primary" />
                          <span>{s}</span>
                        </li>
                      ))}
                      {report.structureNotes.map((n, i) => (
                        <li key={`n-${i}`} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <ArrowRight className="size-3 mt-0.5 shrink-0" />
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
