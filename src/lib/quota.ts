/**
 * 月度配额系统
 *
 * 每个用户每月有固定的 AI 调用次数限额。
 * 超出后 API 返回 403，前端展示"额度用完"。
 *
 * 通过环境变量 MONTHLY_QUOTA 可调整上限（默认 50）。
 * 等接入支付后，可从 User 表读取每人的套餐额度。
 */

import { prisma } from "@/db/prisma"
import { isAdminEmail } from "@/lib/admin"

/** 免费用户月度上限，可通过 MONTHLY_QUOTA 环境变量覆盖 */
export const MONTHLY_QUOTA = parseInt(process.env.MONTHLY_QUOTA || "50", 10)

export type QuotaResult = {
  allowed: boolean
  used: number
  limit: number
  remaining: number
}

/**
 * 检查用户本月是否还有剩余配额。
 *
 * - 管理员：无限额度，永远放行
 * - 普通用户：MONTHLY_QUOTA + bonusQuota（邀请码奖励）
 *
 * 计入：GenerationRecord（内容生成）+ AnalysisRecord（税务等分析）
 * 不计入：规则引擎类（竞品分析、质量检测、完整度评分）
 */
export async function checkMonthlyQuota(
  userId: string
): Promise<QuotaResult> {
  // 查用户信息（email 用于判断管理员，bonusQuota 用于额外额度）
  // bonusQuota 列可能还未迁移，用 try/catch 兜底
  let user: { email: string; bonusQuota?: number } | null = null
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, bonusQuota: true },
    })
  } catch {
    // bonusQuota column missing — fall back to email-only query
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    }) as { email: string; bonusQuota?: number } | null
  }

  // 管理员无限额度
  if (user && isAdminEmail(user.email)) {
    return { allowed: true, used: 0, limit: Infinity, remaining: Infinity }
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [generations, analyses] = await Promise.all([
    prisma.generationRecord.count({
      where: {
        project: { userId },
        createdAt: { gte: monthStart },
      },
    }),
    prisma.analysisRecord
      .count({
        where: {
          userId,
          createdAt: { gte: monthStart },
        },
      })
      .catch(() => 0),
  ])

  const bonus = user?.bonusQuota ?? 0
  const limit = MONTHLY_QUOTA + bonus
  const used = generations + analyses
  const remaining = Math.max(limit - used, 0)

  return {
    allowed: used < limit,
    used,
    limit,
    remaining,
  }
}
