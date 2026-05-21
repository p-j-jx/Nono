import { ScrollAnimate } from "@/components/scroll-animate"
import { Rocket, Users, Layers, Globe2 } from "lucide-react"

const cases = [
  {
    icon: Rocket,
    badge: "新品上架",
    title: "从 0 到 1 快速铺货",
    description:
      "新 SKU 当天就能完成全平台 Listing 准备。不再为了一个产品熬夜写文案、改五点描述、调 Backend Keywords。",
    bullets: [
      "10 秒生成多平台版本",
      "符合各平台字数与关键词规则",
      "直接导出 TSV / CSV 上架",
    ],
  },
  {
    icon: Users,
    badge: "中小卖家",
    title: "替代外包文案团队",
    description:
      "一个人完成原本需要 3-5 人协作的内容生产。把外包成本砍掉 80%，把时间还给真正赚钱的事。",
    bullets: [
      "不需要等翻译排期",
      "不需要反复改稿",
      "不需要支付按字数的费用",
    ],
  },
  {
    icon: Layers,
    badge: "多店铺运营",
    title: "一份信息，多店复用",
    description:
      "同一个产品同时铺到 Amazon US、UK、DE 店铺，每个站点的语言和文化差异 AI 自动处理。",
    bullets: [
      "多语言一键切换",
      "项目化管理，版本可追溯",
      "历史记录随时复用迭代",
    ],
  },
  {
    icon: Globe2,
    badge: "品牌出海",
    title: "国货品牌的英文表达",
    description:
      "把「性价比高」翻译成西方消费者听得懂的「value for money」。AI 懂的不只是语言，是文化语境。",
    bullets: [
      "避开机翻的尴尬腔",
      "符合目标市场的购买心理",
      "品牌故事自动本地化",
    ],
  },
]

export function UseCases() {
  return (
    <section className="relative border-t border-border/30 bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              四种典型场景，覆盖大多数运营痛点
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              不管你是个人卖家、跨境团队还是品牌方，都能找到对应的用法
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid gap-px sm:grid-cols-2 rounded-2xl border border-border/50 bg-border/50 overflow-hidden">
          {cases.map((c, i) => {
            const Icon = c.icon
            return (
              <ScrollAnimate key={c.title} delay={i * 80}>
                <div className="bg-card p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2.5">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {c.description}
                  </p>

                  <ul className="mt-auto space-y-2 pt-4 border-t border-border/40">
                    {c.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-xs text-foreground/75"
                      >
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimate>
            )
          })}
        </div>
      </div>
    </section>
  )
}
