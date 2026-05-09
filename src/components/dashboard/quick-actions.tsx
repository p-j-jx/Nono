import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Upload, History, LayoutTemplate, ArrowRight } from "lucide-react"

const actions = [
  {
    href: "/dashboard/new",
    icon: Plus,
    title: "新建项目",
    desc: "创建新的商品项目，AI 自动生成文案与图片",
    gradient: "from-primary/20 to-cyan-500/20",
    iconBg: "from-primary to-cyan-500",
  },
  {
    href: "/dashboard/new",
    icon: Upload,
    title: "批量导入",
    desc: "批量导入商品信息，快速生成多平台内容",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconBg: "from-emerald-500 to-teal-500",
  },
  {
    href: "/history",
    icon: History,
    title: "查看历史",
    desc: "查看所有生成记录和收藏内容",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconBg: "from-amber-500 to-orange-500",
  },
  {
    href: "/dashboard/new",
    icon: LayoutTemplate,
    title: "智能模板",
    desc: "基于场景模板快速开始，推荐最佳配置",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconBg: "from-violet-500 to-purple-500",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <Link key={action.title} href={action.href}>
            <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer h-full opacity-0 animate-fade-up`} style={{ animationDelay: `${(i + 1) * 100}ms` }}>
              <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
              <CardContent className="relative p-5">
                <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.iconBg} ring-1 ring-inset ring-white/20 mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="size-6 text-white" />
                </div>
                <h3 className="text-base font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{action.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0">
                  开始 <ArrowRight className="size-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
