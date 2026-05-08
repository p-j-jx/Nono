"use client"

import { useId } from "react"

interface SwitchProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function Switch({ id: externalId, checked, onCheckedChange, disabled }: SwitchProps) {
  const generatedId = useId()
  const id = externalId || generatedId

  return (
    <label
      htmlFor={id}
      className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </label>
  )
}
