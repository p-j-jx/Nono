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
  const [prefillLoading, setPrefillLoading] = useState(!!reuseProjectId)
  const [prefillData, setPrefillData] = useState<PrefillData | null>(null)

  useEffect(() => {
    if (!reuseProjectId) return

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
  }, [reuseProjectId, router])

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
