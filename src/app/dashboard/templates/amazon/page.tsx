import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Hash,
  ListOrdered,
  FileText,
  Search,
  TrendingUp,
  ArrowRight,
} from "lucide-react"

const listingRules = [
  {
    field: "商品标题",
    rule: "80–200 字符",
    formula: "品牌 + 核心关键词 + 规格 + 卖点 + 适用场景",
    tip: "首字母大写，禁用促销词如「Best」「Sale」",
  },
  {
    field: "五点描述",
    rule: "每点 ≤ 500 字符",
    formula: "大写卖点 + 详细说明 + 数据支撑",
    tip: "前 3 点决定转化，痛点优先",
  },
  {
    field: "商品描述",
    rule: "≤ 2000 字符",
    formula: "场景导入 → 卖点展开 → 信任背书",
    tip: "支持 HTML 标签结构化排版",
  },
  {
    field: "Backend Keywords",
    rule: "≤ 250 字节",
    formula: "近义词 / 拼写变体 / 长尾词",
    tip: "用空格分隔，不重复主标题词",
  },
]

export default function AmazonTemplatePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/dashboard/templates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="size-4" />
        返回模板中心
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background p-6 sm:p-8 mb-8">
        <div aria-hidden className="absolute -top-20 -right-20 size-64 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 blur-3xl" />
        <div className="relative">
          <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 mb-3">
            Amazon
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Listing 转化型模板
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            严格遵循 Amazon Listing SEO 规则，标题、五点、描述、关键词全要素覆盖，专注搜索排名与转化率。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button render={<Link href="/dashboard/new?template=amazon" />} className="gap-2 shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-500/90 hover:to-orange-500/90 text-white border-0">
              <Sparkles className="size-4" />
              使用此模板
            </Button>
            <Button variant="outline" render={<Link href="/dashboard/templates" />}>
              对比其他模板
            </Button>
          </div>
        </div>
      </div>

      {/* Rules */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold">平台规则要点</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {listingRules.map((r) => (
            <Card key={r.field}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{r.field}</span>
                  <Badge variant="secondary" className="text-[10px]">{r.rule}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  <span className="font-medium text-foreground/70">公式：</span>
                  {r.formula}
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                  💡 {r.tip}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Example */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
            <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold">完整示例</h2>
          <span className="text-xs text-muted-foreground">示例商品：无线蓝牙耳机</span>
        </div>

        {/* Title */}
        <Card className="mb-3 border-l-4 border-l-amber-500/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-amber-600" />
              <CardTitle className="text-sm">SEO 标题</CardTitle>
              <Badge variant="secondary" className="text-[10px]">182 字符</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed font-mono bg-muted/30 rounded-lg p-3">
              SoundCore Wireless Bluetooth 5.3 Headphones, Active Noise Cancelling Over-Ear Earphones, 30 Hours Playtime, IPX7 Waterproof, Deep Bass, Built-in Mic for Workout Running Travel Office
            </p>
          </CardContent>
        </Card>

        {/* Bullet Points */}
        <Card className="mb-3 border-l-4 border-l-amber-500/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ListOrdered className="size-4 text-amber-600" />
              <CardTitle className="text-sm">五点描述</CardTitle>
              <Badge variant="secondary" className="text-[10px]">大写开头 · 数据支撑</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm leading-relaxed">
              {[
                ["INDUSTRY-LEADING NOISE CANCELLING", "采用第三代 ANC 芯片，可消除高达 95% 的环境噪音，让你在地铁、办公室、咖啡厅都能沉浸专注。"],
                ["30 HOURS LONG-LASTING BATTERY", "单次充电可使用 30 小时，10 分钟快充支持 4 小时使用。USB-C 接口，告别繁琐线缆。"],
                ["IPX7 WATERPROOF DESIGN", "通过 IPX7 防水认证，运动健身、户外跑步、突遇暴雨都无惧汗水雨水侵蚀。"],
                ["CRYSTAL-CLEAR HD CALLS", "内置双 ENC 降噪麦克风，AI 算法智能识别人声，远程会议、户外通话清晰无杂音。"],
                ["MULTIPOINT CONNECTION", "支持同时连接 2 台设备，无缝在手机、电脑、平板之间切换，工作生活两不误。"],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-2">
                  <CheckCircle2 className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold uppercase text-foreground tracking-wide">{title}</span>
                    <span className="text-muted-foreground"> — {desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Keywords */}
        <Card className="mb-3 border-l-4 border-l-amber-500/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-amber-600" />
              <CardTitle className="text-sm">Backend Keywords</CardTitle>
              <Badge variant="secondary" className="text-[10px]">不与标题重复</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              wireless earbuds bluetooth headset noise canceling earphones sports running gym workout commute office gaming travel waterproof sweatproof deep bass clear mic foldable comfortable
            </div>
          </CardContent>
        </Card>

        {/* Search Term Strategy */}
        <Card className="border-l-4 border-l-amber-500/60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-amber-600" />
              <CardTitle className="text-sm">搜索词布局策略</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center justify-center w-12 h-5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">主词</span>
              <span className="text-muted-foreground">放在标题前 80 字符</span>
              <span className="font-mono">wireless bluetooth headphones</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center justify-center w-12 h-5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">长尾</span>
              <span className="text-muted-foreground">分散到五点描述</span>
              <span className="font-mono">noise cancelling over-ear headphones for travel</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center justify-center w-12 h-5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-medium">变体</span>
              <span className="text-muted-foreground">放入 Backend Keywords</span>
              <span className="font-mono">earbuds, earphones, headset</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom CTA */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
              <TrendingUp className="size-4 text-amber-600" />
              准备好用 AI 一键生成完整 Listing 了吗？
            </h3>
            <p className="text-sm text-muted-foreground">
              输入商品信息，AI 将为你生成符合 Amazon 规则的标题、五点、描述、关键词。
            </p>
          </div>
          <Button render={<Link href="/dashboard/new?template=amazon" />} size="lg" className="gap-2 shrink-0 shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-500/90 hover:to-orange-500/90 text-white border-0">
            <Sparkles className="size-4" />
            使用此模板
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
