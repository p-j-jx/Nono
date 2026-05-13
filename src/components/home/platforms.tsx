import { ScrollAnimate } from "@/components/scroll-animate"
import { Package, Store, Music2, ArrowRight } from "lucide-react"

const platforms = [
  {
    name: "Amazon",
    tag: "Listing 优化",
    description: "符合 A9 算法的标题、五点描述、Backend Keywords，直接提升搜索排名",
    icon: Package,
    color: "text-platform-amazon",
    bg: "bg-platform-amazon",
    bgMuted: "bg-platform-amazon-muted",
    href: "/dashboard/templates/amazon",
  },
  {
    name: "Shopify",
    tag: "品牌独立站",
    description: "品牌故事、SEO Meta 三件套、邮件营销序列，建立品牌心智",
    icon: Store,
    color: "text-platform-shopify",
    bg: "bg-platform-shopify",
    bgMuted: "bg-platform-shopify-muted",
    href: "/dashboard/templates/shopify",
  },
  {
    name: "TikTok Shop",
    tag: "短视频带货",
    description: "3 秒钩子口播脚本、爆款 Hashtag 组合、信息流广告文案",
    icon: Music2,
    color: "text-platform-tiktok",
    bg: "bg-platform-tiktok",
    bgMuted: "bg-platform-tiktok-muted",
    href: "/dashboard/templates/tiktok",
  },
]

export function Platforms() {
  return (
    <section id="platforms" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              三大平台，各有打法
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              针对每个平台的算法和用户特点，生成最适合的内容
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid gap-5 md:grid-cols-3">
          {platforms.map((platform, i) => {
            const Icon = platform.icon
            return (
              <ScrollAnimate key={platform.name} delay={i * 120}>
                <a
                  href={platform.href}
                  className="group block rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-border cursor-pointer"
                >
                  {/* Color header band */}
                  <div className={`${platform.bg} px-6 pt-6 pb-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="size-6 text-white/90" />
                      <span className="text-[11px] font-medium text-white/70 bg-white/15 rounded-full px-2.5 py-0.5">
                        {platform.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                  </div>

                  {/* Description */}
                  <div className="px-6 py-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {platform.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
                      查看模板 <ArrowRight className="size-3" />
                    </div>
                  </div>
                </a>
              </ScrollAnimate>
            )
          })}
        </div>
      </div>
    </section>
  )
}
