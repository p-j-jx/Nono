"use client"

import { useState, useCallback } from "react"
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
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wand2,
  Check,
  FileText,
  ListOrdered,
  AlignLeft,
  BookOpen,
  Megaphone,
  Search,
  ImageIcon,
  ImagePlus,
  PanelTop,
  Share2,
  ImageDown,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  platformFormConfig,
  industryFormConfig,
  platformContentTypes,
  generationTypeConfig,
  languageLabels,
  platformLabels,
} from "@/types"

// ---- Icon map ----
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, ListOrdered, AlignLeft, BookOpen,
  Megaphone, Search, ImageIcon, ImagePlus,
  PanelTop, Share2, ImageDown,
}

// ---- Content type extra hints per-platform ----
const contentTypeHints: Record<string, Record<string, string>> = {
  amazon: {
    title: "80-200 字符，品牌+核心词+规格+卖点",
    bulletPoints: "每点≤500字符，大写开头，数据支撑",
    longDesc: "≤2000字符，支持HTML标签排版",
    seoKeywords: "Backend Keywords ≤250字节，不重复标题",
  },
  shopify: {
    brandStory: "讲述品牌理念，拉近与消费者的距离",
    longDesc: "品牌调性优先，配合高质量图片展示",
    socialMediaImage: "适合 Instagram / Pinterest 分享",
  },
  tiktok: {
    adCopy: "3秒抓眼球，简短有力，适合短视频口播",
    shortDesc: "一句话种草，突出视觉冲击",
    socialMediaImage: "竖版构图，适配 TikTok 信息流",
    promoPoster: "强促销感，大字报风格",
  },
}

// ---- Language options ----
const languageOptions = Object.entries(languageLabels).map(([value, label]) => ({ value, label }))

// ---- Category options ----
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

