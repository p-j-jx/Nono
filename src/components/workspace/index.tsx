"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  Sparkles,
  Wand2,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { ModeToggle } from "./mode-toggle"
import { FormSection } from "./form-section"
import { SmartAssistant } from "@/components/smart-assistant"
import {
  platformLabels, languageLabels,
  visualStyleLabels, generationIntensityLabels,
  copyStyleLabels, targetCountryOptions,
} from "@/types"

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

const platformOptions = Object.entries(platformLabels).map(([value, label]) => ({ value, label }))
const languageOptions = Object.entries(languageLabels).map(([value, label]) => ({ value, label }))

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

const visualStyleOptions = Object.entries(visualStyleLabels).map(([value, label]) => ({ value, label }))
const generationIntensityOptions = Object.entries(generationIntensityLabels).map(([value, label]) => ({ value, label }))
const copyStyleOptions = Object.entries(copyStyleLabels).map(([value, label]) => ({ value, label }))

type FormData = {
  productName: string
  category: string | null
  brandName: string | null
  material: string | null
  specifications: string | null
  targetCountry: string | null
  features: string | null
  sellingPoints: string | null
  keywords: string | null
  useScenario: string | null
  targetAudience: string | null
  painPoints: string | null
  competitiveAdvantages: string | null
  festivalScenario: string | null
  priceRange: string | null
  brandTone: string | null
  copyStyle: string | null
  bannedWords: string | null
  isPromotional: boolean
  isBrandFocused: boolean
  visualStyle: string
  generationIntensity: string
  platform: string
  language: string
}

type WorkspaceFormProps = {
  initialData?: Partial<FormData> & { id?: string }
  projectId?: string
}

function emptyForm(): FormData {
  return {
    productName: "", category: null, brandName: null, material: null,
    specifications: null, targetCountry: null, features: null, sellingPoints: null,
    keywords: null, useScenario: null, targetAudience: null, painPoints: null,
    competitiveAdvantages: null, festivalScenario: null, priceRange: null,
    brandTone: null, copyStyle: null, bannedWords: null,
    isPromotional: false, isBrandFocused: false,
    visualStyle: "minimal", generationIntensity: "balanced",
    platform: "", language: "",
  }
}

function preparePayload(data: FormData) {
  return {
    productName: data.productName,
    category: data.category || null,
    brandName: data.brandName || null,
    material: data.material || null,
    specifications: data.specifications || null,
    targetCountry: data.targetCountry || null,
    features: data.features || null,
    sellingPoints: data.sellingPoints || null,
    keywords: data.keywords || null,
    useScenario: data.useScenario || null,
    targetAudience: data.targetAudience || null,
    painPoints: data.painPoints || null,
    competitiveAdvantages: data.competitiveAdvantages || null,
    festivalScenario: data.festivalScenario || null,
    priceRange: data.priceRange || null,
    brandTone: data.brandTone || null,
    copyStyle: data.copyStyle || null,
    bannedWords: data.bannedWords || null,
    isPromotional: data.isPromotional,
    isBrandFocused: data.isBrandFocused,
    visualStyle: data.visualStyle,
    generationIntensity: data.generationIntensity,
    platform: data.platform,
    language: data.language,
  }
}

