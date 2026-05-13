import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Upload, History, LayoutTemplate, ArrowRight } from "lucide-react"

const actions = [
  {
    href: "/dashboard/new",
    icon: Plus,
    title: "新建项目",
    desc: "AI 自动生成多平台商品文案与图片",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    href: "/dashboard/batch",
    icon: Upload,
    title: "批量导入",
    desc: "批量导入商品，快速生成多平台内容",
    iconBg: "bg-platform-amazon-muted",
    iconColor: "text-platform-amazon",
  },
  {
    href: "/history",
    icon: History,
    title: "查看历史",
    desc: "浏览所有生成记录和收藏内容",
    iconBg: "bg-platform-shopify-muted",
    iconColor: "text-platform-shopify",
  },
  {
    href: "/dashboard/templates",
    icon: LayoutTemplate,
    title: "智能模板",
    desc: "基于场景模板快速开始，推荐最佳配置",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.title} href={action.href}>
            <Card className="group relative overflow-hidden transition-colors duration-200 hover:border-primary/20 h-full">
              <CardContent className="p-5 relative">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${action.iconBg} mb-3`}
                >
                  <Icon className={`size-5 ${action.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold mb-0.5">{action.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
                  开始 <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
