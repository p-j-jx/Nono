import { ScrollAnimate } from "@/components/scroll-animate"
import { Package, Store, Music2 } from "lucide-react"

const platforms = [
  {
    name: "Amazon",
    description: "生成符合亚马逊A9算法的标题、五点描述和产品详情",
    icon: Package,
    gradient: "from-amber-500/15 to-amber-600/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200/30 dark:border-amber-800/20",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    name: "Shopify",
    description: "创建品牌化商品描述和SEO优化的独立站内容",
    icon: Store,
    gradient: "from-emerald-500/15 to-emerald-600/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200/30 dark:border-emerald-800/20",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    name: "TikTok Shop",
    description: "制作短视频带货文案和符合兴趣电商的营销内容",
    icon: Music2,
    gradient: "from-pink-500/15 to-pink-600/5",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-200/30 dark:border-pink-800/20",
    glow: "group-hover:shadow-pink-500/10",
  },
]

export function Platforms() {
  return (
    <section id="platforms" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-14">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              支持平台
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              主流平台全覆盖
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              针对每个平台的算法和用户特点，智能优化你的商品内容
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid gap-6 md:grid-cols-3">
          {platforms.map((platform, i) => {
            const Icon = platform.icon
            return (
              <ScrollAnimate key={platform.name} delay={i * 150}>
                <div
                  className={`group relative overflow-hidden rounded-2xl border ${platform.borderColor} bg-gradient-to-br ${platform.gradient} p-8 transition-all duration-500 hover:shadow-xl ${platform.glow} hover:-translate-y-1`}
                >
                  {/* Hover glow overlay */}
                  <div
                    aria-hidden
                    className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                  />

                  {/* Platform icon */}
                  <div
                    className={`flex size-14 items-center justify-center rounded-xl ${platform.iconBg} ring-1 ring-border/20 mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/10`}
                  >
                    <Icon className={`size-7 ${platform.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-primary">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {platform.description}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100 origin-center"
                  />
                </div>
              </ScrollAnimate>
            )
          })}
        </div>
      </div>
    </section>
  )
}
