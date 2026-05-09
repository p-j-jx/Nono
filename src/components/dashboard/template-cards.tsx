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
  },
  {
    href: "/dashboard/new?template=tiktok",
    platform: "TikTok Shop",
    badgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    title: "TikTok 带货视频",
    desc: "短视频脚本与视觉方案",
    features: ["口播脚本与分镜", "热门标签推荐", "多语言字幕"],
  },
  {
    href: "/dashboard/new?template=shopify",
    platform: "Shopify",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    title: "Shopify 产品页面",
    desc: "独立站产品页优化",
    features: ["产品描述与卖点", "SEO 标题优化", "邮件营销文案"],
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
            <Card className="group h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer">
              <CardHeader className="pb-3">
                <Badge variant="outline" className={`w-fit text-[11px] font-medium ${t.badgeClass}`}>
                  {t.platform}
                </Badge>
                <CardTitle className="text-sm mt-2">{t.title}</CardTitle>
                <CardDescription className="text-xs">{t.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="size-3 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors inline-flex items-center gap-1">
                  使用此模板 <ArrowRight className="size-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
