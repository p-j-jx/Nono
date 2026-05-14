"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, ArrowRight, Check, Copy, Download, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { platformLabels, languageLabels, contentTypeLabels, downloadTextFile } from "@/types"
import Link from "next/link"

type ContentTypeOption = {
  key: string
  label: string
  desc: string
}

type QuickGenerateProps = {
  title: string
  description: string
  accentGradient: string
  accentColor: string
  contentTypeOptions: ContentTypeOption[]
  defaultContentTypes: string[]
}

export function QuickGenerate({
  title,
  description,
  accentGradient,
  accentColor,
  contentTypeOptions,
  defaultContentTypes,
}: QuickGenerateProps) {
  const router = useRouter()

  // Form state
  const [productName, setProductName] = useState("")
  const [features, setFeatures] = useState("")
  const [sellingPoints, setSellingPoints] = useState("")
  const [platform, setPlatform] = useState("amazon")
  const [language, setLanguage] = useState("zh")
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(defaultContentTypes))

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<Array<{
    id: string
    projectId: string
    contentType: string
    content: string | null
    imageUrl: string | null
    favorited: boolean
  }> | null>(null)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function toggleType(key: string) {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function handleGenerate() {
    if (!productName.trim()) {
      toast.error("请输入商品名称")
      return
    }
    if (selectedTypes.size === 0) {
      toast.error("请选择至少一个生成类型")
      return
    }

    setGenerating(true)
    setResults(null)

    try {
      // Step 1: Create project
      const projectRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName.trim(),
          features: features || null,
          sellingPoints: sellingPoints || null,
          platform,
          language,
        }),
      })
      const projectData = await projectRes.json()
      if (!projectRes.ok) throw new Error(projectData.error)
      const projectId = projectData.project.id
      setCurrentProjectId(projectId)

      // Step 2: Generate selected content types
      const newResults: typeof results = []
      const types = Array.from(selectedTypes)

      for (const contentType of types) {
        try {
          const genRes = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, contentType }),
          })
          const genData = await genRes.json()
          if (genRes.ok && genData.record) {
            newResults.push(genData.record)
          }
        } catch {
          // continue to next type
        }
      }

      // Sort results to match selectedTypes order
      newResults.sort((a, b) => types.indexOf(a.contentType) - types.indexOf(b.contentType))
      setResults(newResults)

      if (newResults.length > 0) {
        toast.success(`成功生成 ${newResults.length}/${types.length} 项内容`)
      } else {
        toast.error("生成失败，请稍后再试")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "生成失败")
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy(content: string | null, recordId: string) {
    if (!content) return
    navigator.clipboard.writeText(content)
    setCopiedId(recordId)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("已复制")
  }

  function handleDownload(content: string | null, contentType: string) {
    if (!content) return
    const label = contentTypeLabels[contentType] || contentType
    const text = `【${label}】\n${content}`
    downloadTextFile(text, `${productName}-${label}.txt`)
  }

  async function handleToggleFavorite(recordId: string, current: boolean) {
    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorited: !current }),
      })
      if (!res.ok) throw new Error()
      setResults((prev) =>
        prev?.map((r) => (r.id === recordId ? { ...r, favorited: !current } : r)) || null
      )
      toast.success(current ? "已取消收藏" : "已收藏")
    } catch {
      toast.error("操作失败")
    }
  }

  const isCopyPage = contentTypeOptions[0]?.key === "title"

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-sm font-semibold">商品信息</h2>

              <div className="space-y-2">
                <Label htmlFor="productName">商品名称 *</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="输入商品名称"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">产品特点 / 核心功能</Label>
                <Textarea
                  id="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="例如：无线蓝牙连接、续航30天、IPX7防水..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPoints">核心卖点</Label>
                <Textarea
                  id="sellingPoints"
                  value={sellingPoints}
                  onChange={(e) => setSellingPoints(e.target.value)}
                  placeholder="例如：性价比高、轻便易携带、适合送礼..."
                  rows={2}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>目标平台</Label>
                  <Select value={platform} onValueChange={(v) => v && setPlatform(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(platformLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>输出语言</Label>
                  <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languageLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content type selection */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h2 className="text-sm font-semibold">生成类型</h2>
              <div className="grid grid-cols-1 gap-2">
                {contentTypeOptions.map((type) => {
                  const selected = selectedTypes.has(type.key)
                  return (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => toggleType(type.key)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        selected
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/50 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div
                        className={`flex size-5 items-center justify-center rounded border transition-colors ${
                          selected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {selected && <Check className="size-3" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Generate button */}
          <Button
            size="lg"
            className="w-full gap-2 shadow-lg shadow-primary/20 h-11"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {generating ? "生成中..." : "开始生成"}
          </Button>

          {results && results.length > 0 && currentProjectId && (
            <Link
              href={`/dashboard/${currentProjectId}`}
              className={buttonVariants({ variant: "outline", className: "w-full gap-2" })}
            >
              查看完整项目 <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold mb-4">生成结果</h2>

              {generating && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="size-8 animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">AI 正在生成内容...</p>
                </div>
              )}

              {!generating && !results && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
                    <Sparkles className="size-6 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">等待生成</h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    填写商品信息并选择生成类型，点击「开始生成」按钮
                  </p>
                </div>
              )}

              {!generating && results && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm text-muted-foreground">生成失败，请稍后再试</p>
                </div>
              )}

              {results && results.length > 0 && (
                <div className="space-y-4">
                  {results.map((record) => (
                    <Card key={record.id} className="overflow-hidden border-border/50">
                      <CardContent className="p-0">
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/20 border-b border-border/50">
                          <span className="text-xs font-medium text-primary">
                            {contentTypeLabels[record.contentType] || record.contentType}
                          </span>
                          <div className="flex items-center gap-1">
                            {record.content && (
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
                                  onClick={() => handleDownload(record.content, record.contentType)}
                                  title="下载"
                                >
                                  <Download className="size-3.5" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleToggleFavorite(record.id, record.favorited)}
                              title="收藏"
                            >
                              <Star
                                className={`size-3.5 ${
                                  record.favorited ? "fill-amber-400 text-amber-400" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          {record.imageUrl ? (
                            <div>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={record.imageUrl}
                                alt={record.content || "生成图片"}
                                className="w-full rounded-lg border border-border/50"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none"
                                }}
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
                          ) : isCopyPage && record.content ? (
                            <pre className="whitespace-pre-wrap text-sm font-sans text-foreground/90 leading-relaxed">
                              {record.content}
                            </pre>
                          ) : record.content ? (
                            <div>
                              <pre className="whitespace-pre-wrap text-sm font-sans text-foreground/90 leading-relaxed rounded-lg bg-muted/30 p-3">
                                {record.content}
                              </pre>
                              <p className="mt-2 text-xs text-muted-foreground">
                                提示词已生成，可复制到 AI 绘图工具（如 Midjourney、DALL·E）中生成图片
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">(无内容)</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
