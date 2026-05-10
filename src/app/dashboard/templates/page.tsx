import { LayoutTemplate, Sparkles, ArrowRight, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Template = {
  id: string
  name: string
  description: string
  category: string
  preset: Record<string, string>
}

const templates: Template[] = [
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

const platformLabels: Record<string, string> = {
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok Shop",
}

const platformBadges: Record<string, string> = {
  amazon: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  shopify: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  tiktok: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
}

const platformGradients: Record<string, string> = {
  amazon: "from-amber-500 to-orange-500",
  shopify: "from-emerald-500 to-green-600",
  tiktok: "from-cyan-500 to-teal-500",
}

const categoryLabels: Record<string, string> = {
  electronics: "3C 电子",
  clothing: "服饰箱包",
  beauty: "美妆个护",
  home: "家居生活",
  sports: "运动户外",
}

export default function TemplatesPage() {
  // Group templates by platform
  const byPlatform: Record<string, Template[]> = {}
  const byCategory: Record<string, Template[]> = {}
  for (const t of templates) {
    const p = t.preset.platform || "other"
    if (!byPlatform[p]) byPlatform[p] = []
    byPlatform[p].push(t)
    if (!byCategory[t.category]) byCategory[t.category] = []
    byCategory[t.category].push(t)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">模板中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          基于各平台最佳实践预配置的场景模板，快速开始内容创作
        </p>
      </div>

      {/* Platform templates */}
      <h2 className="text-sm font-semibold mb-3">按平台</h2>
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {Object.entries(byPlatform).map(([platform, platformTemplates]) => {
          const gradient = platformGradients[platform] || "from-primary to-primary/50"
          const badgeClass = platformBadges[platform] || "bg-muted text-muted-foreground"
          return (
            <Card key={platform} className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-transparent group">
              <div aria-hidden className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradient}`} />
              <CardHeader className="pb-3">
                <Badge variant="outline" className={`w-fit text-[11px] font-medium ${badgeClass}`}>
                  {platformLabels[platform] || platform}
                </Badge>
                <CardTitle className="text-sm mt-2">{platformLabels[platform] || platform} 模板</CardTitle>
                <CardDescription className="text-xs">
                  {platformTemplates.length} 个场景模板
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {platformTemplates.map((t) => (
                    <li key={t.id} className="flex items-start gap-2 text-xs">
                      <Check className="size-3 mt-0.5 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium text-foreground">{t.name}</span>
                        <span className="text-muted-foreground ml-1">{t.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors inline-flex items-center gap-1">
                  查看全部 <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Industry templates */}
      <h2 className="text-sm font-semibold mb-3">按行业</h2>
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
