import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

/**
 * POST /api/projects/[id]/clone
 *
 * Creates a one-click duplicate of an existing project.
 * - All product info fields copied verbatim
 * - productName gets a "(副本)" suffix (or "(副本 N)" if there are duplicates)
 * - Generation records are NOT copied — user gets a fresh content slate
 *
 * This is the cross-border-seller equivalent of "Save As" — they typically
 * manage many similar SKUs and shouldn't have to refill 20 fields each time.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params

  // Find source project and verify ownership
  const source = await prisma.productProject.findUnique({
    where: { id },
  })

  if (!source || source.userId !== session.user.id) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 })
  }

  // Determine the suffixed name. If "副本" already exists, increment.
  let newName = `${source.productName} (副本)`
  const existingCount = await prisma.productProject.count({
    where: {
      userId: session.user.id,
      productName: { startsWith: `${source.productName} (副本` },
    },
  })
  if (existingCount > 0) {
    newName = `${source.productName} (副本 ${existingCount + 1})`
  }

  try {
    const cloned = await prisma.productProject.create({
      data: {
        userId: session.user.id,
        productName: newName,
        // Copy all product info verbatim
        category: source.category,
        features: source.features,
        sellingPoints: source.sellingPoints,
        keywords: source.keywords,
        useScenario: source.useScenario,
        targetAudience: source.targetAudience,
        priceRange: source.priceRange,
        brandTone: source.brandTone,
        platform: source.platform,
        language: source.language,
        // Advanced info
        brandName: source.brandName,
        material: source.material,
        specifications: source.specifications,
        targetCountry: source.targetCountry,
        painPoints: source.painPoints,
        competitiveAdvantages: source.competitiveAdvantages,
        festivalScenario: source.festivalScenario,
        // Style preferences
        copyStyle: source.copyStyle,
        bannedWords: source.bannedWords,
        isPromotional: source.isPromotional,
        isBrandFocused: source.isBrandFocused,
        visualStyle: source.visualStyle,
        generationIntensity: source.generationIntensity,
        // Intentionally NOT cloning: records (clean content slate)
      },
    })

    return NextResponse.json({
      message: "项目已复制",
      project: cloned,
      projectId: cloned.id,
    })
  } catch (err) {
    console.error("[Projects/clone] Failed to clone project:", err)
    return NextResponse.json({ error: "复制项目失败" }, { status: 500 })
  }
}
