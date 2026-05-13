import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pb-28 sm:pt-40">
      {/* ── 背景层级 ── */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-transparent to-background" />

        {/* Main glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-primary/20 via-primary/8 to-transparent rounded-full blur-3xl" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:80px_80px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── 左侧文案 ── */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/10 ring-inset opacity-0 animate-fade-in">
              <Sparkles className="size-3.5" />
              跨境电商 AI 运营助手
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] opacity-0 animate-fade-up">
              <span className="text-foreground">
                AI 驱动，
              </span>
              <br />
              <span className="text-primary">
                让跨境运营更简单
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed opacity-0 animate-fade-up animation-delay-200">
              一站式生成亚马逊、Shopify、TikTok Shop 多平台商品文案与营销图片。
              支持中/英/西三语，助力中国品牌高效出海。
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4 opacity-0 animate-fade-up animation-delay-400">
              <Button
                size="lg"
                className="h-12 px-8 text-base gap-2 w-full sm:w-auto bg-conversion text-conversion-foreground hover:bg-conversion/90 shadow-lg shadow-conversion/25 hover:shadow-xl hover:shadow-conversion/30 transition-all duration-300"
                render={<a href="/register" />}
              >
                免费开始使用
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base w-full sm:w-auto border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                render={<a href="#features" />}
              >
                了解更多
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-12 sm:mt-16 flex flex-wrap items-center gap-3 border-t border-border/30 pt-8 opacity-0 animate-fade-up animation-delay-600">
              {[
                "Amazon / Shopify / TikTok",
                "中英西三语",
                "文案 + 营销图",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border/50 ring-inset"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── 右侧视觉预览 ── */}
          <div className="relative hidden lg:block opacity-0 animate-fade-right animation-delay-300">
            <div className="relative">
              {/* Main browser window mockup */}
              <div className="relative rounded-2xl border border-border/40 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 h-10 border-b border-border/20 bg-muted/30">
                  <div className="size-3 rounded-full bg-red-400/80" />
                  <div className="size-3 rounded-full bg-amber-400/80" />
                  <div className="size-3 rounded-full bg-emerald-400/80" />
                  <div className="ml-4 flex-1 max-w-[200px] h-5 rounded-md bg-muted/50 flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground/60">app.aikuajingtong.com</span>
                  </div>
                </div>

                {/* Mockup content */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-white">AI</span>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-foreground/80">我的项目</div>
                        <div className="text-[9px] text-muted-foreground/50">共 6 个活跃项目</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-6 w-14 rounded-md bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-[8px] text-muted-foreground/50">仪表盘</span>
                      </div>
                      <div className="h-6 w-14 rounded-md bg-primary/20 flex items-center justify-center">
                        <span className="text-[8px] text-primary/70 font-medium">+ 新建</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      ["生成次数", "247", "bg-primary/20"],
                      ["本月新增", "+36", "bg-emerald-100 dark:bg-emerald-900/30"],
                      ["平均评分", "4.8", "bg-amber-100 dark:bg-amber-900/30"],
                    ].map(([label, value, bg]) => (
                      <div key={label} className="rounded-lg bg-muted/30 p-2.5">
                        <div className="text-[9px] text-muted-foreground/60">{label}</div>
                        <div className={`text-sm font-bold mt-0.5 ${bg} inline-block px-1.5 py-0.5 rounded`}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent activity label */}
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-medium text-foreground/70">最近生成</div>
                    <div className="flex-1 h-px bg-border/30" />
                    <div className="text-[8px] text-muted-foreground/40">查看全部 →</div>
                  </div>

                  {/* Product cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        name: "无线蓝牙耳机",
                        platform: "Amazon",
                        platformClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                        type: "标题",
                        typeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                        status: "已完成",
                        statusClass: "text-emerald-600 dark:text-emerald-400",
                      },
                      {
                        name: "瑜伽运动套装",
                        platform: "Shopify",
                        platformClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
                        type: "描述",
                        typeClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
                        status: "已完成",
                        statusClass: "text-emerald-600 dark:text-emerald-400",
                      },
                      {
                        name: "便携充电宝",
                        platform: "Amazon",
                        platformClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                        type: "要点",
                        typeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                        status: "生成中",
                        statusClass: "text-amber-600 dark:text-amber-400",
                      },
                      {
                        name: "智能手表表带",
                        platform: "TikTok",
                        platformClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
                        type: "场景图",
                        typeClass: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
                        status: "已完成",
                        statusClass: "text-emerald-600 dark:text-emerald-400",
                      },
                    ].map((card) => (
                      <div
                        key={card.name}
                        className="rounded-lg border border-border/20 bg-muted/15 p-2.5 space-y-1.5 hover:border-primary/25 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${card.platformClass}`}>
                            {card.platform}
                          </div>
                          <div className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${card.typeClass}`}>
                            {card.type}
                          </div>
                        </div>
                        <div className="text-[10px] font-medium text-foreground/80 truncate">
                          {card.name}
                        </div>
                        <div className="text-[8px] text-muted-foreground/50 line-clamp-2 leading-relaxed">
                          {card.name === "无线蓝牙耳机"
                            ? "Premium Wireless Bluetooth 5.3..."
                            : card.name === "瑜伽运动套装"
                              ? "柔软亲肤面料，透气速干..."
                              : card.name === "便携充电宝"
                                ? "20000mAh 大容量..."
                                : "柔软硅胶材质，兼容多款..."
                          }
                        </div>
                        <div className="flex items-center justify-between pt-0.5">
                          <span className={`text-[8px] font-medium ${card.statusClass}`}>
                            {card.status === "生成中" ? (
                              <span className="flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                                {card.status}
                              </span>
                            ) : (
                              card.status
                            )}
                          </span>
                          <span className="text-[7px] text-muted-foreground/30">2 分钟前</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/10">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {["bg-primary/30", "bg-cyan-500/30", "bg-emerald-500/30"].map((c) => (
                          <div key={c} className={`size-4 rounded-full ${c} ring-1 ring-background`} />
                        ))}
                      </div>
                      <span className="text-[8px] text-muted-foreground/40">团队协作中</span>
                    </div>
                    <div className="h-5 w-16 rounded-md bg-primary/15 flex items-center justify-center">
                      <span className="text-[7px] text-primary/60 font-medium">同步成功 ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle shadow card behind mockup */}
              <div className="absolute -bottom-3 -right-3 -z-10 size-full rounded-2xl border border-border/15 bg-muted/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
