import { ScrollAnimate } from "@/components/scroll-animate"
import { ClipboardList, FileText, Wand2, Download } from "lucide-react"

const steps = [
  {
    title: "填写产品信息",
    description: "输入产品名称、品类、卖点和关键词等基本信息",
    icon: ClipboardList,
    color: "from-primary to-cyan-600",
    bgColor: "bg-primary/10",
    shadowColor: "shadow-primary/20",
  },
  {
    title: "选择平台与语言",
    description: "选择目标平台（Amazon/Shopify/TikTok）和目标语言",
    icon: FileText,
    color: "from-cyan-600 to-cyan-700",
    bgColor: "bg-cyan-500/10",
    shadowColor: "shadow-cyan-500/20",
  },
  {
    title: "AI 智能生成",
    description: "AI自动生成文案和图片，多版本供你选择",
    icon: Wand2,
    color: "from-primary to-cyan-600",
    bgColor: "bg-primary/10",
    shadowColor: "shadow-primary/20",
  },
  {
    title: "导出使用",
    description: "一键复制或下载生成内容，直接用于店铺运营",
    icon: Download,
    color: "from-teal-600 to-teal-700",
    bgColor: "bg-teal-500/10",
    shadowColor: "shadow-teal-500/20",
  },
]

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden border-t border-border/30 bg-muted/20 py-20 sm:py-28">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-14">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              使用流程
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              简单四步，快速上手
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              简单四步，快速生成专业的跨境运营内容
            </p>
          </div>
        </ScrollAnimate>

        <div className="relative grid gap-8 md:grid-cols-4">
          {/* Connecting Line (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/30 via-cyan-500/50 to-teal-500/30"
          />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <ScrollAnimate key={step.title} delay={index * 150}>
                <div className="relative text-center group">
                  {/* Step circle */}
                  <div className="relative mx-auto flex size-28 items-center justify-center mb-6">
                    {/* Outer ring */}
                    <div
                      className={`absolute inset-0 rounded-full ${step.bgColor} transition-all duration-500 group-hover:scale-110`}
                    />
                    {/* Icon container */}
                    <div
                      className={`relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white shadow-xl ${step.shadowColor} transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105`}
                    >
                      <Icon className="size-7" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold ring-2 ring-background">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="font-semibold text-[15px] mb-2 transition-colors duration-300 group-hover:text-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </ScrollAnimate>
            )
          })}
        </div>
      </div>
    </section>
  )
}
