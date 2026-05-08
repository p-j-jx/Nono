import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

const STANDARD_FIELDS = [
  "productName", "category", "features", "sellingPoints", "keywords",
  "useScenario", "targetAudience", "priceRange", "brandTone", "platform", "language",
]

const ADVANCED_FIELDS = [
  "productName", "category", "brandName", "material", "specifications",
  "targetCountry", "features", "sellingPoints", "keywords", "useScenario",
  "targetAudience", "painPoints", "competitiveAdvantages", "festivalScenario",
  "priceRange", "brandTone", "copyStyle", "bannedWords", "platform", "language",
]

const CRITICAL_FIELDS = ["productName", "platform", "language"]

const TIPS_RULES: Array<{ check: (data: Record<string, unknown>) => boolean; tip: string }> = [
  { check: (d) => !!d.priceRange && !d.targetAudience, tip: "有价格区间但无目标人群，建议补充以提升文案精准度" },
  { check: (d) => !!d.features && !d.sellingPoints, tip: "有核心特点但无核心卖点，卖点更能促进转化" },
  { check: (d) => !!d.useScenario && !d.painPoints, tip: "有使用场景但无用户痛点，痛点营销更有效" },
  { check: (d) => !!d.productName && !d.brandName, tip: "建议填写品牌名称，有助于品牌化内容生成" },
  { check: (d) => d.platform === "amazon" && !d.keywords, tip: "Amazon平台关键词对搜索排名很重要，建议补充" },
  { check: (d) => d.platform === "tiktok" && !d.festivalScenario, tip: "TikTok营销结合节日活动效果更好" },
  { check: (d) => !d.productName, tip: "请填写产品名称以开始生成" },
  { check: (d) => !d.platform, tip: "请选择目标平台" },
]

function computeScore(data: Record<string, unknown>, mode: string) {
  const fields = mode === "advanced" ? ADVANCED_FIELDS : STANDARD_FIELDS
  const filled = fields.filter((f) => {
    const val = data[f]
    return val !== undefined && val !== null && val !== "" && val !== false
  })
  const missingCritical = CRITICAL_FIELDS.filter((f) => !filled.includes(f))
  const missingOptional = fields.filter(
    (f) => !filled.includes(f) && !CRITICAL_FIELDS.includes(f)
  )
  const tips = TIPS_RULES.filter((r) => r.check(data)).map((r) => r.tip)

  return {
    score: Math.round((filled.length / fields.length) * 100),
    total: fields.length,
    filled: filled.length,
    missingCritical,
    missingOptional,
    tips,
    mode,
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    const { projectId, mode } = await req.json()

    let data: Record<string, unknown>

    if (projectId) {
      const project = await prisma.productProject.findUnique({
        where: { id: projectId },
      })
      if (!project || project.userId !== session.user.id) {
        return NextResponse.json({ error: "项目不存在" }, { status: 404 })
      }
      data = project as unknown as Record<string, unknown>
    } else {
      // Accept data directly from the request body
      const body = await req.json()
      data = body.data || body
      // Remove non-field keys
      delete data.projectId
      delete data.mode
      delete data.data
    }

    const result = computeScore(data, mode || "standard")
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "评分失败" }, { status: 500 })
  }
}
