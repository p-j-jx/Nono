import { LayoutTemplate, Sparkles, ArrowRight, ListOrdered, Video, Heart, Hash, Mail, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type IndustryTemplate = {
  id: string
  name: string
  description: string
  category: string
  preset: Record<string, string>
}

const industryTemplates: IndustryTemplate[] = [
  {
    id: "electronics",
    name: "3C数码模板",
    description: "适用于电子产品、数码配件类商品",
    category: "electronics",
    preset: { brandTone: "professional", copyStyle: "technical", visualStyle: "tech", targetAudience: "18-40岁科技爱好者", platform: "amazon" },
  },
  {
    id: "clothing",
    name: "服装鞋帽模板",
    description: "适用于服装、鞋子、配饰类商品",
    category: "clothing",
    preset: { brandTone: "fashionable", copyStyle: "emotional", visualStyle: "lifestyle", targetAudience: "20-35岁追求时尚的年轻消费者", platform: "shopify" },
  },
  {
    id: "beauty",
    name: "美妆个护模板",
    description: "适用于美容护肤、个人护理类商品",
    category: "beauty",
    preset: { brandTone: "friendly", copyStyle: "emotional", visualStyle: "brand", targetAudience: "18-45岁注重护肤的女性消费者", platform: "shopify" },
  },
  {
    id: "home",
    name: "家居用品模板",
    description: "适用于家居、园艺、收纳类商品",
    category: "home",
    preset: { brandTone: "friendly", copyStyle: "casual", visualStyle: "lifestyle", targetAudience: "25-50岁注重生活品质的家庭用户", platform: "amazon" },
  },
  {
    id: "sports",
    name: "运动户外模板",
    description: "适用于运动器材、户外用品类商品",
    category: "sports",
    preset: { brandTone: "professional", copyStyle: "casual", visualStyle: "lifestyle", targetAudience: "18-40岁热爱运动的消费者", platform: "amazon" },
  },
  {
    id: "tiktok-fashion",
    name: "TikTok爆款模板",
    description: "适用于TikTok Shop短视频带货",
    category: "clothing",
    preset: { brandTone: "fashionable", copyStyle: "casual", visualStyle: "promotional", platform: "tiktok", language: "en", targetAudience: "16-30岁TikTok活跃用户" },
  },
]

const platformTemplates = [
  {
    id: "amazon",
    name: "Amazon Listing 转化型",
    desc: "严格遵循 Amazon SEO 规则",
    detailHref: "/dashboard/templates/amazon",
    useHref: "/dashboard/new?template=amazon",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    topBar: "bg-gradient-to-r from-amber-500 to-orange-500",
    gradient: "from-amber-500/[0.06] via-orange-500/[0.03] to-transparent",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Icon: ListOrdered,
    features: [
      { icon: ListOrdered, text: "标题 ≤ 200 字符 + 五点描述" },
      { icon: Hash, text: "Backend Keywords 关键词布局" },
      { icon: Search, text: "Amazon A9 算法搜索优化" },
    ],
    snippet: "Wireless Bluetooth 5.3 Headphones, Active Noise Cancelling, 30Hr Playtime, IPX7 Waterproof…",
  },
  {
    id: "tiktok",
    name: "TikTok Shop 短视频带货型",
    desc: "3 秒钩子 + 口播脚本 + Hashtag 组合",
    detailHref: "/dashboard/templates/tiktok",
    useHref: "/dashboard/new?template=tiktok",
    badgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    topBar: "bg-gradient-to-r from-cyan-500 to-teal-500",
    gradient: "from-cyan-500/[0.06] via-teal-500/[0.03] to-transparent",
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    Icon: Video,
    features: [
      { icon: Video, text: "60 秒分镜脚本（钩子→解决→CTA）" },
      { icon: Hash, text: "爆款 Hashtag 三段式组合" },
      { icon: Sparkles, text: "BGM 节奏与画面切换建议" },
    ],
    snippet: '"Wait—这条裙子真的只要 $29?" 😱 镜头快速 zoom 商品价签…',
  },
  {
    id: "shopify",
    name: "Shopify 品牌独立站型",
    desc: "品牌故事 + SEO Meta + 邮件营销",
    detailHref: "/dashboard/templates/shopify",
    useHref: "/dashboard/new?template=shopify",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    topBar: "bg-gradient-to-r from-emerald-500 to-green-600",
    gradient: "from-emerald-500/[0.06] via-green-500/[0.03] to-transparent",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Icon: Heart,
    features: [
      { icon: Heart, text: "品牌故事 + 创始人叙事" },
      { icon: Search, text: "Google SEO Meta 三件套" },
      { icon: Mail, text: "欢迎邮件序列（4 封）" },
    ],
    snippet: "Feel free in every move — designed for women who flow through life with intention…",
  },
]

const categoryLabels: Record<string, string> = {
  electronics: "3C 电子",
  clothing: "服饰箱包",
  beauty: "美妆个护",
  home: "家居生活",
  sports: "运动户外",
}

export default function TemplatesPage() {
  // Group industry templates by category
  const byCategory: Record<string, IndustryTemplate[]> = {}
  for (const t of industryTemplates) {
    if (!byCategory[t.category]) byCategory[t.category] = []
    byCategory[t.category].push(t)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">模板中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          不同平台有不同的内容规则与打法，选对模板，事半功倍
        </p>
      </div>

      {/* Platform templates - Each card has its own distinct style */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold">按平台</h2>
        <span className="text-[11px] text-muted-foreground">点击查看完整模板规则与示例</span>
      </div>
      <div className="grid gap-5 lg:grid-cols-3 mb-12">
        {platformTemplates.map((t) => {
          const Icon = t.Icon
          return (
            <Card key={t.id} className="group relative overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col">
              {/* Top bar */}
              <div aria-hidden className={`absolute top-0 left-0 right-0 h-1 ${t.topBar}`} />
              {/* Bg gradient */}
              <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

              <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className={`text-[11px] font-medium ${t.badgeClass}`}>
                    {t.id === "amazon" ? "Amazon" : t.id === "tiktok" ? "TikTok Shop" : "Shopify"}
                  </Badge>
                  <div className={`flex size-9 items-center justify-center rounded-xl ${t.iconBg}`}>
                    <Icon className="size-4" />
                  </div>
                </div>
                <CardTitle className="text-base">{t.name}</CardTitle>
                <CardDescription className="text-xs">{t.desc}</CardDescription>
              </CardHeader>

              <CardContent className="relative flex-1 flex flex-col">
                <ul className="space-y-2 mb-4">
                  {t.features.map((f) => {
                    const FIcon = f.icon
                    return (
                      <li key={f.text} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <FIcon className="size-3 mt-0.5 text-foreground/40 shrink-0" />
                        <span>{f.text}</span>
                      </li>
                    )
                  })}
                </ul>

                {/* Example snippet */}
                <div className="rounded-lg bg-muted/40 border border-border/40 p-2.5 mb-4">
                  <p className="text-[11px] text-foreground/70 leading-relaxed line-clamp-2 italic">
                    {t.snippet}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" render={<Link href={t.detailHref} />}>
                    查看示例
                  </Button>
                  <Button size="sm" className="flex-1 h-9 text-xs gap-1" render={<Link href={t.useHref} />}>
                    使用此模板
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Industry templates */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold">按行业</h2>
        <span className="text-[11px] text-muted-foreground">基于行业特征预配置生成参数</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {Object.entries(byCategory).map(([category, categoryTemplates]) => (
          <Link key={category} href={`/dashboard/new?template=${categoryTemplates[0].id}`}>
            <Card className="relative overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 mb-3 group-hover:from-primary/20 group-hover:to-violet-500/20 transition-colors">
                  <LayoutTemplate className="size-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1">
                  {categoryLabels[category] || category}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {categoryTemplates.length} 个模板
                </p>
                <ul className="space-y-1">
                  {categoryTemplates.map((t) => (
                    <li key={t.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1 rounded-full bg-primary/30 shrink-0" />
                      {t.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors inline-flex items-center gap-1">
                  使用模板 <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick start */}
      <Card className="relative overflow-hidden border-dashed bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02]">
        <CardContent className="flex flex-col items-center justify-center text-center py-10">
          <Sparkles className="size-8 text-primary/30 mb-3" />
          <h3 className="text-base font-semibold mb-1">没有找到合适的模板？</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            可以从空白项目开始，AI 会根据你的商品信息自动推荐最佳配置
          </p>
          <Button render={<Link href="/dashboard/new" />} className="gap-2 shadow-lg shadow-primary/20">
            创建空白项目 <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
