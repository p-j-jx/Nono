import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params

  const record = await prisma.generationRecord.findUnique({
    where: { id },
    include: { project: { select: { userId: true } } },
  })

  if (!record || record.project.userId !== session.user.id) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 })
  }

  await prisma.generationRecord.delete({ where: { id } })

  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const { id } = await params

  const record = await prisma.generationRecord.findUnique({
    where: { id },
    include: { project: { select: { userId: true } } },
  })

  if (!record || record.project.userId !== session.user.id) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 })
  }

  try {
    const body = await req.json()
    const data: Record<string, unknown> = {}

    if (body.content !== undefined) {
      data.content = body.content
    }
    if (body.favorited !== undefined) {
      data.favorited = body.favorited
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "没有需要更新的字段" }, { status: 400 })
    }

    const updated = await prisma.generationRecord.update({
      where: { id },
      data,
    })

    return NextResponse.json({ record: updated })
  } catch {
    return NextResponse.json({ error: "更新记录失败" }, { status: 500 })
  }
}
