import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Background — single warm glow, no clutter */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-background" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline — centered, confident, no badge */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] opacity-0 animate-fade-up">
          AI 驱动的
          <br />
          <span className="text-primary">跨境电商内容引擎</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-up animation-delay-200">
          一站式生成 Amazon、Shopify、TikTok Shop 商品文案与营销图片，
          中英西三语，助力品牌高效出海。
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up animation-delay-400">
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

        {/* Trust line — inline, minimal */}
        <p className="mt-10 text-xs text-muted-foreground/70 opacity-0 animate-fade-in animation-delay-600">
          Amazon · Shopify · TikTok Shop &nbsp;|&nbsp; 文案 · 图片 · SEO &nbsp;|&nbsp; 中 · 英 · 西
        </p>
      </div>
    </section>
  )
}
