import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Check } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/30 py-20 sm:py-28">
      {/* Background glow */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-primary/10 via-violet-500/10 to-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-emerald-800 px-6 py-16 sm:px-16 sm:py-20 lg:px-24 shadow-2xl shadow-primary/20">
          {/* Decorative elements */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 size-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 size-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04)_0%,transparent_60%)]" />
            {/* Grid dots */}
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0.5px,transparent_0.5px)] bg-[length:20px_20px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
              <Sparkles className="size-3.5" />
              立即开启 AI 运营之旅
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.15]">
              准备好提升你的<br />
              跨境运营效率了吗？
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
              注册即可免费使用，体验 AI 带来的效率革命
            </p>

            {/* Feature preview */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
              {["无需信用卡", "7 天免费试用", "随时取消"].map((feature) => (
                <span key={feature} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-white/40" />
                  {feature}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-base gap-2 w-full sm:w-auto bg-conversion text-conversion-foreground hover:bg-conversion/90 shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-300"
                render={<a href="/register" />}
              >
                免费开始使用
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-300"
                render={<Link href="/login" />}
              >
                登录账户
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
