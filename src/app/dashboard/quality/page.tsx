"use client"

import { useState, useEffect } from "react"
import {
  ShieldCheck,
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { platformLabels, contentTypeLabels } from "@/types"
import ListingChecker from "@/components/dashboard/listing-checker"

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

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects")
        const data = await res.json()
        if (res.ok && data.projects) {
          setProjects(data.projects)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">质量检查</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          基于平台规则检测 Listing 内容合规性，发现违禁词、长度问题和关键词覆盖不足
        </p>
      </div>

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
