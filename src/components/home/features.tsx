import { ScrollAnimate } from "@/components/scroll-animate"
import { FileText, ImageIcon, Languages, Sparkles, LayoutDashboard, History, ArrowUpRight } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden border-t border-border/30 py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-cyan-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-16">
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

        {/* Row 1: Hero feature + stacked cards */}
        <div className="grid gap-5 lg:grid-cols-12 mb-5">
          {/* 智能文案生成 — hero card spans 7 cols */}
          <ScrollAnimate className="lg:col-span-7">
            <div className="group relative h-full rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-primary/[0.02] to-transparent p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div aria-hidden className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />
              <div aria-hidden className="absolute top-0 right-0 size-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 size-16 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl" />
              </div>

              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/20 mb-5 transition-transform duration-300 group-hover:scale-110">
                <FileText className="size-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">智能文案生成</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">
                AI 一键生成高质量商品标题、要点描述、短描述和长描述，针对不同平台智能优化，持续提升转化率
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">标题优化</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">要点描述</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">SEO 文案</span>
              </div>
            </div>
          </ScrollAnimate>

          {/* Right column stacked */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* AI商品图生成 */}
            <ScrollAnimate delay={100}>
              <div className="group relative rounded-2xl border border-cyan-200/40 dark:border-cyan-800/20 bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-200/40 transition-transform duration-300 group-hover:scale-110">
                    <ImageIcon className="size-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[15px] mb-1.5">AI商品图生成</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      自动生成专业商品主图和场景图，无需摄影棚和模特
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 text-cyan-500 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </ScrollAnimate>

            {/* Two mini cards side by side */}
            <div className="grid grid-cols-2 gap-5">
              <ScrollAnimate delay={200}>
                <div className="group relative rounded-2xl border border-teal-200/40 dark:border-teal-800/20 bg-gradient-to-br from-teal-500/20 to-teal-600/5 p-5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-teal-500/15 ring-1 ring-teal-200/40 mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Languages className="size-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">多语言适配</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">中、英、西语一键切换</p>
                </div>
              </ScrollAnimate>

              <ScrollAnimate delay={300}>
                <div className="group relative rounded-2xl border border-emerald-200/40 dark:border-emerald-800/20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 p-5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-200/40 mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">多平台优化</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Amazon · Shopify · TikTok</p>
                </div>
              </ScrollAnimate>
            </div>
          </div>
        </div>

        {/* Row 2: Two remaining cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          <ScrollAnimate delay={400}>
            <div className="group relative rounded-2xl border border-primary/15 dark:border-primary/8 bg-gradient-to-br from-primary/12 to-primary/5 p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                  <LayoutDashboard className="size-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[15px] mb-1.5">项目化管理</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    以产品为单位管理所有生成内容，每个项目独立管理文案记录、图片版本和历史，清晰有序，方便复用和迭代
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-primary shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={500}>
            <div className="group relative rounded-2xl border border-cyan-200/30 dark:border-cyan-800/15 bg-gradient-to-br from-cyan-500/15 to-cyan-600/5 p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/12 ring-1 ring-cyan-200/30 transition-transform duration-300 group-hover:scale-110">
                  <History className="size-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[15px] mb-1.5">历史记录</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    随时随地查看和管理所有生成记录，支持搜索、筛选和收藏，方便复用和迭代优化
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-cyan-500 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  )
}