export function WorkspaceForm({ initialData, projectId }: WorkspaceFormProps) {
  const router = useRouter()
  const isEditing = !!projectId

  const [mode, setMode] = useState<"standard" | "advanced" | "batch">("standard")
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestedData, setSuggestedData] = useState<Record<string, string> | null>(null)
  const [showAssistant, setShowAssistant] = useState(true)

  const initData = initialData ? { ...emptyForm(), ...initialData } : emptyForm()
  const [form, setForm] = useState<FormData>(initData)

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

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
      setSuggestedData(data.suggestions)
      toast.success("AI 建议已生成")
    } catch {
      toast.error("获取建议失败")
    } finally {
      setSuggesting(false)
    }
  }

  function applySuggestion(field: string) {
    const val = suggestedData?.[field]
    if (!val) return
    setForm((prev) => ({ ...prev, [field]: val }))
    toast.success(`已应用${field}建议`)
  }

  function applyAllSuggestions() {
    if (!suggestedData) return
    const newForm = { ...form }
    for (const key of ["features", "sellingPoints", "keywords", "useScenario", "targetAudience", "brandName", "painPoints", "competitiveAdvantages", "festivalScenario"]) {
      if (suggestedData[key]) {
        (newForm as Record<string, unknown>)[key] = suggestedData[key]
      }
    }
    setForm(newForm)
    toast.success("已应用全部建议")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = preparePayload(form)
    const url = isEditing ? `/api/projects/${projectId}` : "/api/projects"
    const method = isEditing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      toast.success(isEditing ? "项目更新成功！" : "项目创建成功！")
      router.push(`/dashboard/${result.project.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败")
    } finally {
      setLoading(false)
    }
  }

  const SelectField = ({ name, label, required, options, placeholder }: {
    name: keyof FormData
    label: string
    required?: boolean
    options: { value: string; label: string }[]
    placeholder?: string
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Select
        value={String(form[name] || "")}
        onValueChange={(v) => updateField(name, v as never)}
        required={required}
      >
        <SelectTrigger id={name}>
          <SelectValue placeholder={placeholder || `选择${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  const TextField = ({ name, label, required, placeholder, rows, hint }: {
    name: keyof FormData
    label: string
    required?: boolean
    placeholder?: string
    rows?: number
    hint?: string
  }) => {
    const value = String(form[name] || "")
    const hasSuggest = suggestedData?.[name as string]
    const InputTag = rows ? Textarea : Input
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor={name}>{label}{required && <span className="text-destructive"> *</span>}</Label>
          {hasSuggest && (
            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => applySuggestion(name as string)}>
              <Wand2 className="size-3" /> 应用建议
            </Button>
          )}
        </div>
        <InputTag
          id={name}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField(name, e.target.value as never)}
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    )
  }

  const SwitchField = ({ name, label }: { name: keyof FormData; label: string }) => (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
      <Label htmlFor={name} className="text-sm cursor-pointer">{label}</Label>
      <Switch
        id={name}
        checked={Boolean(form[name])}
        onCheckedChange={(v) => updateField(name, v as never)}
      />
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          href={isEditing ? `/dashboard/${projectId}` : "/dashboard"}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          {isEditing ? "返回项目" : "返回工作台"}
        </Link>
        <ModeToggle value={mode} onChange={setMode} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setShowAssistant(!showAssistant)}
        >
          <Eye className="size-3.5" />
          {showAssistant ? "隐藏助手" : "智能助手"}
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? "编辑项目" : "新建项目"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEditing ? "修改产品信息后保存" : "填写产品信息，AI 将为你生成适配多平台的文案和图片"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* ===== STANDARD MODE ===== */}
          {mode === "standard" && (
            <>
              <FormSection title="基本信息" description="必填信息">
                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <Label htmlFor="productName">产品名称 <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      <Input
                        id="productName"
                        value={form.productName}
                        onChange={(e) => { updateField("productName", e.target.value); if (suggestedData) setSuggestedData(null) }}
                        placeholder="例如：无线蓝牙耳机"
                        required
                        className="flex-1"
                      />
                      {!isEditing && (
                        <Button type="button" variant="outline" size="sm" onClick={handleSuggest} disabled={suggesting || !form.productName.trim()} className="gap-1.5 shrink-0">
                          {suggesting ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                          AI 辅助
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField name="category" label="产品品类" options={categoryOptions} placeholder="选择品类" />
                    <SelectField name="platform" label="目标平台" required options={platformOptions} placeholder="选择平台" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField name="language" label="生成语言" required options={languageOptions} placeholder="选择语言" />
                    <SelectField name="priceRange" label="价格区间" options={priceRangeOptions} placeholder="选择价格区间" />
                  </div>

                  <TextField name="brandName" label="品牌名称" placeholder="例如：Sony、Nike" />
                  <TextField name="targetAudience" label="目标人群" placeholder="例如：18-35岁年轻消费者" />
                </div>
              </FormSection>

              <FormSection title="产品详情" description="填写更多信息以获得更好的生成效果" defaultExpanded={false}>
                <div className="space-y-4 pt-1">
                  {suggestedData && (
                    <Button type="button" variant="secondary" size="sm" onClick={applyAllSuggestions} className="gap-1.5">
                      <Wand2 className="size-4" /> 应用全部建议
                    </Button>
                  )}
                  <TextField name="features" label="产品特点" placeholder="描述产品的核心特点和功能" rows={3} />
                  <TextField name="sellingPoints" label="核心卖点" placeholder="产品的主要卖点和差异化优势" rows={3} />
                  <TextField name="keywords" label="关键词" placeholder="相关搜索关键词，用逗号分隔" rows={2} />
                  <TextField name="useScenario" label="使用场景" placeholder="产品的主要使用场景" rows={2} />
                </div>
              </FormSection>
            </>
          )}

          {/* ===== ADVANCED MODE ===== */}
          {mode === "advanced" && (
            <>
              <FormSection title="商品基础信息" description="产品名称、品类、品牌等基本信息" alwaysExpanded>
                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <Label htmlFor="productName-adv">产品名称 <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      <Input
                        id="productName-adv"
                        value={form.productName}
                        onChange={(e) => { updateField("productName", e.target.value); if (suggestedData) setSuggestedData(null) }}
                        placeholder="例如：无线蓝牙耳机"
                        required
                        className="flex-1"
                      />
                      {!isEditing && (
                        <Button type="button" variant="outline" size="sm" onClick={handleSuggest} disabled={suggesting || !form.productName.trim()} className="gap-1.5 shrink-0">
                          {suggesting ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                          AI 辅助
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField name="category" label="产品品类" options={categoryOptions} placeholder="选择品类" />
                    <TextField name="brandName" label="品牌名称" placeholder="例如：Sony、Nike" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField name="priceRange" label="价格区间" options={priceRangeOptions} placeholder="选择价格区间" />
                    <SelectField name="targetCountry" label="目标国家" options={targetCountryOptions.map((c) => ({ value: c.value, label: c.label }))} placeholder="选择目标国家" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField name="platform" label="目标平台" required options={platformOptions} placeholder="选择平台" />
                    <SelectField name="language" label="生成语言" required options={languageOptions} placeholder="选择语言" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField name="material" label="核心材质" placeholder="例如：不锈钢、纯棉" />
                    <TextField name="specifications" label="规格参数" placeholder="尺寸、重量、型号等" />
                  </div>
                </div>
              </FormSection>

              <FormSection title="用户场景信息" description="使用场景、目标人群、痛点等" defaultExpanded={false}>
                <div className="space-y-4 pt-1">
                  {suggestedData && (
                    <Button type="button" variant="secondary" size="sm" onClick={applyAllSuggestions} className="gap-1.5">
                      <Wand2 className="size-4" /> 应用全部建议
                    </Button>
                  )}
                  <TextField name="features" label="核心特点" placeholder="产品核心特点和功能，逗号或换行分隔" rows={3} />
                  <TextField name="sellingPoints" label="核心卖点" placeholder="产品的主要卖点和差异化优势" rows={3} />
                  <TextField name="useScenario" label="使用场景" placeholder="产品的使用环境和应用场景" rows={2} />
                  <TextField name="targetAudience" label="目标人群" placeholder="例如：18-35岁年轻消费者" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField name="painPoints" label="用户痛点" placeholder="用户使用中的痛点和困扰" rows={2} />
                    <TextField name="competitiveAdvantages" label="竞争优势" placeholder="相比竞品的优势" rows={2} />
                  </div>
                  <TextField name="festivalScenario" label="节日/活动场景" placeholder="适用的节日或促销活动场景" rows={1} />
                  <TextField name="keywords" label="关键词" placeholder="搜索关键词，逗号分隔" rows={2} />
                </div>
              </FormSection>

              <FormSection title="品牌与风格" description="品牌调性、文案风格、禁用词等" defaultExpanded={false}>
                <div className="space-y-4 pt-1">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField name="brandTone" label="品牌调性" options={brandToneOptions} placeholder="选择品牌调性" />
                    <SelectField name="copyStyle" label="文案风格" options={copyStyleOptions} placeholder="选择文案风格" />
                  </div>
                  <TextField name="bannedWords" label="禁用词/敏感词" placeholder="避免使用的词，逗号分隔" hint="例如：最好, 第一, 绝对" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SwitchField name="isPromotional" label="促销活动模式" />
                    <SwitchField name="isBrandFocused" label="品牌感优先" />
                  </div>
                </div>
              </FormSection>

              <FormSection title="生成配置" description="视觉风格、生成质量等" defaultExpanded={false}>
                <div className="grid gap-4 sm:grid-cols-2 pt-1">
                  <SelectField name="visualStyle" label="视觉风格" options={visualStyleOptions} />
                  <SelectField name="generationIntensity" label="生成强度" options={generationIntensityOptions} />
                </div>
              </FormSection>
            </>
          )}

          {/* ===== BATCH MODE (placeholder) ===== */}
          {mode === "batch" && (
            <div className="rounded-xl border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">批量模式即将上线</p>
              <p className="text-xs text-muted-foreground mt-1">支持一次导入多个商品批量生成</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/40">
            <Button type="submit" size="lg" className="gap-2" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {loading ? (isEditing ? "保存中..." : "创建中...") : (isEditing ? "保存修改" : "创建项目")}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.push(isEditing ? `/dashboard/${projectId}` : "/dashboard")} disabled={loading}>
              取消
            </Button>
          </div>
        </div>

        {/* Right: Smart Assistant */}
        {showAssistant && (
          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            <SmartAssistant
              formData={form as unknown as Record<string, unknown>}
              mode={mode}
              productName={form.productName}
              onApplySuggestion={() => {}}
              onRefreshSuggestions={handleSuggest}
              suggesting={suggesting}
              hasSuggestions={!!suggestedData}
            />
          </div>
        )}
      </form>
    </div>
  )
}
