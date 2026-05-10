import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import { Database } from "lucide-react"
import { ExportsClient } from "./exports-client"
import { ExportCards } from "./export-cards"

export const dynamic = "force-dynamic"

export default async function ExportsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [projectCount, recordCount, imageCount, recentProjects] = await Promise.all([
    prisma.productProject.count({ where: { userId: session.user.id } }),
    prisma.generationRecord.count({
      where: { project: { userId: session.user.id } },
    }),
    prisma.generationRecord.count({
      where: {
        project: { userId: session.user.id },
        contentType: { in: ["mainImage", "sceneImage", "banner", "socialMediaImage", "promoPoster"] },
      },
    }),
    prisma.productProject.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, productName: true, platform: true, updatedAt: true },
    }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">导出中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          将你的内容导出为多种格式，方便发布和使用
        </p>
      </div>

      {/* Stats summary */}
      <div className="flex gap-4 mb-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Database className="size-3.5" />
          {projectCount} 个项目 · {recordCount} 条记录
        </span>
      </div>

      {/* Export cards with actions */}
      <ExportCards
        copyCount={recordCount - imageCount}
        imageCount={imageCount}
        projectCount={projectCount}
        recordCount={recordCount}
        projects={recentProjects.map((p) => ({
          ...p,
          updatedAt: p.updatedAt.toISOString(),
        }))}
      />

      {/* Export client with real data */}
      <ExportsClient
        projects={recentProjects.map((p) => ({
          ...p,
          updatedAt: p.updatedAt.toISOString(),
        }))}
        stats={{ projectCount, recordCount, imageCount }}
      />
    </div>
  )
}
