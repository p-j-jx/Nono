import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    const { apiKey, apiKeyProvider } = await req.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        apiKey: apiKey || null,
        apiKeyProvider: apiKeyProvider || "deepseek",
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "保存失败" }, { status: 500 })
  }
}
