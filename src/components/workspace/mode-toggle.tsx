"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, SlidersHorizontal, List } from "lucide-react"

const modes = [
  { value: "standard" as const, label: "标准模式", icon: LayoutDashboard },
  { value: "advanced" as const, label: "高级模式", icon: SlidersHorizontal },
  { value: "batch" as const, label: "批量模式", icon: List },
]

interface ModeToggleProps {
  value: "standard" | "advanced" | "batch"
  onChange: (mode: "standard" | "advanced" | "batch") => void
  disabled?: boolean
}

export function ModeToggle({ value, onChange, disabled }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-muted/30 p-0.5 gap-0.5">
      {modes.map((mode) => {
        const Icon = mode.icon
        const isActive = value === mode.value
        return (
          <Button
            key={mode.value}
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            disabled={disabled}
            onClick={() => onChange(mode.value)}
            className="gap-1.5 h-8 px-3 text-xs"
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{mode.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
