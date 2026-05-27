import { Zap, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Free tier default fallback. The real value is passed as a prop from the
// server component (sourced from MONTHLY_QUOTA env var via lib/quota.ts).
export const DEFAULT_MONTHLY_QUOTA = 50

type UsageBarProps = {
  used: number
  quota?: number
  /** Optional breakdown for tooltip / hint */
  breakdown?: { generations: number; analyses: number }
}

export function UsageBar({
  used,
  quota = DEFAULT_MONTHLY_QUOTA,
  breakdown,
}: UsageBarProps) {
  const percentage = Math.min(Math.round((used / quota) * 100), 100)
  const remaining = Math.max(quota - used, 0)
  const isWarning = percentage >= 70 && percentage < 90
  const isDanger = percentage >= 90

  // Color states
  const barColor = isDanger
    ? "bg-red-500"
    : isWarning
    ? "bg-amber-500"
    : "bg-primary"

  const iconColor = isDanger
    ? "text-red-600 dark:text-red-400"
    : isWarning
    ? "text-amber-600 dark:text-amber-400"
    : "text-primary"

  const isExhausted = remaining === 0
  const message = isExhausted
    ? "本月额度已用完，生成功能暂停，下月自动恢复"
    : isDanger
    ? `本月额度即将用完，仅剩 ${remaining} 次`
    : isWarning
    ? `已用 ${percentage}%，请合理安排剩余 ${remaining} 次`
    : null

  return (
    <div className="rounded-xl border border-border/50 bg-card px-5 py-3.5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Zap className={cn("size-4 shrink-0", iconColor)} />
          <span className="text-sm font-medium">本月用量</span>
          {breakdown && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              · 生成 {breakdown.generations} 次
              {breakdown.analyses > 0 && ` · 分析 ${breakdown.analyses} 次`}
            </span>
          )}
        </div>
        <div className="text-sm shrink-0 tabular-nums">
          <span className="font-semibold text-foreground">{used}</span>
          <span className="text-muted-foreground"> / {quota}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`已使用 ${percentage}%`}
        />
      </div>

      {/* Warning message */}
      {message && (
        <div className={cn("mt-2.5 flex items-start gap-1.5 text-xs", iconColor)}>
          <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
