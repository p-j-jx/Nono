import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

/** POST /api/user/redeem — 用户兑换邀请码 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const rawCode = (body.code || "").trim().toUpperCase()

  if (!rawCode) {
    return NextResponse.json({ error: "请输入邀请码" }, { status: 400 })
  }

  // 查找邀请码
  const invite = await prisma.inviteCode.findUnique({
    where: { code: rawCode },
  })

  if (!invite) {
    return NextResponse.json({ error: "邀请码不存在" }, { status: 404 })
  }

  // 检查是否过期
  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "邀请码已过期" }, { status: 410 })
  }

  // 检查使用次数
  if (invite.usedCount >= invite.maxUses) {
    return NextResponse.json({ error: "邀请码已被使用完" }, { status: 410 })
  }

  // 事务：增加用户额度 + 更新邀请码使用次数
  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { bonusQuota: { increment: invite.bonusQuota } },
      select: { bonusQuota: true },
    }),
    prisma.inviteCode.update({
      where: { id: invite.id },
      data: { usedCount: { increment: 1 } },
    }),
  ])

  return NextResponse.json({
    success: true,
    message: `兑换成功！获得 ${invite.bonusQuota} 次额外额度`,
    bonusQuota: updatedUser.bonusQuota,
    added: invite.bonusQuota,
  })
}
