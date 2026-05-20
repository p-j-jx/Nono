"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Calculator,
  Loader2,
  Globe,
  Ship,
  Plane,
  Train,
  Package,
  Scale,
  Euro,
  FileText,
  AlertTriangle,
  History,
  Clock,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type AnalysisHistoryItem = {
  id: string
  projectName: string | null
  summary: string | null
  inputData: string
  resultData: string
  createdAt: string
}

type CalcResult = {
  calculation: Record<string, unknown>
  report: string
}

const COUNTRIES = ["德国", "法国", "意大利", "西班牙", "荷兰", "比利时", "波兰", "英国"]
const SHIPPING_MODES = [
  { value: "air", label: "空运", icon: Plane },
  { value: "sea", label: "海运", icon: Ship },
  { value: "rail", label: "铁路", icon: Train },
]

export default function TaxPage() {
  const [productName, setProductName] = useState("")
  const [hsCode, setHsCode] = useState("")
  const [destinationCountry, setDestinationCountry] = useState("德国")
  const [shippingMode, setShippingMode] = useState("air")
  const [unitPrice, setUnitPrice] = useState("")
  const [weight, setWeight] = useState("")
  const [quantity, setQuantity] = useState("100")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CalcResult | null>(null)
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/analysis?type=tax&limit=20")
      const data = await res.json()
      if (res.ok && data.records) {
        setHistory(data.records)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  function loadHistoryRecord(item: AnalysisHistoryItem) {
    try {
      const input = JSON.parse(item.inputData) as {
        productName: string
        hsCode?: string
        destinationCountry: string
        shippingMode: string
        unitPrice: string | number
        weight: string | number
        quantity: string | number
      }
      const data = JSON.parse(item.resultData) as CalcResult

      setProductName(input.productName || "")
      setHsCode(input.hsCode || "")
      setDestinationCountry(input.destinationCountry || "德国")
      setShippingMode(input.shippingMode || "air")
      setUnitPrice(String(input.unitPrice || ""))
      setWeight(String(input.weight || ""))
      setQuantity(String(input.quantity || "100"))
      setResult(data)
      setShowHistory(false)
      toast.success("已加载历史记录")
    } catch {
      toast.error("加载历史记录失败")
    }
  }

  async function deleteHistoryRecord(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/analysis/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setHistory((prev) => prev.filter((h) => h.id !== id))
      toast.success("已删除")
    } catch {
      toast.error("删除失败")
    }
  }

  async function handleCalculate() {
    if (!productName.trim() || !unitPrice || !weight || !quantity) {
      toast.error("请填写完整信息")
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName.trim(),
          hsCode: hsCode.trim(),
          destinationCountry,
          shippingMode,
          unitPrice: parseFloat(unitPrice),
          weight: parseFloat(weight),
          quantity: parseInt(quantity),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "计算失败")
        return
      }

      setResult(data)
      toast.success("税务计算完成")

      // Save to history
      try {
        const c = data.calculation as Record<string, unknown>
        const totalLanded = typeof c.total_landed_cost_batch === "number"
          ? c.total_landed_cost_batch.toFixed(2)
          : "?"
        const summary = `${destinationCountry} · ${productName.trim()} × ${quantity} · 落地 ¥${totalLanded}`
        await fetch("/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: productName.trim(),
            analysisType: "tax",
            inputData: JSON.stringify({
              productName: productName.trim(),
              hsCode: hsCode.trim(),
              destinationCountry,
              shippingMode,
              unitPrice,
              weight,
              quantity,
            }),
            resultData: JSON.stringify(data),
            summary,
          }),
        })
        await loadHistory()
      } catch {
        // ignore save errors
      }
    } catch {
      toast.error("网络错误，请重试")
    } finally {
      setLoading(false)
    }
  }

  const c = result?.calculation as Record<string, any> | undefined

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">欧洲出口税务计算</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            输入产品信息，AI 自动联网查询欧盟最新税率，计算落地成本
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory((v) => !v)}
          className="gap-1.5"
        >
          <History className="size-4" />
          历史记录 {history.length > 0 && `(${history.length})`}
        </Button>
      </div>

      {/* History panel */}
      {showHistory && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">计算历史</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="py-3 text-xs text-muted-foreground text-center">
                暂无历史记录，完成一次计算后会自动保存
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryRecord(item)}
                    className="group flex items-start gap-3 rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <Clock className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {item.projectName || "未命名计算"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString("zh-CN")}
                        </span>
                      </div>
                      {item.summary && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => deleteHistoryRecord(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                      title="删除"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">产品信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">产品名称 *</label>
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="例：蓝牙耳机"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">HS 编码（可选）</label>
                <input
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  placeholder="例：851830"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">目的国 *</label>
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">单价（元）*</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="120"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">单件重量（kg）*</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.2"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">数量 *</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="100"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">运输方式</label>
                <div className="grid grid-cols-3 gap-2">
                  {SHIPPING_MODES.map((mode) => {
                    const Icon = mode.icon
                    const selected = shippingMode === mode.value
                    return (
                      <button
                        key={mode.value}
                        onClick={() => setShippingMode(mode.value)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="size-3.5" />
                        {mode.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <Button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full gap-2"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Calculator className="size-4" />
                )}
                {loading ? "正在联网查询税率..." : "开始计算"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {loading && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center py-16">
                <Loader2 className="size-10 animate-spin text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-semibold mb-1">正在联网查询</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  AI 正在搜索欧盟官方最新税率并计算落地成本...
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && !result && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center py-16">
                <Calculator className="size-10 text-muted-foreground/20 mb-3" />
                <h3 className="text-sm font-semibold mb-1">输入信息开始计算</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  填写左侧产品信息后点击"开始计算"，AI 将联网查询欧盟最新税率
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && result && c && (
            <>
              {/* Rate summary */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-sm">税率明细</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">基础关税</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {c.base_duty_rate ?? "?"}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">增值税</p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {c.vat_rate ?? "?"}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">反倾销税</p>
                      <p className={`text-lg font-bold ${(c.anti_dumping_rate ?? 0) > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                        {(c.anti_dumping_rate ?? 0) > 0 ? `${c.anti_dumping_rate}%` : "无"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-violet-600 dark:text-violet-400" />
                    <CardTitle className="text-sm">单件成本拆解</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "产品采购价", value: c.unit_value_cny, suffix: "元" },
                    { label: "国际运费", value: c.shipping_cost_per_unit, suffix: "元" },
                    { label: "保险费", value: c.insurance_per_unit, suffix: "元" },
                    { label: "CIF 价值", value: c.cif_value_per_unit, suffix: "元", bold: true },
                    { label: "关税", value: c.duty_per_unit, suffix: "元" },
                    { label: "增值税", value: c.vat_per_unit, suffix: "元" },
                    { label: "总税款", value: c.total_tax_per_unit, suffix: "元", highlight: true },
                    { label: "总落地成本", value: c.total_landed_cost_per_unit, suffix: "元", bold: true, highlight: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex justify-between items-center rounded-lg px-3 py-2 ${
                        item.highlight ? "bg-primary/5 border border-primary/10" : "bg-muted/20"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className={`text-sm font-medium ${item.highlight ? "text-primary" : ""}`}>
                        ¥{typeof item.value === "number" ? item.value.toFixed(2) : "?"} {item.suffix}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Batch summary */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <CardTitle className="text-sm">整批汇总（{c.quantity ?? "?"} 件）</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">总税款</p>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">
                        ¥{typeof c.total_tax_batch === "number" ? c.total_tax_batch.toFixed(2) : "?"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/30 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">总落地成本</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        ¥{typeof c.total_landed_cost_batch === "number" ? c.total_landed_cost_batch.toFixed(2) : "?"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strategy report */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-amber-600 dark:text-amber-400" />
                    <CardTitle className="text-sm">策略建议报告</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {result.report.split("\n").map((line, i) => {
                      if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-bold mt-3 mb-1">{line.replace("### ", "")}</h3>
                      if (line.startsWith("## ")) return <h2 key={i} className="text-base font-bold mt-4 mb-1">{line.replace("## ", "")}</h2>
                      if (line.startsWith("- ")) return <li key={i} className="text-xs text-muted-foreground ml-4">{line.replace("- ", "")}</li>
                      if (line.trim() === "") return <br key={i} />
                      return <p key={i} className="text-xs text-muted-foreground leading-relaxed">{line}</p>
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {result && !loading && (
        <div className="mt-4 flex justify-center">
          <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <AlertTriangle className="size-3" />
            以上数据由 AI 实时搜索获取，仅供参考，不构成税务或法律建议
          </p>
        </div>
      )}
    </div>
  )
}
