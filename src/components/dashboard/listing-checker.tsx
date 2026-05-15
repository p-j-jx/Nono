"use client"

import { useMemo } from "react"
import {
  type CheckSeverity,
  type CheckResult,
  type QualityReport,
  checkListing,
} from "@/lib/listing-checker"

// ─── Props ──────────────────────────────────────────────────────

type ListingCheckerProps = {
  platform: string
  contentType: string
  content: string
  keywords?: string | null
  brandName?: string | null
  sellingPoints?: string | null
  bannedWords?: string | null
}

// ─── Helpers ────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return "var(--color-success, oklch(0.72 0.19 142))"
  if (score >= 60) return "var(--color-warning, oklch(0.80 0.18 84))"
  return "var(--color-destructive, oklch(0.63 0.24 29))"
}

function scoreTextClass(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400"
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
  return "text-red-600 dark:text-red-400"
}

const SEVERITY_ICON: Record<CheckSeverity, string> = {
  pass: "✓",
  warn: "⚠",
  fail: "✗",
}

const SEVERITY_CLASS: Record<CheckSeverity, string> = {
  pass: "text-green-600 dark:text-green-400",
  warn: "text-yellow-600 dark:text-yellow-400",
  fail: "text-red-600 dark:text-red-400",
}

const BAR_CLASS: Record<CheckSeverity, string> = {
  pass: "bg-green-500",
  warn: "bg-yellow-500",
  fail: "bg-red-500",
}

// ─── Score Circle ───────────────────────────────────────────────

function ScoreCircle({
  score,
  size = 80,
}: {
  score: number
  size?: number
}) {
  const stroke = size < 50 ? 3 : 6
  const r = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - score / 100)
  const color = scoreColor(score)
  const fontSize = size < 50 ? "text-[10px]" : "text-lg"

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-muted-foreground/15"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <span
        className={`absolute font-semibold ${fontSize} ${scoreTextClass(score)}`}
      >
        {score}
      </span>
    </div>
  )
}

// ─── Check Row ──────────────────────────────────────────────────

function CheckRow({ check }: { check: CheckResult }) {
  const hasBar =
    check.value !== undefined && check.limit !== undefined && check.limit > 0
  const ratio = hasBar ? Math.min(check.value! / check.limit!, 1) : 0

  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex items-start gap-2">
        <span className={`shrink-0 font-mono text-sm ${SEVERITY_CLASS[check.severity]}`}>
          {SEVERITY_ICON[check.severity]}
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground">
            {check.label}
          </span>
          <p className="text-xs text-muted-foreground">{check.message}</p>
        </div>
      </div>
      {hasBar && (
        <div className="ml-6 h-1.5 w-full max-w-48 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${BAR_CLASS[check.severity]}`}
            style={{
              width: `${Math.round(ratio * 100)}%`,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Summary helpers ────────────────────────────────────────────

function countBySeverity(checks: CheckResult[]) {
  let pass = 0
  let warn = 0
  let fail = 0
  for (const c of checks) {
    if (c.severity === "pass") pass++
    else if (c.severity === "warn") warn++
    else fail++
  }
  return { pass, warn, fail }
}

// ─── Main component ─────────────────────────────────────────────

export default function ListingChecker(props: ListingCheckerProps) {
  const report: QualityReport = useMemo(
    () =>
      checkListing({
        platform: props.platform,
        contentType: props.contentType,
        content: props.content,
        keywords: props.keywords,
        brandName: props.brandName,
        sellingPoints: props.sellingPoints,
        bannedWords: props.bannedWords,
      }),
    [
      props.platform,
      props.contentType,
      props.content,
      props.keywords,
      props.brandName,
      props.sellingPoints,
      props.bannedWords,
    ],
  )

  const { pass, warn, fail } = countBySeverity(report.checks)

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <ScoreCircle score={report.score} />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            内容质量评分
          </span>
          <span className="text-xs text-muted-foreground">
            {pass} 通过 · {warn} 警告 · {fail} 失败
          </span>
        </div>
      </div>

      {/* Check list */}
      {report.checks.length > 0 && (
        <div className="divide-y divide-border">
          {report.checks.map((check) => (
            <CheckRow key={check.id} check={check} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Compact variant ────────────────────────────────────────────

export function ListingCheckerCompact(props: ListingCheckerProps) {
  const report: QualityReport = useMemo(
    () =>
      checkListing({
        platform: props.platform,
        contentType: props.contentType,
        content: props.content,
        keywords: props.keywords,
        brandName: props.brandName,
        sellingPoints: props.sellingPoints,
        bannedWords: props.bannedWords,
      }),
    [
      props.platform,
      props.contentType,
      props.content,
      props.keywords,
      props.brandName,
      props.sellingPoints,
      props.bannedWords,
    ],
  )

  const { pass, warn, fail } = countBySeverity(report.checks)

  return (
    <div className="inline-flex items-center gap-2.5">
      <ScoreCircle score={report.score} size={36} />
      <span className="text-xs text-muted-foreground">
        {pass} 通过 · {warn} 警告 · {fail} 失败
      </span>
    </div>
  )
}
