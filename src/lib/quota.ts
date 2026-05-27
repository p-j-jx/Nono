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
 * 计入：GenerationRecord（内容生成）+ AnalysisRecord（税务等分析）
 * 不计入：规则引擎类（竞品分析、质量检测、完整度评分）
 */
export async function checkMonthlyQuota(
  userId: string
): Promise<QuotaResult> {
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

  const used = generations + analyses
  const remaining = Math.max(MONTHLY_QUOTA - used, 0)

  return {
    allowed: used < MONTHLY_QUOTA,
    used,
    limit: MONTHLY_QUOTA,
    remaining,
  }
}
