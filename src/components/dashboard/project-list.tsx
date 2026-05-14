import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "./project-card"
import { Package, Plus, LayoutTemplate } from "lucide-react"

type ProjectListProject = {
  id: string
  productName: string
  platform: string
  language: string
  _count: { records: number }
  updatedAt: Date
}

export function ProjectList({ projects }: { projects: ProjectListProject[] }) {
  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center text-center py-16">
          <div className="size-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-6">
            <Package className="size-8 text-primary/50" />
          </div>
          <h3 className="text-base font-semibold mb-1">开始你的跨境之旅</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            创建第一个项目，AI 将为你生成适配多平台的商品文案和营销图片
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button render={<a href="/dashboard/new" />} className="gap-2">
              <Plus className="size-4" />
              创建项目
            </Button>
            <Button variant="outline" render={<a href="/dashboard/templates" />} className="gap-2">
              <LayoutTemplate className="size-4" />
              使用模板
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">项目列表</h2>
          <span className="text-[11px] text-muted-foreground">共 {projects.length} 个</span>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" render={<a href="/dashboard/new" />}>
          <Plus className="size-3.5" />
          新建项目
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            productName={project.productName}
            platform={project.platform}
            language={project.language}
            recordCount={project._count.records}
            updatedAt={project.updatedAt}
          />
        ))}
      </div>
    </div>
  )
}
