"use client"

import { useState } from "react"
import { Download, FileText, ImageIcon, FileSpreadsheet, Archive, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { downloadTextFile } from "@/types"

type Project = {
  id: string
  productName: string
  platform: string
  updatedAt: string
}

export function ExportCards({
  copyCount,
  imageCount,
  projectCount,
  recordCount,
  projects,
}: {
  copyCount: number
  imageCount: number
  projectCount: number
  recordCount: number
  projects: Project[]
}) {
  const [exporting, setExporting] = useState<string | null>(null)

  async function handleExport(type: string) {
    setExporting(type)

    try {
      if (type === "copy") {
        const res = await fetch("/api/generate/export?type=copy")
        if (!res.ok) throw new Error()
        const data = await res.json()
        const text = data.records
          .map((r: any) => `【${r.contentType}】\n${r.content}\n---`)
          .join("\n")
        downloadTextFile(text, `全部文案_${new Date().toISOString().slice(0, 10)}.txt`)
        toast.success(`导出 ${data.count} 条文案`)
      } else if (type === "csv") {
        const platformLabels: Record<string, string> = {
          amazon: "Amazon", shopify: "Shopify", tiktok: "TikTok Shop",
          ebay: "eBay", etsy: "Etsy", walmart: "Walmart", aliexpress: "AliExpress",
        }
        const header = "商品名称,目标平台,最后更新"
        const rows = projects.map((p) =>
          `"${p.productName}","${platformLabels[p.platform] || p.platform}","${new Date(p.updatedAt).toLocaleString("zh-CN")}"`
        )
        const csv = [header, ...rows].join("\n")
        downloadTextFile("﻿" + csv, `项目数据_${new Date().toISOString().slice(0, 10)}.csv`)
        toast.success("CSV 导出成功")
      } else if (type === "txt") {
        const platformLabels: Record<string, string> = {
          amazon: "Amazon", shopify: "Shopify", tiktok: "TikTok Shop",
        }
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

  const cards = [
    {
      key: "copy",
      icon: FileText,
      title: "文案导出",
      desc: `导出全部 ${copyCount} 条文案记录为文本格式`,
      formats: [".txt", ".csv"],
      gradient: "from-primary to-violet-500",
      iconBg: "from-primary/10 to-violet-500/10",
      iconColor: "text-primary",
      exportKeys: ["copy"] as const,
    },
    {
      key: "images",
      icon: ImageIcon,
      title: "图片导出",
      desc: `打包下载 ${imageCount} 张生成图片`,
      formats: [".zip"],
      gradient: "from-sky-500 to-blue-500",
      iconBg: "from-sky-500/10 to-blue-500/10",
      iconColor: "text-sky-600 dark:text-sky-400",
      exportKeys: [] as const,
    },
    {
      key: "spreadsheet",
      icon: FileSpreadsheet,
      title: "数据表格",
      desc: `导出 ${projectCount} 个项目的结构化数据`,
      formats: [".csv"],
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      exportKeys: ["csv", "txt"] as const,
    },
    {
      key: "full",
      icon: Archive,
      title: "全部打包",
      desc: "文案 + 图片 + 数据一体化完整导出",
      formats: [".zip"],
      gradient: "from-amber-500 to-orange-500",
      iconBg: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      exportKeys: [] as const,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 mb-8">
      {cards.map((card) => {
        const Icon = card.icon
        const isDisabled = card.exportKeys.length === 0
        return (
          <Card
            key={card.key}
            className={isDisabled ? "opacity-70" : ""}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${card.iconColor} bg-muted/50`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{card.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {card.formats.map((f) => (
                    <span key={f} className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {card.exportKeys.map((ek) => (
                    <Button
                      key={ek}
                      size="sm"
                      onClick={() => handleExport(ek)}
                      disabled={exporting !== null}
                      className="gap-1.5 h-8 text-xs"
                    >
                      {exporting === ek ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Download className="size-3.5" />
                      )}
                      导出
                    </Button>
                  ))}
                  {isDisabled && (
                    <span className="text-xs text-muted-foreground">即将推出</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
