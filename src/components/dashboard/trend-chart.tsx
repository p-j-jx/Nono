"use client"

import { useEffect, useState } from "react"

type DataPoint = { day: string; count: number }

export function TrendChart({ data }: { data: DataPoint[] }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { setAnimated(true) }, [])

  if (data.length === 0) return null

  const max = Math.max(...data.map((d) => d.count), 1)
  const w = 200
  const h = 48
  const p = 4 // padding

  const xs = data.map((_, i) => p + (i * (w - 2 * p)) / (data.length - 1))
  const ys = data.map((d) => h - p - ((d.count / max) * (h - 2 * p)))

  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  const areaD = `${pathD} L${xs[xs.length - 1].toFixed(1)},${h - p} L${xs[0].toFixed(1)},${h - p} Z`

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#trend-fill)" />
      <path
        d={pathD}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "trend-path-draw" : ""}
        style={{
          strokeDasharray: animated ? "none" : "1000",
          strokeDashoffset: animated ? 0 : 1000,
          transition: animated ? "stroke-dashoffset 1s ease" : "none",
        }}
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={xs[i]}
          cy={ys[i]}
          r={2}
          fill="hsl(var(--primary))"
          className={animated ? "trend-dot-appear" : ""}
          style={{
            opacity: animated ? 1 : 0,
            transition: `opacity 0.3s ease ${0.8 + i * 0.05}s`,
          }}
        />
      ))}
    </svg>
  )
}
