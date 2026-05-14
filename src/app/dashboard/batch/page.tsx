"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Download, FileSpreadsheet, Loader2, Check, AlertCircle, ArrowRight, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  platformLabels,
  languageLabels,
} from "@/types"

type RowData = {
  productName: string
  platform: string
  language: string
  features: string
  sellingPoints: string
}

type ParseResult = {
  rows: RowData[]
  errors: string[]
}

function generateCsvTemplate(): string {
  const header = "商品名称,目标平台,语言,产品特点,核心卖点"
  const rows = [
    "无线蓝牙耳机,amazon,zh,蓝牙5.3连接/续航30小时/IPX7防水,高性价比/长续航/防水设计",
    "瑜伽运动套装,shopify,en,高弹面料/吸汗速干/四向拉伸,舒适透气/适合多种运动/多色可选",
  ]
  return [header, ...rows].join("\n")
}

function parseCSV(text: string): ParseResult {
  const lines = text.trim().split("\n")
  if (lines.length < 2) {
    return { rows: [], errors: ["CSV 文件至少需要包含表头和一行数据"] }
  }

  const header = lines[0].split(",").map((h) => h.trim())
  const nameIdx = header.findIndex((h) => h.includes("商品名称") || h.includes("name"))
  const platformIdx = header.findIndex((h) => h.includes("平台") || h.includes("platform"))
  const langIdx = header.findIndex((h) => h.includes("语言") || h.includes("language") || h.includes("lang"))
  const featuresIdx = header.findIndex((h) => h.includes("特点") || h.includes("features"))
  const sellingIdx = header.findIndex((h) => h.includes("卖点") || h.includes("selling"))

  if (nameIdx === -1 || platformIdx === -1) {
    return { rows: [], errors: ["CSV 表头必须包含「商品名称」和「目标平台」列"] }
  }

  const rows: RowData[] = []
  const errors: string[] = []
  const validPlatforms = ["amazon", "shopify", "tiktok", "ebay", "etsy", "walmart", "aliexpress"]
  const validLanguages = ["zh", "en", "es", "de", "fr", "ja", "pt", "ar"]

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parsing (handles basic cases)
    const cols = lines[i].split(",").map((c) => c.trim())
    const productName = cols[nameIdx] || ""
    const platform = cols[platformIdx]?.toLowerCase() || ""
    const language = cols[langIdx]?.toLowerCase() || "zh"

    if (!productName) {
      errors.push(`第 ${i + 1} 行：商品名称为空，已跳过`)
      continue
    }
    if (!validPlatforms.includes(platform)) {
      errors.push(`第 ${i + 1} 行：「${platform}」不是有效平台，已跳过`)
      continue
    }
    if (!validLanguages.includes(language)) {
      errors.push(`第 ${i + 1} 行：「${language}」不是有效语言，已使用默认 zh`)
    }

    rows.push({
      productName,
      platform,
      language: validLanguages.includes(language) ? language : "zh",
      features: featuresIdx >= 0 ? (cols[featuresIdx] || "") : "",
      sellingPoints: sellingIdx >= 0 ? (cols[sellingIdx] || "") : "",
    })
  }

  return { rows, errors }
}