// ---- Theme colors ----
const platformTheme: Record<string, {
  accent: string
  accentBg: string
  gradientFrom: string
  gradientTo: string
  ring: string
  badge: string
}> = {
  amazon: {
    accent: "text-amber-600 dark:text-amber-400",
    accentBg: "bg-amber-500",
    gradientFrom: "from-amber-500/15",
    gradientTo: "to-orange-500/5",
    ring: "ring-amber-500/40",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  shopify: {
    accent: "text-emerald-600 dark:text-emerald-400",
    accentBg: "bg-emerald-500",
    gradientFrom: "from-emerald-500/15",
    gradientTo: "to-green-500/5",
    ring: "ring-emerald-500/40",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  tiktok: {
    accent: "text-cyan-600 dark:text-cyan-400",
    accentBg: "bg-cyan-500",
    gradientFrom: "from-cyan-500/15",
    gradientTo: "to-teal-500/5",
    ring: "ring-cyan-500/40",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
}

const defaultTheme = {
  accent: "text-primary",
  accentBg: "bg-primary",
  gradientFrom: "from-primary/15",
  gradientTo: "to-primary/5",
  ring: "ring-primary/40",
  badge: "bg-primary/10 text-primary",
}

// ---- Props ----
type TemplateWizardProps = {
  templateId: string
  preset: Record<string, unknown>
}

export function TemplateWizard({ templateId, preset }: TemplateWizardProps) {
  const router = useRouter()
  const platform = (preset.platform as string) || ""
  const category = (preset.category as string) || ""
  const pConfig = platformFormConfig[platform]
  const iConfig = industryFormConfig[category]
  const theme = platformTheme[platform] || defaultTheme

  // Steps: 1 = pick content types, 2 = fill product info, 3 = creating
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)

  // Content type selection — default to all platform types
  const availableTypes = platformContentTypes[platform] || generationTypeConfig.map((c) => c.key)
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(availableTypes))

  // Form data
  const [form, setForm] = useState({
    productName: "",
    category: category || "",
    brandName: "",
    language: (preset.language as string) || "en",
    targetAudience: (preset.targetAudience as string) || "",
    features: (preset.features as string) || "",
    sellingPoints: (preset.sellingPoints as string) || "",
    keywords: (preset.keywords as string) || "",
    useScenario: (preset.useScenario as string) || "",
    priceRange: "",
    brandTone: (preset.brandTone as string) || "",
  })

  const updateField = useCallback((key: string, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value || "" }))
  }, [])

  function toggleType(key: string) {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function selectAllTypes() {
    setSelectedTypes(new Set(availableTypes))
  }

  function clearAllTypes() {
    setSelectedTypes(new Set())
  }

  async function handleSuggest() {
    if (!form.productName.trim()) {
      toast.error("请先输入产品名称")
      return
    }
    setSuggesting(true)
    try {
      const res = await fetch("/api/generate/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: form.productName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Apply suggestions to form
      const s = data.suggestions as Record<string, string>
      setForm((prev) => ({
        ...prev,
        features: s.features || prev.features,
        sellingPoints: s.sellingPoints || prev.sellingPoints,
        keywords: s.keywords || prev.keywords,
        useScenario: s.useScenario || prev.useScenario,
        targetAudience: s.targetAudience || prev.targetAudience,
        brandName: s.brandName || prev.brandName,
      }))
      toast.success("AI 建议已填入")
    } catch {
      toast.error("获取建议失败")
    } finally {
      setSuggesting(false)
    }
  }

  async function handleCreate() {
    if (!form.productName.trim()) {
      toast.error("请输入产品名称")
      return
    }
    if (selectedTypes.size === 0) {
      toast.error("请至少选择一种内容类型")
      return
    }

    setLoading(true)
    try {
      // 1. Create project
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.productName.trim(),
          category: form.category || null,
          brandName: form.brandName || null,
          features: form.features || null,
          sellingPoints: form.sellingPoints || null,
          keywords: form.keywords || null,
          useScenario: form.useScenario || null,
          targetAudience: form.targetAudience || null,
          priceRange: form.priceRange || null,
          brandTone: form.brandTone || null,
          platform,
          language: form.language,
          // Pass through other preset values
          copyStyle: (preset.copyStyle as string) || null,
          visualStyle: (preset.visualStyle as string) || "minimal",
          generationIntensity: "balanced",
          isBrandFocused: !!preset.isBrandFocused,
          isPromotional: !!preset.isPromotional,
          material: null,
          specifications: null,
          targetCountry: (preset.targetCountry as string) || null,
          painPoints: null,
          competitiveAdvantages: null,
          festivalScenario: null,
          bannedWords: null,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      const projectId = result.project.id
      toast.success("项目创建成功，开始生成内容...")

      // 2. Auto-generate selected content types (fire and forget, navigate immediately)
      const typesArray = Array.from(selectedTypes)
      // Start generating in background
      generateInBackground(projectId, typesArray)

      // 3. Navigate to project detail
      router.push(`/dashboard/${projectId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "创建失败")
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/dashboard/templates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        返回模板中心
      </Link>

      {/* Platform Header */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 mb-8 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} to-background`}>
        <div aria-hidden className="absolute -top-20 -right-20 size-64 rounded-full bg-gradient-to-br from-current opacity-[0.07] blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.badge}`}>
              {pConfig?.label || platformLabels[platform] || platform}
            </span>
            {iConfig && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                {iConfig.icon} {iConfig.label}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {iConfig
              ? `${iConfig.label} · ${pConfig?.label || platform} 模板`
              : `${pConfig?.label || platform} 专属模板`}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {iConfig?.description || pConfig?.description || "为你的产品生成专业的文案和图片"}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <nav aria-label={`步骤 ${step} / 3`} className="flex items-center gap-3 mb-8">
        {[
          { n: 1, label: "选择内容" },
          { n: 2, label: "产品信息" },
          { n: 3, label: "创建生成" },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2" aria-current={step === n ? "step" : undefined}>
            <div
              className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                step >= n
                  ? `${theme.accentBg} text-white`
                  : "bg-muted text-muted-foreground"
              }`}
              aria-hidden="true"
            >
              {step > n ? <Check className="size-4" /> : n}
            </div>
            <span className={`text-sm font-medium ${step >= n ? "" : "text-muted-foreground"}`}>
              {label}
            </span>
            {n < 3 && <div className={`w-8 h-px ${step > n ? theme.accentBg : "bg-border"}`} aria-hidden="true" />}
          </div>
        ))}
      </nav>

      {/* ===== STEP 1: Content Type Selection ===== */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">选择要生成的内容类型</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                已为 {pConfig?.label || platform} 平台推荐最适合的内容类型，你也可以自由调整
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={selectAllTypes}>全选</Button>
              <Button type="button" variant="ghost" size="sm" onClick={clearAllTypes}>清空</Button>
            </div>
          </div>

          {/* Copy types */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">文案内容</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {generationTypeConfig
                .filter((c) => availableTypes.includes(c.key) && !["mainImage", "sceneImage", "banner", "socialMediaImage", "promoPoster"].includes(c.key))
                .map((cfg) => {
                  const Icon = iconMap[cfg.iconName] || FileText
                  const selected = selectedTypes.has(cfg.key)
                  const hint = contentTypeHints[platform]?.[cfg.key]
                  return (
                    <button
                      key={cfg.key}
                      type="button"
                      onClick={() => toggleType(cfg.key)}
                      className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                        selected
                          ? `${cfg.borderColor} bg-gradient-to-br ${cfg.gradient} ring-2 ${theme.ring}`
                          : "border-border/50 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      {/* Check indicator */}
                      <div className={`absolute top-3 right-3 flex size-5 items-center justify-center rounded-full transition-colors ${
                        selected ? `${theme.accentBg} text-white` : "border-2 border-muted-foreground/30"
                      }`}>
                        {selected && <Check className="size-3" />}
                      </div>

                      <div className={`flex size-9 items-center justify-center rounded-lg bg-background/80 ring-1 ring-border/50 mb-2.5 ${cfg.iconColor}`}>
                        <Icon className="size-4.5" />
                      </div>
                      <h4 className="font-semibold text-sm mb-0.5">{cfg.label}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{cfg.desc}</p>
                      {hint && (
                        <p className={`text-[11px] mt-1.5 ${theme.accent} opacity-80`}>
                          {hint}
                        </p>
                      )}
                    </button>
                  )
                })}
            </div>
          </div>

          {/* Image types */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">图片内容</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {generationTypeConfig
                .filter((c) => availableTypes.includes(c.key) && ["mainImage", "sceneImage", "banner", "socialMediaImage", "promoPoster"].includes(c.key))
                .map((cfg) => {
                  const Icon = iconMap[cfg.iconName] || FileText
                  const selected = selectedTypes.has(cfg.key)
                  const hint = contentTypeHints[platform]?.[cfg.key]
                  return (
                    <button
                      key={cfg.key}
                      type="button"
                      onClick={() => toggleType(cfg.key)}
                      className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                        selected
                          ? `${cfg.borderColor} bg-gradient-to-br ${cfg.gradient} ring-2 ${theme.ring}`
                          : "border-border/50 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className={`absolute top-3 right-3 flex size-5 items-center justify-center rounded-full transition-colors ${
                        selected ? `${theme.accentBg} text-white` : "border-2 border-muted-foreground/30"
                      }`}>
                        {selected && <Check className="size-3" />}
                      </div>

                      <div className={`flex size-9 items-center justify-center rounded-lg bg-background/80 ring-1 ring-border/50 mb-2.5 ${cfg.iconColor}`}>
                        <Icon className="size-4.5" />
                      </div>
                      <h4 className="font-semibold text-sm mb-0.5">{cfg.label}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{cfg.desc}</p>
                      {hint && (
                        <p className={`text-[11px] mt-1.5 ${theme.accent} opacity-80`}>
                          {hint}
                        </p>
                      )}
                    </button>
                  )
                })}
            </div>
          </div>

          {/* Platform tips */}
          {pConfig?.tips && (
            <div className={`rounded-xl border p-4 bg-gradient-to-r ${theme.gradientFrom} to-transparent`}>
              <h3 className={`text-sm font-semibold mb-2 ${theme.accent}`}>
                {pConfig.label} 平台小贴士
              </h3>
              <ul className="space-y-1.5">
                {pConfig.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-0.5">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <span className="text-sm text-muted-foreground">
              已选择 <strong className={theme.accent}>{selectedTypes.size}</strong> / {availableTypes.length} 种内容
            </span>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => {
                if (selectedTypes.size === 0) {
                  toast.error("请至少选择一种内容类型")
                  return
                }
                setStep(2)
              }}
            >
              下一步：填写产品信息
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== STEP 2: Product Info ===== */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">填写产品信息</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              信息越详细，AI 生成的内容质量越高
            </p>
          </div>

          {/* Product name + AI assist */}
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">
                产品名称 <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="productName"
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  placeholder="例如：无线蓝牙降噪耳机"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSuggest}
                  disabled={suggesting || !form.productName.trim()}
                  className="gap-1.5 shrink-0"
                >
                  {suggesting ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                  AI 补全
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">输入产品名后点击「AI 补全」可自动填充下方字段</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">产品品类</Label>
                <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="选择品类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">生成语言</Label>
                <Select value={form.language} onValueChange={(v) => updateField("language", v)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brandName">品牌名称</Label>
                <Input
                  id="brandName"
                  value={form.brandName}
                  onChange={(e) => updateField("brandName", e.target.value)}
                  placeholder="例如：Sony、Nike"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceRange">价格区间</Label>
                <Select value={form.priceRange} onValueChange={(v) => updateField("priceRange", v)}>
                  <SelectTrigger id="priceRange">
                    <SelectValue placeholder="选择价格区间" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRangeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandTone">品牌调性</Label>
              <Select value={form.brandTone} onValueChange={(v) => updateField("brandTone", v)}>
                <SelectTrigger id="brandTone">
                  <SelectValue placeholder="选择品牌调性" />
                </SelectTrigger>
                <SelectContent>
                  {brandToneOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product details */}
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">产品详情 <span className="text-xs font-normal text-muted-foreground ml-1">选填，但填写越详细效果越好</span></h3>

            <div className="space-y-1.5">
              <Label htmlFor="features">核心特点</Label>
              <Textarea
                id="features"
                value={form.features}
                onChange={(e) => updateField("features", e.target.value)}
                placeholder={iConfig?.featurePlaceholder || pConfig?.featurePlaceholder || "描述产品的核心特点和功能"}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sellingPoints">核心卖点</Label>
              <Textarea
                id="sellingPoints"
                value={form.sellingPoints}
                onChange={(e) => updateField("sellingPoints", e.target.value)}
                placeholder={iConfig?.sellingPointPlaceholder || pConfig?.sellingPointPlaceholder || "产品的主要卖点和差异化优势"}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="keywords">关键词</Label>
              <Textarea
                id="keywords"
                value={form.keywords}
                onChange={(e) => updateField("keywords", e.target.value)}
                placeholder={iConfig?.keywordPlaceholder || pConfig?.keywordPlaceholder || "搜索关键词，逗号分隔"}
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="useScenario">使用场景</Label>
                <Textarea
                  id="useScenario"
                  value={form.useScenario}
                  onChange={(e) => updateField("useScenario", e.target.value)}
                  placeholder={iConfig?.scenarioPlaceholder || "产品的主要使用场景"}
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="targetAudience">目标人群</Label>
                <Textarea
                  id="targetAudience"
                  value={form.targetAudience}
                  onChange={(e) => updateField("targetAudience", e.target.value)}
                  placeholder={iConfig?.audiencePlaceholder || "例如：18-35岁年轻消费者"}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Summary of selected types */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-medium mb-2">将要生成的内容</h3>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(selectedTypes).map((key) => {
                const cfg = generationTypeConfig.find((c) => c.key === key)
                return (
                  <span key={key} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${theme.badge}`}>
                    {cfg?.label || key}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <Button variant="outline" size="lg" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="size-4" />
              上一步
            </Button>
            <Button
              size="lg"
              className="gap-2"
              onClick={handleCreate}
              disabled={loading || !form.productName.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  创建项目并生成 {selectedTypes.size} 项内容
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---- Background generation helper ----
async function generateInBackground(projectId: string, contentTypes: string[]) {
  for (const type of contentTypes) {
    try {
      await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, contentType: type }),
      })
    } catch {
      // Silently continue, user can retry on the detail page
    }
  }
}
