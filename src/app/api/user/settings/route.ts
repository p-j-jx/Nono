import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    const { apiKey, apiKeyProvider, imageApiKey, name } = await req.json()

    const data: Record<string, unknown> = {
      apiKey: apiKey || null,
      apiKeyProvider: apiKeyProvider || "deepseek",
    }
    if (imageApiKey !== undefined) {
      data.imageApiKey = imageApiKey || null
    }
    if (name !== undefined) {
      data.name = name || null
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "保存失败" }, { status: 500 })
  }
}