export default function BatchPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parsedData, setParsedData] = useState<ParseResult | null>(null)
  const [rawCsv, setRawCsv] = useState("")
  const [importing, setImporting] = useState(false)
  const [importResults, setImportResults] = useState<{
    success: number
    failed: number
    projectIds: string[]
  } | null>(null)
  const [batchGenerating, setBatchGenerating] = useState(false)
  const [batchGenProgress, setBatchGenProgress] = useState<{
    completed: number
    total: number
  } | null>(null)

  function handleDownloadTemplate() {
    const csv = generateCsvTemplate()
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "批量导入模板.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("模板已下载")
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setRawCsv(text)
      const result = parseCSV(text)
      setParsedData(result)
      if (result.errors.length > 0) {
        toast.warning(`解析完成，存在 ${result.errors.length} 个警告`)
      } else if (result.rows.length > 0) {
        toast.success(`成功解析 ${result.rows.length} 条商品数据`)
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be re-uploaded
    e.target.value = ""
  }

  async function handleImport() {
    if (!parsedData || parsedData.rows.length === 0) return

    setImporting(true)
    let success = 0
    let failed = 0
    const projectIds: string[] = []

    for (const row of parsedData.rows) {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: row.productName,
            platform: row.platform,
            language: row.language,
            features: row.features || null,
            sellingPoints: row.sellingPoints || null,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          success++
          projectIds.push(data.project.id)
        } else {
          failed++
        }
      } catch {
        failed++
      }
    }

    setImportResults({ success, failed, projectIds })
    setImporting(false)
    toast.success(`导入完成：成功 ${success}，失败 ${failed}`)
  }

  async function handleBatchGenerate() {
    if (!importResults || importResults.projectIds.length === 0) return

    const basicTypes = ["title", "bulletPoints", "shortDesc"]
    const total = importResults.projectIds.length * basicTypes.length
    setBatchGenerating(true)
    setBatchGenProgress({ completed: 0, total })

    let completed = 0
    let genFailed = 0

    for (const projectId of importResults.projectIds) {
      for (const contentType of basicTypes) {
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, contentType }),
          })
          if (!res.ok) genFailed++
        } catch {
          genFailed++
        }
        completed++
        setBatchGenProgress({ completed, total })
      }
    }

    setBatchGenerating(false)
    setBatchGenProgress(null)

    if (genFailed === 0) {
      toast.success(`已为 ${importResults.projectIds.length} 个项目生成基础文案`)
    } else {
      toast.warning(`生成完成，${genFailed} 项失败`)
    }
  }

  function resetAll() {
    setParsedData(null)
    setRawCsv("")
    setImportResults(null)
    setBatchGenerating(false)
    setBatchGenProgress(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">批量生成</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          批量导入商品信息，一键创建多个项目
        </p>
      </div>

      {!importResults ? (
        <>
          {/* Step 1: Download template + Upload */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <Card className="cursor-pointer hover:bg-muted/20 transition-colors" onClick={handleDownloadTemplate}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <Download className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">下载模板</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">CSV 格式，含示例数据</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted/50">
                  <Upload className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">上传 CSV</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">选择或拖拽 CSV 文件</p>
                </div>
              </CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Card>
          </div>

          {/* Or paste CSV */}
          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold mb-2">或直接粘贴 CSV 数据</h3>
              <textarea
                value={rawCsv}
                onChange={(e) => {
                  setRawCsv(e.target.value)
                  if (e.target.value.trim()) {
                    const result = parseCSV(e.target.value)
                    setParsedData(result)
                  } else {
                    setParsedData(null)
                  }
                }}
                placeholder="商品名称,目标平台,语言,产品特点,核心卖点&#10;无线耳机,amazon,zh,蓝牙5.3,高性价比"
                rows={4}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </CardContent>
          </Card>

          {/* Parsed data preview */}
          {parsedData && parsedData.rows.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">
                    数据预览
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      共 {parsedData.rows.length} 条
                    </span>
                  </h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={resetAll} className="h-8 text-xs">
                      <Trash2 className="size-3" />
                      清空
                    </Button>
                    <Button size="sm" onClick={handleImport} disabled={importing} className="h-8 text-xs gap-1.5">
                      {importing ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Check className="size-3" />
                      )}
                      {importing ? "导入中..." : `导入 ${parsedData.rows.length} 个项目`}
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">商品名称</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">平台</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">语言</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">特点</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.rows.map((row, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="py-2 px-2 text-sm font-medium">{row.productName}</td>
                          <td className="py-2 px-2 text-xs text-muted-foreground">
                            {platformLabels[row.platform] || row.platform}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground">
                            {languageLabels[row.language] || row.language}
                          </td>
                          <td className="py-2 px-2 text-xs text-muted-foreground hidden sm:table-cell truncate max-w-[200px]">
                            {row.features || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {parsedData.errors.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                      <AlertCircle className="size-3" />
                      {parsedData.errors.length} 个警告
                    </div>
                    <ul className="space-y-0.5">
                      {parsedData.errors.slice(0, 5).map((err, i) => (
                        <li key={i} className="text-[11px] text-muted-foreground">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {parsedData && parsedData.rows.length === 0 && parsedData.errors.length > 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center py-10">
                <AlertCircle className="size-8 text-destructive/40 mb-3" />
                <p className="text-sm font-medium mb-1">数据解析失败</p>
                <p className="text-xs text-muted-foreground mb-3">{parsedData.errors[0]}</p>
                <Button variant="outline" size="sm" onClick={resetAll}>
                  重新上传
                </Button>
              </CardContent>
            </Card>
          )}

          {!parsedData && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center py-12">
                <FileSpreadsheet className="size-10 text-muted-foreground/30 mb-3" />
                <h3 className="text-sm font-semibold mb-1">等待数据导入</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  下载模板填写商品数据，上传 CSV 文件或直接粘贴内容
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Import results */
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center py-12">
            {importResults.failed === 0 ? (
              <div className="size-14 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                <Check className="size-7 text-primary" />
              </div>
            ) : (
              <div className="size-14 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
                <AlertCircle className="size-7 text-muted-foreground" />
              </div>
            )}
            <h3 className="text-base font-semibold mb-1">导入完成</h3>
            <p className="text-sm text-muted-foreground mb-5">
              成功 {importResults.success} 个，失败 {importResults.failed} 个
            </p>

            {/* Batch generate progress */}
            {batchGenProgress && (
              <div className="w-full max-w-xs mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    正在生成文案... {batchGenProgress.completed}/{batchGenProgress.total}
                  </span>
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${(batchGenProgress.completed / batchGenProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-wrap justify-center">
              {importResults.success > 0 && !batchGenerating && (
                <Button
                  variant="default"
                  onClick={handleBatchGenerate}
                  className="gap-2 shadow-lg shadow-primary/20"
                >
                  <Loader2 className="size-4" />
                  为全部项目生成基础文案
                </Button>
              )}
              <Button
                variant="outline"
                onClick={resetAll}
                className="gap-2"
                disabled={batchGenerating}
              >
                继续导入
              </Button>
              <Button
                className="gap-2"
                variant="outline"
                onClick={() => router.push("/dashboard/projects")}
                disabled={batchGenerating}
              >
                查看项目 <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
