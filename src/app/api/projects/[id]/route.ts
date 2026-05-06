import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

const VALID_PLATFORMS = ["amazon", "shopify", "tiktok"]
const VALID_LANGUAGES = ["zh", "en", "es"]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.productProject.findUnique({
    where: { id },
  })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 })
  }

  return NextResponse.json({ project })
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.productProject.findUnique({
    where: { id },
  })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 })
  }

  try {
    const body = await req.json()
    const {
      productName,
      category,
      features,
      sellingPoints,
      keywords,
      useScenario,
      targetAudience,
      priceRange,
      brandTone,
      platform,
      language,
    } = body

    if (!productName?.trim()) {
      return NextResponse.json({ error: "产品名称不能为空" }, { status: 400 })
    }

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: "请选择有效的平台" }, { status: 400 })
    }

    if (!language || !VALID_LANGUAGES.includes(language)) {
      return NextResponse.json({ error: "请选择有效的语言" }, { status: 400 })
    }

    const updated = await prisma.productProject.update({
      where: { id },
      data: {
        productName: productName.trim(),
        category: category || null,
        features: features || null,
        sellingPoints: sellingPoints || null,
        keywords: keywords || null,
        useScenario: useScenario || null,
        targetAudience: targetAudience || null,
        priceRange: priceRange || null,
        brandTone: brandTone || null,
        platform,
        language,
      },
    })

    return NextResponse.json({ project: updated })
  } catch {
    return NextResponse.json({ error: "更新项目失败" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.productProject.findUnique({
    where: { id },
  })

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 })
  }

  await prisma.productProject.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
