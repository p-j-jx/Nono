import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] via-transparent to-background" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/12 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.12] opacity-0 animate-fade-up">
              AI 驱动的
              <br />
              <span className="text-primary">跨境电商内容引擎</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed opacity-0 animate-fade-up animation-delay-200">
              一站式生成 Amazon、Shopify、TikTok Shop 商品文案与营销图片，中英西三语，助力品牌高效出海。
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start gap-4 opacity-0 animate-fade-up animation-delay-400">
              <Button
                size="lg"
                className="h-12 px-8 text-base gap-2 w-full sm:w-auto bg-conversion text-conversion-foreground hover:bg-conversion/90 shadow-lg shadow-conversion/25 transition-all duration-300"
                render={<a href="/register" />}
              >
                免费开始使用
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base w-full sm:w-auto"
                render={<a href="#features" />}
              >
                了解更多
              </Button>
            </div>

            <p className="mt-8 text-xs text-muted-foreground/70 opacity-0 animate-fade-in animation-delay-600">
              Amazon · Shopify · TikTok Shop &nbsp;|&nbsp; 文案 · 图片 · SEO &nbsp;|&nbsp; 中 · 英 · 西
            </p>
          </div>

          {/* Right: Product demo mockup */}
          <div className="hidden lg:block opacity-0 animate-fade-up animation-delay-300">
            <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/8 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 h-11 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-red-400/70" />
                  <div className="size-2.5 rounded-full bg-amber-400/70" />
                  <div className="size-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="text-[10px] text-muted-foreground/50 font-medium">AI 跨境通 — 内容生成</span>
                <div />
              </div>

              {/* Content area */}
              <div className="p-6 space-y-5">
                {/* Input row */}
                <div>
                  <div className="text-[11px] font-medium text-muted-foreground mb-2">产品名称</div>
                  <div className="h-9 rounded-lg border border-border/60 bg-background px-3 flex items-center">
                    <span className="text-sm text-foreground/80">无线蓝牙降噪耳机 Pro Max</span>
                  </div>
                </div>

                {/* Platform chips */}
                <div className="flex items-center gap-2">
                  {[
                    { name: "Amazon", color: "bg-platform-amazon-muted text-platform-amazon", active: true },
                    { name: "Shopify", color: "bg-platform-shopify-muted text-platform-shopify", active: true },
                    { name: "TikTok", color: "bg-platform-tiktok-muted text-platform-tiktok", active: false },
                  ].map((p) => (
                    <span
                      key={p.name}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium ${p.color} ${p.active ? "ring-1 ring-current/20" : "opacity-50"}`}
                    >
                      {p.active && <Check className="size-3" />}
                      {p.name}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border/40" />

                {/* Generated result preview */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Amazon 标题</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="size-3" /> 已生成
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5">
                    <p className="text-[12px] text-foreground/80 leading-relaxed font-medium">
                      Wireless Bluetooth 5.3 Headphones, Active Noise Cancelling Over-Ear, 40Hr Playtime, Hi-Res Audio, Foldable Design with Carrying Case
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">五点描述</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                      生成中...
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 space-y-2">
                    <div className="h-3 bg-muted-foreground/8 rounded w-full" />
                    <div className="h-3 bg-muted-foreground/8 rounded w-[85%]" />
                    <div className="h-3 bg-muted-foreground/6 rounded w-[60%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
