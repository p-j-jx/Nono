import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Upload, History, LayoutTemplate, ArrowRight } from "lucide-react"

const actions = [
  {
    href: "/dashboard/new",
    icon: Plus,
    title: "新建项目",
    desc: "AI 自动生成多平台商品文案与图片",
    gradient: "from-primary/10 to-violet-500/10",
    iconGradient: "from-primary to-violet-600",
    borderGlow: "group-hover:shadow-primary/10",
  },
  {
    href: "/dashboard/new?batch=true",
    icon: Upload,
    title: "批量导入",
    desc: "批量导入商品，快速生成多平台内容",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconGradient: "from-amber-500 to-orange-600",
    borderGlow: "group-hover:shadow-amber-500/10",
  },
  {
    href: "/history",
    icon: History,
    title: "查看历史",
    desc: "浏览所有生成记录和收藏内容",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconGradient: "from-emerald-500 to-teal-600",
    borderGlow: "group-hover:shadow-emerald-500/10",
  },
  {
    href: "/dashboard/new?template=true",
    icon: LayoutTemplate,
    title: "智能模板",
    desc: "基于场景模板快速开始，推荐最佳配置",
    gradient: "from-sky-500/10 to-blue-500/10",
    iconGradient: "from-sky-500 to-blue-600",
    borderGlow: "group-hover:shadow-sky-500/10",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.title} href={action.href}>
            <Card
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-transparent h-full ${action.borderGlow}`}
            >
              {/* Hover gradient overlay */}
              <div
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <CardContent className="p-5 relative">
                <div
                  className={`relative flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.iconGradient} mb-3 shadow-lg shadow-current/10 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="size-5 text-white" />
                  {/* Decorative ring */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"
                  />
                </div>
                <h3 className="text-sm font-semibold mb-0.5">{action.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
                  开始 <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
