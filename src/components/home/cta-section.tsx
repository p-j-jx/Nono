import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 sm:px-16 sm:py-20 lg:px-24">
          {/* Subtle texture */}
          <div aria-hidden className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0.5px,transparent_0.5px)] bg-[length:24px_24px]" />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
              准备好提升
              <br />
              跨境运营效率了吗？
            </h2>

            <p className="mt-5 text-base sm:text-lg text-primary-foreground/70 max-w-lg mx-auto leading-relaxed">
              注册即可免费使用，体验 AI 带来的效率革命
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/60">
              {["无需信用卡", "7 天免费试用", "随时取消"].map((feature) => (
                <span key={feature} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-primary-foreground/40" />
                  {feature}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-base gap-2 w-full sm:w-auto bg-conversion text-conversion-foreground hover:bg-conversion/90 shadow-lg shadow-black/15 transition-all duration-300"
                render={<a href="/register" />}
              >
                免费开始使用
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base w-full sm:w-auto border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/40 transition-all duration-300"
                render={<a href="/login" />}
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
