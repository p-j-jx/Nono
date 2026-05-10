import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight } from "lucide-react"

const templates = [
  {
    href: "/dashboard/new?template=amazon",
    platform: "Amazon",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    title: "Amazon 商品详情",
    desc: "完整的 Listing 优化方案",
    features: ["标题与五点描述", "A+ 页面文案", "关键词研究"],
    gradient: "from-amber-500/10 to-amber-500/5",
    topBar: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  {
    href: "/dashboard/new?template=tiktok",
    platform: "TikTok Shop",
    badgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    title: "TikTok 带货视频",
    desc: "短视频脚本与视觉方案",
    features: ["口播脚本与分镜", "热门标签推荐", "多语言字幕"],
    gradient: "from-cyan-500/10 to-cyan-500/5",
    topBar: "bg-gradient-to-r from-cyan-500 to-teal-500",
  },
  {
    href: "/dashboard/new?template=shopify",
    platform: "Shopify",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    title: "Shopify 产品页面",
    desc: "独立站产品页优化",
    features: ["产品描述与卖点", "SEO 标题优化", "邮件营销文案"],
    gradient: "from-emerald-500/10 to-emerald-500/5",
    topBar: "bg-gradient-to-r from-emerald-500 to-green-600",
  },
]

export function TemplateCards() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold">场景模板</h2>
        <span className="text-[11px] text-muted-foreground">基于最佳实践预配置</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {templates.map((t) => (
          <Link key={t.title} href={t.href}>
            <Card className="group relative overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-transparent cursor-pointer">
              {/* Top gradient bar */}
              <div aria-hidden className={`absolute top-0 left-0 right-0 h-[3px] ${t.topBar}`} />

              {/* Hover gradient overlay */}
              <div
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-b ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <CardHeader className="pb-3 relative">
                <Badge variant="outline" className={`w-fit text-[11px] font-medium ${t.badgeClass}`}>
                  {t.platform}
                </Badge>
                <CardTitle className="text-sm mt-2">{t.title}</CardTitle>
                <CardDescription className="text-xs">{t.desc}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-1.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10 shrink-0">
                        <Check className="size-2.5 text-emerald-500" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors inline-flex items-center gap-1">
                  使用此模板 <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
