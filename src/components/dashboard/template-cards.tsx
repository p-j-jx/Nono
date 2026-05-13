import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ListOrdered, Video, Sparkles } from "lucide-react"

const showcaseTemplates = [
  {
    id: "amazon",
    href: "/dashboard/templates/amazon",
    platform: "Amazon",
    badgeClass: "bg-platform-amazon-muted text-platform-amazon",
    iconBg: "bg-platform-amazon/10 text-platform-amazon",
    icon: ListOrdered,
    title: "Listing 转化型",
    desc: "严格遵循 Amazon SEO 规则",
    metas: ["标题 ≤ 200 字符", "5 点描述", "Backend Keywords"],
    snippet: "Wireless BT 5.3 Headphones, Active Noise Cancelling, 30Hr Playtime, IPX7 Waterproof…",
  },
  {
    id: "tiktok",
    href: "/dashboard/templates/tiktok",
    platform: "TikTok Shop",
    badgeClass: "bg-platform-tiktok-muted text-platform-tiktok",
    iconBg: "bg-platform-tiktok/10 text-platform-tiktok",
    icon: Video,
    title: "短视频带货型",
    desc: "3 秒钩子 + 口播脚本 + Hashtag",
    metas: ["开场钩子", "60s 分镜", "爆款 Hashtag"],
    snippet: '"Wait—这条裙子真的只要 $29?" 😱 朋友们看完都让我发链接…',
  },
  {
    id: "shopify",
    href: "/dashboard/templates/shopify",
    platform: "Shopify",
    badgeClass: "bg-platform-shopify-muted text-platform-shopify",
    iconBg: "bg-platform-shopify/10 text-platform-shopify",
    icon: Sparkles,
    title: "品牌独立站型",
    desc: "品牌故事 + SEO Meta + 邮件",
    metas: ["Brand Story", "SEO Meta", "邮件营销"],
    snippet: "Feel free in every move — designed for women who flow through life with intention…",
  },
]

export function TemplateCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">场景模板</h2>
          <span className="text-[11px] text-muted-foreground">不同平台、不同打法</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" render={<a href="/dashboard/templates" />}>
          模板中心 <ArrowRight className="size-3" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {showcaseTemplates.map((t) => {
          const Icon = t.icon
          return (
            <Link key={t.id} href={t.href}>
              <Card className="group relative overflow-hidden h-full transition-colors duration-200 hover:border-primary/20 cursor-pointer" role="article">
                <CardContent className="p-4 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`text-[10px] font-medium ${t.badgeClass}`}>
                      {t.platform}
                    </Badge>
                    <div className={`flex size-7 items-center justify-center rounded-lg ${t.iconBg}`}>
                      <Icon className="size-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-0.5">{t.title}</h3>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {t.metas.map((m) => (
                      <span key={m} className="inline-flex items-center rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-lg bg-muted/30 p-2 border border-border/30">
                    <p className="text-[11px] text-foreground/70 leading-relaxed line-clamp-2 font-light italic">
                      {t.snippet}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
                    查看完整模板 <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
