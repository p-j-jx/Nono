import { ScrollAnimate } from "@/components/scroll-animate"
import { FileText, ImageIcon, Languages, Sparkles, LayoutDashboard, History } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "智能文案生成",
    description: "一键生成商品标题、要点描述、短描述和长描述，针对不同平台智能优化",
    tags: ["标题优化", "要点描述", "SEO 文案"],
    span: "lg:col-span-7",
    size: "large" as const,
  },
  {
    icon: ImageIcon,
    title: "AI 商品图生成",
    description: "自动生成专业商品主图和场景图，无需摄影棚和模特",
    span: "lg:col-span-5",
    size: "medium" as const,
  },
  {
    icon: Languages,
    title: "多语言适配",
    description: "中、英、西语一键切换",
    span: "",
    size: "small" as const,
  },
  {
    icon: Sparkles,
    title: "多平台优化",
    description: "Amazon · Shopify · TikTok",
    span: "",
    size: "small" as const,
  },
  {
    icon: LayoutDashboard,
    title: "项目化管理",
    description: "以产品为单位管理所有生成内容，清晰有序，方便复用和迭代",
    span: "",
    size: "medium" as const,
  },
  {
    icon: History,
    title: "历史记录",
    description: "搜索、筛选和收藏所有生成记录，方便复用和迭代优化",
    span: "",
    size: "medium" as const,
  },
]

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden border-t border-border/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              强大而简洁的运营工具
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              从文案到图片，从生成到管理，全方位覆盖跨境运营需求
            </p>
          </div>
        </ScrollAnimate>

        {/* Row 1: Hero feature + secondary */}
        <div className="grid gap-px lg:grid-cols-12 rounded-2xl border border-border/50 bg-border/50 overflow-hidden mb-px">
          {/* 智能文案生成 — hero card */}
          <ScrollAnimate className="lg:col-span-7">
            <div className="bg-card p-8 h-full">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 mb-5">
                <FileText className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">智能文案生成</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-lg">
                AI 一键生成高质量商品标题、要点描述、短描述和长描述，针对不同平台智能优化，持续提升转化率
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {["标题优化", "要点描述", "SEO 文案"].map((tag) => (
                  <span key={tag} className="rounded-md bg-primary/8 px-2.5 py-1 text-primary font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollAnimate>

          {/* AI 商品图 */}
          <ScrollAnimate className="lg:col-span-5" delay={100}>
            <div className="bg-card p-8 h-full">
              <div className="flex size-12 items-center justify-center rounded-xl bg-platform-tiktok/10 mb-5">
                <ImageIcon className="size-6 text-platform-tiktok" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI 商品图生成</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                自动生成专业商品主图和场景图，无需摄影棚和模特
              </p>
            </div>
          </ScrollAnimate>
        </div>

        {/* Row 2: Two small cards */}
        <div className="grid gap-px grid-cols-2 rounded-2xl border border-border/50 bg-border/50 overflow-hidden mb-px">
          <ScrollAnimate delay={200}>
            <div className="bg-card p-6 h-full">
              <div className="flex size-10 items-center justify-center rounded-lg bg-platform-shopify/10 mb-3">
                <Languages className="size-5 text-platform-shopify" />
              </div>
              <h3 className="font-semibold text-sm mb-1">多语言适配</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">中、英、西语一键切换</p>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={300}>
            <div className="bg-card p-6 h-full">
              <div className="flex size-10 items-center justify-center rounded-lg bg-platform-amazon/10 mb-3">
                <Sparkles className="size-5 text-platform-amazon" />
              </div>
              <h3 className="font-semibold text-sm mb-1">多平台优化</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Amazon · Shopify · TikTok</p>
            </div>
          </ScrollAnimate>
        </div>

        {/* Row 3: Two medium cards */}
        <div className="grid gap-px sm:grid-cols-2 rounded-2xl border border-border/50 bg-border/50 overflow-hidden">
          <ScrollAnimate delay={400}>
            <div className="bg-card p-8 h-full">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 mb-5">
                <LayoutDashboard className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">项目化管理</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                以产品为单位管理所有生成内容，每个项目独立管理文案记录、图片版本和历史
              </p>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={500}>
            <div className="bg-card p-8 h-full">
              <div className="flex size-12 items-center justify-center rounded-xl bg-platform-tiktok/10 mb-5">
                <History className="size-6 text-platform-tiktok" />
              </div>
              <h3 className="text-lg font-semibold mb-2">历史记录</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                搜索、筛选和收藏所有生成记录，方便复用和迭代优化
              </p>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  )
}
