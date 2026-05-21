import { ScrollAnimate } from "@/components/scroll-animate"
import { Plus } from "lucide-react"

const faqs = [
  {
    q: "生成的文案是真的能直接用吗？还是只能当参考？",
    a: "可以直接用。我们针对每个平台的算法、字数限制和敏感词都做了规则适配，比如 Amazon 标题严格控制在 80-200 字符内，TikTok 短视频脚本会用钩子句开头。同时配套了质量检查工具，生成后会自动标出违禁词、长度问题和关键词覆盖率，确认无误再上架。",
  },
  {
    q: "AI 写出来的会不会「千篇一律」，多个产品看着都像？",
    a: "不会。系统会根据你填写的产品名、品类、卖点、品牌调性来生成，不同产品的输出风格差异很大。同一个产品也可以生成多个版本进行 A/B 测试，每次生成都会有不同的角度切入。",
  },
  {
    q: "支持哪些平台？只能用三个吗？",
    a: "目前深度优化的有 Amazon、Shopify、TikTok Shop 三大平台，覆盖了跨境电商 80% 以上的场景。eBay、Etsy、Walmart、AliExpress 也可以生成，但模板优化程度稍弱。后续会持续增加。",
  },
  {
    q: "我的产品资料、店铺信息会泄漏吗？数据安全怎么保证？",
    a: "所有项目数据存储在你的账户下，他人不可见。AI 调用过程不留存原文，生成完即释放。我们不会将你的产品数据用于训练任何模型，也不会用于商业分析。",
  },
  {
    q: "需要懂英文 / SEO / 平台规则才能用吗？",
    a: "完全不需要。这正是这个工具的价值——把「懂平台规则」和「会写英文营销文案」这两件事打包成了一键生成。你只需要懂自己的产品，剩下的交给 AI。",
  },
  {
    q: "和直接用 ChatGPT 写文案有什么区别？",
    a: "ChatGPT 是通用工具，每次都要重新告诉它「我要 Amazon 标题，不超过 200 字符，要包含关键词…」。我们把这些规则内置成了模板，一次配置长期使用；同时配套了项目管理、历史记录、质量检查、平台导出，是一套完整工作流，而不只是一个对话框。",
  },
  {
    q: "生成有次数限制吗？收费怎么算？",
    a: "目前处于免费内测阶段，注册即可使用全部功能。后续会推出免费版（每月有基础额度）和付费版（不限次 + 高级功能），早期用户会有专属优惠。",
  },
  {
    q: "能批量处理吗？我有几百个 SKU 要上架。",
    a: "可以以项目为单位管理多个 SKU，每个项目下记录所有生成版本和历史。批量导入和批量生成功能正在开发中，重度用户可以提前申请内测。",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="relative border-t border-border/30 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              常见问题
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              没找到答案？欢迎邮件联系我们
            </p>
          </div>
        </ScrollAnimate>

        <ScrollAnimate>
          <div className="rounded-2xl border border-border/50 bg-card divide-y divide-border/50 overflow-hidden">
            {faqs.map((item, i) => (
              <details
                key={i}
                className="group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none px-6 py-5 hover:bg-muted/30 transition-colors">
                  <span className="text-sm sm:text-[15px] font-medium text-foreground leading-relaxed">
                    {item.q}
                  </span>
                  <span className="shrink-0 mt-0.5 flex size-6 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                    <Plus className="size-3.5" />
                  </span>
                </summary>
                <div className="px-6 pb-5 -mt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="mt-10 text-center text-xs text-muted-foreground">
            还有其他问题？发邮件到{" "}
            <a
              href="mailto:hello@ai-cea.com"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              hello@ai-cea.com
            </a>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}
