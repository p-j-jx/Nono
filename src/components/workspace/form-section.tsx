"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface FormSectionProps {
  title: string
  description?: string
  defaultExpanded?: boolean
  alwaysExpanded?: boolean
  children: React.ReactNode
}

export function FormSection({
  title,
  description,
  defaultExpanded = true,
  alwaysExpanded = false,
  children,
}: FormSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const isExpanded = alwaysExpanded || expanded

  return (
    <section className="rounded-xl border bg-card overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
        onClick={() => !alwaysExpanded && setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {!alwaysExpanded && (
          <div className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </div>
        )}
      </button>
      {isExpanded && <div className="px-5 pb-5">{children}</div>}
    </section>
  )
}
