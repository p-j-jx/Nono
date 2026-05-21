import { ScrollAnimate } from "@/components/scroll-animate"

const stats = [
  {
    value: "3+",
    label: "覆盖主流电商平台",
    sub: "Amazon · Shopify · TikTok",
  },
  {
    value: "8",
    label: "支持输出语言",
    sub: "中英西德法日葡阿",
  },
  {
    value: "10s",
    label: "平均生成耗时",
    sub: "一次生成多平台版本",
  },
  {
    value: "100%",
    label: "可下载导出",
    sub: "Amazon TSV / Shopify CSV",
  },
]

export function Stats() {
  return (
    <section className="relative border-t border-border/30 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl border border-border/50 bg-border/50 overflow-hidden">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="bg-card p-6 sm:p-8 flex flex-col"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                  {s.value}
                </span>
                <span className="mt-2 text-sm font-medium text-foreground">
                  {s.label}
                </span>
                <span className="mt-1 text-xs text-muted-foreground/80">
                  {s.sub}
                </span>
              </div>
            ))}
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}
