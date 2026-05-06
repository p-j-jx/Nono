import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/db/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要6个字符" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "注册失败，请稍后再试" },
      { status: 500 }
    )
  }
}
