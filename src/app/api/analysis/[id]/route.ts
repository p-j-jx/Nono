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

  const record = await prisma.analysisRecord.findUnique({ where: { id } })
  if (!record || record.userId !== session.user.id) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 })
  }

  await prisma.analysisRecord.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
