"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, CheckCircle2, Lightbulb, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

type CompletenessResult = {
  score: number
  total: number
  filled: number
  missingCritical: string[]
  missingOptional: string[]
  tips: string[]
}

const CRITICAL_LABELS: Record<string, string> = {
  productName: "产品名称",
  platform: "目标平台",
  language: "生成语言",
}

const FIELD_LABELS: Record<string, string> = {
  category: "产品品类",
  brandName: "品牌名称",
  features: "核心特点",
  sellingPoints: "核心卖点",
  keywords: "关键词",
  useScenario: "使用场景",
  targetAudience: "目标人群",
  priceRange: "价格区间",
  brandTone: "品牌调性",
  material: "材质",
  specifications: "规格参数",
  targetCountry: "目标国家",
  painPoints: "用户痛点",
  competitiveAdvantages: "竞争优势",
  festivalScenario: "节日场景",
  copyStyle: "文案风格",
  bannedWords: "禁用词",
  visualStyle: "视觉风格",
  generationIntensity: "生成强度",
}

const STANDARD_FIELDS = [
  "productName", "category", "features", "sellingPoints", "keywords",
  "useScenario", "targetAudience", "priceRange", "brandTone", "platform", "language",
]

const ADVANCED_FIELDS = [
  "productName", "category", "brandName", "material", "specifications",
  "targetCountry", "features", "sellingPoints", "keywords", "useScenario",
  "targetAudience", "painPoints", "competitiveAdvantages", "festivalScenario",
  "priceRange", "brandTone", "copyStyle", "bannedWords", "platform", "language",
  "visualStyle", "generationIntensity",
]

const CRITICAL = ["productName", "platform", "language"]

function computeScore(data: Record<string, unknown>, mode: string): CompletenessResult {
  const fields = mode === "advanced" ? ADVANCED_FIELDS : STANDARD_FIELDS
  const filled = fields.filter((f) => {
    const val = data[f]
    return val !== undefined && val !== null && val !== "" && val !== false
  })
  const missingCritical = CRITICAL.filter((f) => !filled.includes(f))
  const missingOptional = fields.filter(
    (f) => !filled.includes(f) && !CRITICAL.includes(f)
  )

  const tips: string[] = []
  if (data.priceRange && !data.targetAudience) tips.push("有价格区间但无目标人群，建议补充以提升文案精准度")
  if (data.features && !data.sellingPoints) tips.push("有核心特点但无核心卖点，卖点更能促进转化")
  if (data.useScenario && !data.painPoints && mode === "advanced") tips.push("有使用场景但无用户痛点，痛点营销更有效")
  if (data.productName && !data.brandName && mode === "advanced") tips.push("建议填写品牌名称，有助于品牌化内容生成")
  if (data.platform === "amazon" && !data.keywords) tips.push("Amazon平台关键词对搜索排名很重要")
  if (data.platform === "tiktok" && !data.festivalScenario) tips.push("TikTok营销结合节日活动效果更好")

  return {
    score: Math.round((filled.length / fields.length) * 100),
    total: fields.length,
    filled: filled.length,
    missingCritical,
    missingOptional,
    tips,
  }
}

export function SmartAssistant({
  formData,
  mode,
  productName,
  onApplySuggestion,
  onRefreshSuggestions,
  suggesting,
  hasSuggestions,
}: {
  formData: Record<string, unknown>
  mode: string
  productName: string
  onApplySuggestion?: (field: string, value: string) => void
  onRefreshSuggestions?: () => void
  suggesting?: boolean
  hasSuggestions?: boolean
}) {
  const [score, setScore] = useState<CompletenessResult | null>(null)

  useEffect(() => {
    setScore(computeScore(formData, mode))
  }, [formData, mode])

  if (!score) return null

  const scoreColor =
    score.score >= 80 ? "text-emerald-500" : score.score >= 50 ? "text-amber-500" : "text-red-500"
  const ringColor =
    score.score >= 80 ? "stroke-emerald-500" : score.score >= 50 ? "stroke-amber-500" : "stroke-red-500"

  return (
    <div className="space-y-4">
      {/* Completeness Score */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative size-14 flex items-center justify-center">
            <svg className="size-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" strokeWidth="3"
                strokeDasharray={`${score.score * 0.31} 100`}
                className={ringColor}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute text-sm font-bold ${scoreColor}`}>{score.score}%</span>
          </div>
          <div>
            <p className="text-sm font-medium">信息完整度</p>
            <p className="text-xs text-muted-foreground">
              {score.filled}/{score.total} 项已填
            </p>
          </div>
        </div>

        {score.missingCritical.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-medium text-red-500 mb-1 flex items-center gap-1">
              <AlertTriangle className="size-3" /> 必填项缺失
            </p>
            <div className="flex flex-wrap gap-1">
              {score.missingCritical.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-md bg-red-50 dark:bg-red-950/30 px-2 py-0.5 text-xs text-red-600 dark:text-red-400">
                  {CRITICAL_LABELS[f] || f}
                </span>
              ))}
            </div>
          </div>
        )}

        {score.missingOptional.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-medium text-amber-500 mb-1 flex items-center gap-1">
              <AlertTriangle className="size-3" /> 可选字段未填
            </p>
            <div className="flex flex-wrap gap-1">
              {score.missingOptional.slice(0, 5).map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                  {FIELD_LABELS[f] || f}
                </span>
              ))}
              {score.missingOptional.length > 5 && (
                <span className="text-xs text-muted-foreground">+{score.missingOptional.length - 5} 项</span>
              )}
            </div>
          </div>
        )}

        {score.tips.length > 0 && (
          <div>
            <p className="text-xs font-medium text-blue-500 mb-1 flex items-center gap-1">
              <Lightbulb className="size-3" /> 优化建议
            </p>
            <ul className="space-y-0.5">
              {score.tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-1">
                  <span>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {score.score === 100 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <CheckCircle2 className="size-3" />
            信息完整，可以开始生成了！
          </div>
        )}
      </div>

      {/* AI Suggestions */}
      {productName && (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              AI 智能建议
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={onRefreshSuggestions}
              disabled={suggesting}
            >
              <RefreshCw className={`size-3 ${suggesting ? "animate-spin" : ""}`} />
              {suggesting ? "生成中..." : "刷新"}
            </Button>
          </div>
          {hasSuggestions ? (
            <p className="text-xs text-muted-foreground">AI 已生成建议，点击字段旁的「应用」按钮填充</p>
          ) : (
            <p className="text-xs text-muted-foreground">填写产品名称后，AI 将自动生成字段建议</p>
          )}
        </div>
      )}
    </div>
  )
}
