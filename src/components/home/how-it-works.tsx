import { ScrollAnimate } from "@/components/scroll-animate"

const steps = [
  {
    num: "01",
    title: "填写产品信息",
    description: "输入产品名称、品类、卖点和关键词",
  },
  {
    num: "02",
    title: "选择平台与语言",
    description: "选择目标平台和输出语言",
  },
  {
    num: "03",
    title: "AI 智能生成",
    description: "一键生成文案和图片，多版本可选",
  },
  {
    num: "04",
    title: "导出使用",
    description: "复制或下载，直接用于店铺运营",
  },
]

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-t border-border/30 bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              简单四步，快速上手
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              从产品信息到成品内容，全程自动化
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid gap-px md:grid-cols-4 rounded-2xl border border-border/50 bg-border/50 overflow-hidden">
          {steps.map((step, i) => (
            <ScrollAnimate key={step.num} delay={i * 100}>
              <div className="bg-card p-8 h-full">
                <span className="text-3xl font-bold text-primary/25 tabular-nums">
                  {step.num}
                </span>
                <h3 className="mt-3 text-[15px] font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  )
}
