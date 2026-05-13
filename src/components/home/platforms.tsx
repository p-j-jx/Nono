import { ScrollAnimate } from "@/components/scroll-animate"
import { Package, Store, Music2 } from "lucide-react"

const platforms = [
  {
    name: "Amazon",
    description: "符合 A9 算法的标题、五点描述和 Backend Keywords",
    icon: Package,
    color: "text-platform-amazon",
    bg: "bg-platform-amazon-muted",
  },
  {
    name: "Shopify",
    description: "品牌化商品描述、SEO Meta 和邮件营销序列",
    icon: Store,
    color: "text-platform-shopify",
    bg: "bg-platform-shopify-muted",
  },
  {
    name: "TikTok Shop",
    description: "短视频口播脚本、爆款 Hashtag 和信息流广告文案",
    icon: Music2,
    color: "text-platform-tiktok",
    bg: "bg-platform-tiktok-muted",
  },
]

export function Platforms() {
  return (
    <section id="platforms" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              主流平台全覆盖
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              针对每个平台的算法和用户特点，智能优化商品内容
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid gap-px md:grid-cols-3 rounded-2xl border border-border/50 bg-border/50 overflow-hidden">
          {platforms.map((platform, i) => {
            const Icon = platform.icon
            return (
              <ScrollAnimate key={platform.name} delay={i * 120}>
                <div className="bg-card p-8 h-full group">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${platform.bg} mb-5`}>
                    <Icon className={`size-6 ${platform.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {platform.description}
                  </p>
                </div>
              </ScrollAnimate>
            )
          })}
        </div>
      </div>
    </section>
  )
}
