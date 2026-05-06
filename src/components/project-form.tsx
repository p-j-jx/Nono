"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { Loader2, ArrowLeft, Sparkles, Wand2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const categoryOptions = [
  { value: "electronics", label: "电子产品" },
  { value: "clothing", label: "服装鞋帽" },
  { value: "home", label: "家居园艺" },
  { value: "beauty", label: "美容个护" },
  { value: "sports", label: "运动户外" },
  { value: "toys", label: "玩具游戏" },
  { value: "food", label: "食品饮料" },
  { value: "other", label: "其他" },
]

const platformOptions = [
  { value: "amazon", label: "Amazon" },
  { value: "shopify", label: "Shopify" },
  { value: "tiktok", label: "TikTok Shop" },
]

const languageOptions = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
]

const brandToneOptions = [
  { value: "professional", label: "专业权威" },
  { value: "fashionable", label: "时尚潮流" },
  { value: "friendly", label: "亲切友好" },
  { value: "luxury", label: "高端奢华" },
  { value: "humorous", label: "幽默风趣" },
]

const priceRangeOptions = [
  { value: "budget", label: "经济型 ($10-30)" },
  { value: "mid", label: "中端 ($30-60)" },
  { value: "mid-high", label: "中高端 ($60-100)" },
  { value: "high", label: "高端 ($100+)" },
]

type ProjectData = {
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
}

interface ProjectFormProps {
  initialData?: ProjectData & { id?: string }
  projectId?: string
}

