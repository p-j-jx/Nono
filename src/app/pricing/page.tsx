import { Navbar } from "@/components/home/navbar"
import { Footer } from "@/components/home/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "免费版",
    id: "free",
    price: "¥0",
    desc: "适合个人卖家体验",
    cta: "免费开始",
    href: "/register",
    highlighted: false,
    features: [
      "最多 3 个项目",
      "每个项目 10 次生成",
      "支持 Amazon / Shopify",
      "中文和英文内容生成",
      "基础文案模板",
    ],
  },
  {
    name: "专业版",
    id: "pro",
    price: "¥99",
    period: "/月",
    desc: "适合专业卖家团队",
    cta: "立即订阅",
    href: "/register",
    highlighted: true,
    features: [
      "无限项目",
      "无限生成次数",
      "支持所有平台（含 TikTok Shop）",
      "中 / 英 / 西三语支持",
      "高级文案模板",
      "AI 图片生成",
      "批量导出",
      "优先客服支持",
    ],
  },
  {
    name: "团队版",
    id: "team",
    price: "定制",
    desc: "适合中小型电商团队协作",
    cta: "联系我们",
    href: "/register",
    highlighted: false,
    features: [
      "专业版所有功能",
      "定制 AI 模型训练",
      "API 接口接入",
      "专属客户经理",
      "私有化部署可选",
      "SLA 保障",
    ],
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="pt-32 pb-16 px-4">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              简单透明的定价
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              选择最适合你的方案，助力你的跨境业务快速增长
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3 items-start">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl border transition-all duration-300 ${
                    tier.highlighted
                      ? "border-primary/50 shadow-xl shadow-primary/5 scale-105 lg:scale-110 hover:shadow-2xl hover:shadow-primary/10"
                      : "border-border/50 hover:shadow-lg hover:-translate-y-1"
                  } bg-card p-8`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-conversion px-3 py-1 text-xs font-semibold text-conversion-foreground">
                        最受欢迎
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">{tier.name}</h2>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-sm text-muted-foreground">
                          {tier.period}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tier.desc}
                    </p>
                  </div>

                  <Button
                    variant={tier.highlighted ? "default" : "outline"}
                    className="w-full mb-8"
                    size="lg"
                    render={<Link href={tier.href} />}
                  >
                    {tier.cta}
                  </Button>

                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-24 px-4 border-t border-border/40">
          <div className="mx-auto max-w-3xl pt-16">
            <h2 className="text-2xl font-bold text-center mb-10">
              常见问题
            </h2>
            <div className="space-y-8">
              {[
                {
                  q: "可以随时取消订阅吗？",
                  a: "是的，你可以随时取消订阅。取消后仍可使用到当前计费周期结束。",
                },
                {
                  q: "支持哪些支付方式？",
                  a: "目前支持支付宝、微信支付和银行卡支付。企业版支持对公转账。",
                },
                {
                  q: "免费版和专业版有什么区别？",
                  a: "免费版限制项目数和生成次数，适合体验；专业版无限制且包含 AI 图片生成等高级功能。",
                },
                {
                  q: "可以免费试用专业版吗？",
                  a: "我们提供 7 天免费试用，无需绑定支付方式即可体验全部专业版功能。",
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold mb-1">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
