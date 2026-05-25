"use client"

import { useState } from "react"
import { Download, FileText, Loader2, FolderPlus, LayoutTemplate } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"
import { platformLabels, downloadTextFile } from "@/types"

type Project = {
  id: string
  productName: string
  platform: string
  updatedAt: string
}

type ExportStats = {
  projectCount: number
  recordCount: number
  imageCount: number
}

export function ExportsClient({
  projects,
  stats,
}: {
  projects: Project[]
  stats: ExportStats
}) {
  const [exporting, setExporting] = useState<string | null>(null)

  async function handleExport(type: string) {
    setExporting(type)

    try {
      if (type === "all-copy") {
        // Export all copy records via API
        const res = await fetch("/api/generate/export?type=copy")
        if (!res.ok) throw new Error()
        const data = await res.json()
        const text = data.records
          .map((r: any) => `【${r.contentType}】\n${r.content}\n---`)
          .join("\n")
        downloadTextFile(text, `全部文案_${new Date().toISOString().slice(0, 10)}.txt`)
        toast.success(`导出 ${data.count} 条文案`)
      } else if (type === "csv") {
        const header = "商品名称,目标平台,最后更新"
        const rows = projects.map((p) =>
          `"${p.productName}","${platformLabels[p.platform] || p.platform}","${new Date(p.updatedAt).toLocaleString("zh-CN")}"`
        )
        const csv = [header, ...rows].join("\n")
        downloadTextFile("﻿" + csv, `项目数据_${new Date().toISOString().slice(0, 10)}.csv`)
        toast.success("CSV 导出成功")
      } else if (type === "txt") {
        const lines = projects.map(
          (p) => `【${platformLabels[p.platform] || p.platform}】${p.productName}`
        )
        const text = `项目列表 (${projects.length} 个)\n${new Date().toLocaleString("zh-CN")}\n${"-".repeat(30)}\n\n${lines.join("\n")}`
        downloadTextFile(text, `项目列表_${new Date().toISOString().slice(0, 10)}.txt`)
        toast.success("文本导出成功")
      } else {
        toast.success("导出功能开发中")
      }
    } catch {
      toast.error("导出失败")
    } finally {
      setExporting(null)
    }
  }

  async function handleExportProject(project: Project) {
    setExporting(`project-${project.id}`)

    try {
      const res = await fetch(`/api/generate/export?type=copy&projectId=${project.id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.count === 0) {
        toast.warning("该项目暂无文案记录可导出")
        return
      }
      const text = `【${project.productName}】\n平台：${platformLabels[project.platform] || project.platform}\n${"=".repeat(30)}\n\n` +
        data.records
          .map((r: any) => `【${r.contentType}】\n${r.content}\n---`)
          .join("\n")
      downloadTextFile(text, `${project.productName}_文案_${new Date().toISOString().slice(0, 10)}.txt`)
      toast.success(`导出 ${data.count} 条文案`)
    } catch {
      toast.error("导出失败")
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Export cards with buttons */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">文案导出</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                导出全部 {stats.recordCount - stats.imageCount} 条文案记录
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleExport("all-copy")}
              disabled={exporting !== null}
              className="gap-1.5 shrink-0"
            >
              {exporting === "all-copy" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              导出 .txt
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">数据表格</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                导出 {stats.projectCount} 个项目结构化数据
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("csv")}
                disabled={exporting !== null}
                className="gap-1.5"
              >
                {exporting === "csv" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <FileText className="size-3.5" />
                )}
                .csv
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("txt")}
                disabled={exporting !== null}
                className="gap-1.5"
              >
                {exporting === "txt" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <FileText className="size-3.5" />
                )}
                .txt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-sm font-semibold mb-3">最近项目</h2>
        {projects.length === 0 ? (
          <EmptyState
            icon={Download}
            title="还没有可导出的项目"
            description="先创建项目并生成文案内容，然后回到这里一键打包导出"
            actions={[
              { label: "创建项目", href: "/dashboard/new", icon: FolderPlus },
              { label: "用模板快速开始", href: "/dashboard/templates", icon: LayoutTemplate, variant: "outline" },
            ]}
            size="sm"
          />
        ) : (
          <div className="space-y-2">
            {projects.map((p) => (
              <Card key={p.id} className="transition-all duration-200 hover:shadow-sm">
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-sm font-medium">{p.productName}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {platformLabels[p.platform] || p.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleExportProject(p)}
                      title="导出该项目文案"
                      disabled={exporting !== null}
                    >
                      {exporting === `project-${p.id}` ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Download className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
