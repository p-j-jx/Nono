import { ScrollAnimate } from "@/components/scroll-animate"
import { FileText, ImageIcon, Languages, Sparkles, LayoutDashboard, History } from "lucide-react"

const features = [
  {
    title: "智能文案生成",
    description: "AI一键生成高质量商品标题、要点描述、短描述和长描述，提升转化率",
    icon: FileText,
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/12",
    iconColor: "text-primary",
    borderColor: "border-primary/15 dark:border-primary/8",
  },
  {
    title: "AI商品图生成",
    description: "自动生成专业商品主图和场景图，无需摄影棚和模特",
    icon: ImageIcon,
    gradient: "from-cyan-500/20 to-cyan-600/5",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-200/40 dark:border-cyan-800/20",
  },
  {
    title: "多语言适配",
    description: "支持中文、英文、西班牙语，一键切换目标市场语言",
    icon: Languages,
    gradient: "from-teal-500/20 to-teal-600/5",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-600 dark:text-teal-400",
    borderColor: "border-teal-200/40 dark:border-teal-800/20",
  },
  {
    title: "多平台优化",
    description: "针对亚马逊、Shopify、TikTok Shop差异化生成，符合各平台规则",
    icon: Sparkles,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200/40 dark:border-emerald-800/20",
  },
  {
    title: "项目化管理",
    description: "以产品为单位管理所有生成内容，清晰有序",
    icon: LayoutDashboard,
    gradient: "from-primary/15 to-primary/5",
    iconBg: "bg-primary/12",
    iconColor: "text-primary",
    borderColor: "border-primary/15 dark:border-primary/8",
  },
  {
    title: "历史记录",
    description: "随时随地查看和管理历史生成记录，方便复用和迭代",
    icon: History,
    gradient: "from-cyan-500/15 to-cyan-600/5",
    iconBg: "bg-cyan-500/12",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-200/30 dark:border-cyan-800/15",
  },
]

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden border-t border-border/30 py-20 sm:py-28">
      {/* Background decoration */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-l from-cyan-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-14">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              核心功能
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              强大而简洁的运营工具
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              从文案到图片，从生成到管理，全方位覆盖跨境运营需求
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <ScrollAnimate key={feature.title} delay={i * 100}>
                <div
                  className={`group relative rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.gradient} p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30`}
                >
                  {/* Hover glow */}
                  <div aria-hidden className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />

                  <div className="relative">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${feature.iconBg} ring-1 ring-border/30 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:ring-primary/30`}
                    >
                      <Icon className={`size-5 ${feature.iconColor}`} />
                    </div>
                    <h3 className="font-semibold mb-2 text-[15px]">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner decoration */}
                  <div aria-hidden className="absolute top-0 right-0 size-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl" />
                  </div>
                </div>
              </ScrollAnimate>
            )
          })}
        </div>
      </div>
    </section>
  )
}
