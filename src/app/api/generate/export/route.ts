import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const url = new URL(req.url)
  const type = url.searchParams.get("type")
  const projectId = url.searchParams.get("projectId")

  try {
    if (type === "copy") {
      const whereClause: Record<string, unknown> = {
        project: { userId: session.user.id },
        contentType: {
          in: ["title", "bulletPoints", "shortDesc", "longDesc", "adCopy", "seoKeywords", "videoScript", "brandStory"],
        },
      }
      if (projectId) {
        whereClause.projectId = projectId
      }

      const records = await prisma.generationRecord.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          project: { select: { productName: true } },
        },
      })

      const contentTypeLabels: Record<string, string> = {
        title: "商品标题",
        bulletPoints: "要点描述",
        shortDesc: "短描述",
        longDesc: "长描述",
        adCopy: "广告文案",
        seoKeywords: "SEO关键词",
        videoScript: "视频脚本",
        brandStory: "品牌故事",
      }

      const formatted = records.map((r) => ({
        projectName: r.project.productName,
        contentType: contentTypeLabels[r.contentType] || r.contentType,
        content: r.content || "",
      }))

      return NextResponse.json({ records: formatted, count: formatted.length })
    }

    return NextResponse.json({ error: "不支持的导出类型" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "导出失败" }, { status: 500 })
  }
}
