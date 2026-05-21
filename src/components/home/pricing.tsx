"use client"

import { useState } from "react"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Check, Sparkles, ArrowRight, Building2 } from "lucide-react"

type BillingCycle = "monthly" | "yearly"

const plans = [
  {
    name: "免费版",
    tagline: "体验完整能力",
    price: { monthly: 0, yearly: 0 },
    cta: "立即注册体验",
    highlight: false,
    features: [
      "每月 30 次内容生成",
      "支持 1 个产品项目",
      "单平台输出（任选其一）",
      "基础质量检查",
      "中英双语",
    ],
  },
  {
    name: "专业版",
    tagline: "个人卖家首选",
    price: { monthly: 39, yearly: 299 },
    cta: "免费试用 7 天",
    highlight: true,
    badge: "最受欢迎",
    features: [
      "每月 500 次内容生成",
      "10 个产品项目",
      "全部平台（Amazon · Shopify · TikTok）",
      "完整质量检查 + 竞品分析",
      "全部 8 种语言",
      "Amazon TSV / Shopify CSV 导出",
      "历史记录与版本管理",
    ],
  },
  {
    name: "团队版",
    tagline: "3-5 人协作运营",
    price: { monthly: 199, yearly: 1599 },
    cta: "免费试用 7 天",
    highlight: false,
    features: [
      "每月 3000 次内容生成",
      "不限产品项目",
      "3 个团队席位",
      "AI 商品图片生成（含 50 张/月）",
      "高级模型（GPT-4 级别）",
      "项目共享与权限管理",
      "优先客服支持",
    ],
  },
]

export function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>("yearly")

  return (
    <section id="pricing" className="relative border-t border-border/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary uppercase tracking-wider mb-4">
              <Sparkles className="size-3" />
              即将上线 · 注册即可锁定早鸟价
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              简单透明的定价
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              按月或按年订阅，随时取消，不绑定信用卡
            </p>
          </div>
        </ScrollAnimate>

        {/* Billing toggle */}
        <ScrollAnimate>
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border/50 bg-muted/30">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`relative inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  billing === "monthly"
                    ? "bg-card text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                按月付费
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  billing === "yearly"
                    ? "bg-card text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                按年付费
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  省 36%
                </span>
              </button>
            </div>
          </div>
        </ScrollAnimate>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-5 items-stretch">
          {plans.map((plan, i) => {
            const isFree = plan.price.monthly === 0
            const displayPrice = isFree
              ? 0
              : billing === "yearly"
              ? Math.round(plan.price.yearly / 12)
              : plan.price.monthly

            return (
              <ScrollAnimate key={plan.name} delay={i * 80}>
                <div
                  className={`relative rounded-2xl border bg-card h-full flex flex-col p-7 ${
                    plan.highlight
                      ? "border-primary/40 shadow-xl shadow-primary/5 ring-1 ring-primary/20"
                      : "border-border/50"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-md">
                        <Sparkles className="size-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name + tagline */}
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium text-muted-foreground">¥</span>
                      <span className="text-4xl font-bold tabular-nums tracking-tight">
                        {displayPrice}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {isFree ? "永久免费" : "/月"}
                      </span>
                    </div>
                    {!isFree && billing === "yearly" && (
                      <div className="mt-1.5 text-xs text-muted-foreground">
                        按年支付 ¥{plan.price.yearly}，
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          省 ¥{plan.price.monthly * 12 - plan.price.yearly}
                        </span>
                      </div>
                    )}
                    {!isFree && billing === "monthly" && (
                      <div className="mt-1.5 text-xs text-muted-foreground/70">
                        按月支付，随时取消
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href="/register"
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg h-10 px-4 text-sm font-medium transition-colors ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="size-3.5" />
                  </a>

                  {/* Features */}
                  <ul className="mt-7 space-y-3 border-t border-border/40 pt-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-foreground/85"
                      >
                        <span
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${
                            plan.highlight
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Check className="size-2.5" strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimate>
            )
          })}
        </div>

        {/* Enterprise strip */}
        <ScrollAnimate delay={300}>
          <div className="mt-8 rounded-2xl border border-border/50 bg-muted/20 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground/5">
              <Building2 className="size-5 text-foreground/70" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold mb-1">企业版 · 定制方案</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                适合大品牌、代运营公司、跨境电商 ERP 集成方。包含不限次生成、API 接入、专属客服、SLA 保障、白标定制等。
              </p>
            </div>
            <a
              href="mailto:hello@ai-cea.com?subject=企业版咨询"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background h-10 px-5 text-sm font-medium hover:bg-muted transition-colors shrink-0"
            >
              联系销售
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </ScrollAnimate>

        {/* Trust strip */}
        <ScrollAnimate delay={400}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              无需信用卡即可注册
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              内测期间所有套餐免费体验
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              早期用户享 7 折终身优惠
            </span>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}
