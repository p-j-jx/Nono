import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Upload, History, LayoutTemplate, ArrowRight } from "lucide-react"

const actions = [
  {
    href: "/dashboard/new",
    icon: Plus,
    title: "新建项目",
    desc: "创建新的商品项目，AI 自动生成文案与图片",
  },
  {
    href: "/dashboard/new",
    icon: Upload,
    title: "批量导入",
    desc: "批量导入商品信息，快速生成多平台内容",
  },
  {
    href: "/history",
    icon: History,
    title: "查看历史",
    desc: "查看所有生成记录和收藏内容",
  },
  {
    href: "/dashboard/new",
    icon: LayoutTemplate,
    title: "智能模板",
    desc: "基于场景模板快速开始，推荐最佳配置",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.title} href={action.href}>
            <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 mb-3 group-hover:bg-primary/15 transition-colors">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-0.5">{action.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
                <div className="flex items-center gap-1 mt-2.5 text-xs font-medium text-primary/70 group-hover:text-primary transition-colors">
                  开始 <ArrowRight className="size-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