export default function ProjectForm({ initialData, projectId }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [productName, setProductName] = useState(initialData?.productName || "")
  const [suggestedData, setSuggestedData] = useState<Record<string, string> | null>(null)
  const isEditing = !!projectId

  async function handleSuggest() {
    if (!productName.trim()) {
      toast.error("请先输入产品名称")
      return
    }

    setSuggesting(true)

    try {
      const res = await fetch("/api/generate/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: productName.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuggestedData(data.suggestions)
      toast.success("AI 建议已生成，点击字段旁的「应用」按钮填充")
    } catch {
      toast.error("获取建议失败，请稍后再试")
    } finally {
      setSuggesting(false)
    }
  }

  function applySuggestion(field: string) {
    if (!suggestedData?.[field]) return
    const textarea = document.querySelector<HTMLTextAreaElement>(
      `textarea[name="${field}"]`
    )
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${field}"]`
    )
    if (textarea) {
      textarea.value = suggestedData[field]
      textarea.dispatchEvent(new Event("input", { bubbles: true }))
    }
    if (input) {
      input.value = suggestedData[field]
      input.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }

  function applyAllSuggestions() {
    if (!suggestedData) return
    for (const field of ["features", "sellingPoints", "keywords", "useScenario", "targetAudience"]) {
      applySuggestion(field)
    }
    toast.success("已应用全部建议")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      productName: form.get("productName"),
      category: form.get("category") || null,
      features: form.get("features") || null,
      sellingPoints: form.get("sellingPoints") || null,
      keywords: form.get("keywords") || null,
      useScenario: form.get("useScenario") || null,
      targetAudience: form.get("targetAudience") || null,
      priceRange: form.get("priceRange") || null,
      brandTone: form.get("brandTone") || null,
      platform: form.get("platform"),
      language: form.get("language"),
    }

    const url = isEditing ? `/api/projects/${projectId}` : "/api/projects"
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      toast.error(result.error || (isEditing ? "更新失败" : "创建失败"))
      setLoading(false)
      return
    }

    toast.success(isEditing ? "项目更新成功！" : "项目创建成功！")
    router.push(`/dashboard/${result.project.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href={isEditing ? `/dashboard/${projectId}` : "/dashboard"}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        {isEditing ? "返回项目" : "返回工作台"}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? "编辑项目" : "新建项目"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEditing
            ? "修改产品信息后保存"
            : "填写产品信息，AI 将为你生成适配的文案和图片"}
        </p>
      </div>

      <form
        key={initialData?.id || "new"}
        onSubmit={handleSubmit}
        className="space-y-10"
      >
        {/* Basic Info */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            基本信息
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">
                产品名称 <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="productName"
                  name="productName"
                  placeholder="例如：无线蓝牙耳机"
                  required
                  defaultValue={initialData?.productName || ""}
                  onChange={(e) => setProductName(e.target.value)}
                  className="flex-1"
                />
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSuggest}
                    disabled={suggesting || !productName.trim()}
                    className="gap-1.5 shrink-0"
                  >
                    {suggesting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Wand2 className="size-4" />
                    )}
                    AI 辅助
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">产品品类</Label>
              <Select
                name="category"
                defaultValue={initialData?.category || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择品类" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            产品详情
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="features">产品特点</Label>
                {suggestedData && (
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => applySuggestion("features")}>
                    <Wand2 className="size-3" /> 应用建议
                  </Button>
                )}
              </div>
              <Textarea
                id="features"
                name="features"
                placeholder="描述产品的核心特点和功能，用逗号或换行分隔"
                rows={3}
                defaultValue={initialData?.features || ""}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sellingPoints">核心卖点</Label>
                {suggestedData && (
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => applySuggestion("sellingPoints")}>
                    <Wand2 className="size-3" /> 应用建议
                  </Button>
                )}
              </div>
              <Textarea
                id="sellingPoints"
                name="sellingPoints"
                placeholder="产品的主要卖点和差异化优势"
                rows={3}
                defaultValue={initialData?.sellingPoints || ""}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="keywords">关键词</Label>
                {suggestedData && (
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => applySuggestion("keywords")}>
                    <Wand2 className="size-3" /> 应用建议
                  </Button>
                )}
              </div>
              <Textarea
                id="keywords"
                name="keywords"
                placeholder="相关搜索关键词，用逗号分隔"
                rows={2}
                defaultValue={initialData?.keywords || ""}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="useScenario">使用场景</Label>
                {suggestedData && (
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => applySuggestion("useScenario")}>
                    <Wand2 className="size-3" /> 应用建议
                  </Button>
                )}
              </div>
              <Textarea
                id="useScenario"
                name="useScenario"
                placeholder="产品的主要使用场景和应用环境"
                rows={2}
                defaultValue={initialData?.useScenario || ""}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="targetAudience">目标人群</Label>
                {suggestedData && (
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => applySuggestion("targetAudience")}>
                    <Wand2 className="size-3" /> 应用建议
                  </Button>
                )}
              </div>
              <Input
                id="targetAudience"
                name="targetAudience"
                placeholder="例如：18-35岁年轻消费者"
                defaultValue={initialData?.targetAudience || ""}
              />
            </div>

            {suggestedData && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={applyAllSuggestions}
                className="gap-1.5"
              >
                <Wand2 className="size-4" />
                应用全部建议
              </Button>
            )}
          </div>
        </section>

        {/* Positioning */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            定位与风格
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priceRange">价格区间</Label>
              <Select
                name="priceRange"
                defaultValue={initialData?.priceRange || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择价格区间" />
                </SelectTrigger>
                <SelectContent>
                  {priceRangeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandTone">品牌调性</Label>
              <Select
                name="brandTone"
                defaultValue={initialData?.brandTone || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择品牌调性" />
                </SelectTrigger>
                <SelectContent>
                  {brandToneOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Platform & Language */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            目标平台与语言
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">
                目标平台 <span className="text-destructive">*</span>
              </Label>
              <Select
                name="platform"
                required
                defaultValue={initialData?.platform || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择平台" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">
                生成语言 <span className="text-destructive">*</span>
              </Label>
              <Select
                name="language"
                required
                defaultValue={initialData?.language || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
          <Button type="submit" size="lg" className="gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading
              ? (isEditing ? "保存中..." : "创建中...")
              : (isEditing ? "保存修改" : "创建项目")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push(isEditing ? `/dashboard/${projectId}` : "/dashboard")}
            disabled={loading}
          >
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}
