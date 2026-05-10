"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import ProjectForm from "@/components/project-form"

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
}

const TEMPLATE_PRESETS: Record<string, Partial<PrefillData>> = {
  "amazon": {
    platform: "amazon",
    language: "zh",
    targetAudience: "Amazon 全球买家",
    brandTone: "professional",
  },
  "shopify": {
    platform: "shopify",
    language: "en",
    targetAudience: "欧美独立站消费者",
    brandTone: "fashionable",
  },
  "tiktok": {
    platform: "tiktok",
    language: "en",
    targetAudience: "TikTok 年轻用户",
    brandTone: "fashionable",
  },
  "electronics": {
    category: "electronics",
    platform: "amazon",
    brandTone: "professional",
    targetAudience: "18-40岁科技爱好者",
    language: "zh",
  },
  "clothing": {
    category: "clothing",
    platform: "shopify",
    brandTone: "fashionable",
    targetAudience: "20-35岁追求时尚的年轻消费者",
    language: "en",
  },
  "beauty": {
    category: "beauty",
    platform: "shopify",
    brandTone: "friendly",
    targetAudience: "18-45岁注重护肤的女性消费者",
    language: "en",
  },
  "home": {
    category: "home",
    platform: "amazon",
    brandTone: "friendly",
    targetAudience: "25-50岁注重生活品质的家庭用户",
    language: "zh",
  },
  "sports": {
    category: "sports",
    platform: "amazon",
    brandTone: "professional",
    targetAudience: "18-40岁热爱运动的消费者",
    language: "zh",
  },
  "tiktok-fashion": {
    category: "clothing",
    platform: "tiktok",
    brandTone: "fashionable",
    targetAudience: "16-30岁TikTok活跃用户",
    language: "en",
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
    } else if (templateId && TEMPLATE_PRESETS[templateId]) {
      setPrefillData(TEMPLATE_PRESETS[templateId] as PrefillData)
    }
  }, [reuseProjectId, templateId, router])

  if (prefillLoading) return <LoadingSkeleton />

  return <ProjectForm initialData={prefillData || undefined} />
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <NewProjectContent />
    </Suspense>
  )
}
