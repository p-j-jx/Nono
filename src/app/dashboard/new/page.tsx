"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import ProjectForm from "@/components/project-form"
import { TemplateWizard } from "@/components/workspace/template-wizard"

type PrefillData = {
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
  // Advanced fields
  brandName: string | null
  material: string | null
  specifications: string | null
  targetCountry: string | null
  painPoints: string | null
  competitiveAdvantages: string | null
  festivalScenario: string | null
  copyStyle: string | null
  bannedWords: string | null
  isPromotional: boolean
  isBrandFocused: boolean
  visualStyle: string
  generationIntensity: string
}

// Templates that should use the wizard flow (platform + industry)
const WIZARD_PRESETS: Record<string, Record<string, unknown>> = {
  // ===== Platform Templates =====
  amazon: {
    platform: "amazon",
    language: "en",
    targetAudience: "Amazon 全球买家",
    brandTone: "professional",
    copyStyle: "technical",
    visualStyle: "minimal",
    targetCountry: "US",
  },
  shopify: {
    platform: "shopify",
    language: "en",
    targetAudience: "欧美独立站消费者",
    brandTone: "fashionable",
    copyStyle: "emotional",
    visualStyle: "brand",
    isBrandFocused: true,
  },
  tiktok: {
    platform: "tiktok",
    language: "en",
    targetAudience: "TikTok 年轻用户 (16-30岁)",
    brandTone: "fashionable",
    copyStyle: "casual",
    visualStyle: "promotional",
  },
  // ===== Industry Templates =====
  electronics: {
    category: "electronics",
    platform: "amazon",
    brandTone: "professional",
    copyStyle: "technical",
    visualStyle: "tech",
    targetAudience: "18-40岁科技爱好者、数码发烧友",
    language: "en",
    targetCountry: "US",
    features: "高性能处理器、超长续航、快速充电、蓝牙5.3连接",
    sellingPoints: "性能跑分超越同价位竞品、通过国际认证、2年质保",
    keywords: "wireless, bluetooth, fast charging, high performance",
    useScenario: "通勤降噪、游戏电竞、远程办公、户外运动",
  },
  clothing: {
    category: "clothing",
    platform: "shopify",
    brandTone: "fashionable",
    copyStyle: "emotional",
    visualStyle: "lifestyle",
    targetAudience: "20-35岁追求时尚的年轻消费者",
    language: "en",
    isBrandFocused: true,
    features: "优质面料、时尚版型、四季穿搭、机洗不变形",
    sellingPoints: "时尚博主推荐、百搭款式、舒适亲肤面料",
    keywords: "fashion, trendy, casual wear, streetwear, outfit",
    useScenario: "通勤职场、约会穿搭、休闲出街、旅行度假",
  },
  beauty: {
    category: "beauty",
    platform: "shopify",
    brandTone: "friendly",
    copyStyle: "emotional",
    visualStyle: "brand",
    targetAudience: "18-45岁注重护肤的女性消费者",
    language: "en",
    isBrandFocused: true,
    features: "天然植物成分、无添加配方、通过皮肤科测试",
    sellingPoints: "28天使用效果可见、敏感肌适用、成分安全透明",
    keywords: "skincare, organic, anti-aging, cruelty-free, natural",
    useScenario: "日常护肤、换季修复、约会妆前打底、送礼佳选",
  },
  home: {
    category: "home",
    platform: "amazon",
    brandTone: "friendly",
    copyStyle: "casual",
    visualStyle: "lifestyle",
    targetAudience: "25-50岁注重生活品质的家庭用户",
    language: "en",
    targetCountry: "US",
    features: "实木材质、静音设计、快速安装、多功能收纳",
    sellingPoints: "北欧简约设计、小户型空间神器、一物多用",
    keywords: "home decor, organizer, minimalist, space-saving, kitchen",
    useScenario: "客厅布置、厨房收纳、卧室装饰、办公桌面整理",
  },
  sports: {
    category: "sports",
    platform: "amazon",
    brandTone: "professional",
    copyStyle: "casual",
    visualStyle: "lifestyle",
    targetAudience: "18-40岁热爱运动的消费者",
    language: "en",
    targetCountry: "US",
    features: "速干面料、人体工学设计、防滑耐磨、轻量化设计",
    sellingPoints: "专业运动员推荐、透气排汗、运动无束缚感",
    keywords: "sports, workout, running, gym, outdoor, fitness",
    useScenario: "健身房训练、户外跑步、登山徒步、球类运动",
  },
  "tiktok-fashion": {
    category: "clothing",
    platform: "tiktok",
    brandTone: "fashionable",
    copyStyle: "casual",
    visualStyle: "promotional",
    targetAudience: "16-30岁TikTok活跃用户",
    language: "en",
    features: "颜值超高、百搭时尚、平价潮流、明星同款",
    sellingPoints: "TikTok爆款、穿搭博主推荐、一衣多穿",
    keywords: "viral fashion, trending outfit, aesthetic, OOTD",
    useScenario: "穿搭打卡、日常出街、拍照上镜",
  },
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-4 bg-muted rounded w-96" />
        <div className="h-96 bg-muted rounded" />
      </div>
    </div>
  )
}

function NewProjectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reuseProjectId = searchParams.get("reuseProjectId")
  const templateId = searchParams.get("template")
  const [prefillLoading, setPrefillLoading] = useState(!!reuseProjectId)
  const [prefillData, setPrefillData] = useState<PrefillData | null>(null)

  useEffect(() => {
    if (reuseProjectId) {
      fetch(`/api/projects/${reuseProjectId}`)
        .then((res) => {
          if (!res.ok) throw new Error("项目不存在")
          return res.json()
        })
        .then((data) => {
          setPrefillData(data.project)
          setPrefillLoading(false)
        })
        .catch(() => {
          toast.error("项目不存在或已删除")
          router.replace("/dashboard/new")
        })
    }
  }, [reuseProjectId, router])

  if (prefillLoading) return <LoadingSkeleton />

  // If template is a wizard preset → show the step-by-step wizard
  if (templateId && WIZARD_PRESETS[templateId]) {
    return (
      <TemplateWizard
        templateId={templateId}
        preset={WIZARD_PRESETS[templateId]}
      />
    )
  }

  // Otherwise → generic form (for reuseProject or blank new project)
  return <ProjectForm initialData={prefillData || undefined} />
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <NewProjectContent />
    </Suspense>
  )
}
