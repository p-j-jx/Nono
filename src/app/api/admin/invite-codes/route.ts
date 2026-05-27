import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdminEmail } from "@/lib/admin"
import { prisma } from "@/db/prisma"
import { nanoid } from "nanoid"

function adminGuard(email?: string | null) {
  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "仅管理员可操作" }, { status: 403 })
  }
  return null
}

/** GET /api/admin/invite-codes — 列出所有邀请码 */
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }
  const denied = adminGuard(session.user.email)
  if (denied) return denied

  const codes = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json({ codes })
}

/** POST /api/admin/invite-codes — 生成邀请码 */
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }
  const denied = adminGuard(session.user.email)
  if (denied) return denied

  const body = await req.json().catch(() => ({}))
  const bonusQuota = Math.max(1, Math.min(body.bonusQuota || 200, 10000))
  const maxUses = Math.max(1, Math.min(body.maxUses || 1, 9999))
  const count = Math.max(1, Math.min(body.count || 1, 50)) // 一次最多批量生成 50 个

  const created = []
  for (let i = 0; i < count; i++) {
    // 生成 8 位大写字母+数字的邀请码，易于输入
    const code = nanoid(8).toUpperCase()
    const record = await prisma.inviteCode.create({
      data: { code, bonusQuota, maxUses },
    })
    created.push(record)
  }

  return NextResponse.json({ codes: created })
}
