import Link from "next/link"
import type { ComponentType } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type EmptyStateAction = {
  label: string
  href?: string
  onClick?: () => void
  variant?: "default" | "outline"
  icon?: ComponentType<{ className?: string }>
}

type EmptyStateProps = {
  icon: ComponentType<{ className?: string }>
  title: string
  description?: string
  actions?: EmptyStateAction[]
  hint?: string
  /** When true, wraps content in a dashed Card. When false, renders inline (for embedding in existing cards). */
  card?: boolean
  /** Visual size — affects padding and icon scale. */
  size?: "sm" | "md" | "lg"
}

/**
 * Reusable empty state for when a page or section has no data yet.
 *
 * Designed to be inviting rather than apologetic — users see this most often
 * on their first day, so it must guide them toward a productive action.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions = [],
  hint,
  card = true,
  size = "md",
}: EmptyStateProps) {
  const paddingMap = {
    sm: "py-10",
    md: "py-16",
    lg: "py-20",
  }
  const iconWrapMap = {
    sm: "size-12 mb-4",
    md: "size-16 mb-5",
    lg: "size-20 mb-6",
  }
  const iconMap = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  }
  const titleMap = {
    sm: "text-sm font-semibold mb-1",
    md: "text-base font-semibold mb-1.5",
    lg: "text-lg font-semibold mb-2",
  }

  const content = (
    <div className={`flex flex-col items-center justify-center text-center ${paddingMap[size]} px-6`}>
      <div className={`rounded-2xl bg-primary/8 flex items-center justify-center text-primary/55 ${iconWrapMap[size]}`}>
        <Icon className={iconMap[size]} />
      </div>

      <h3 className={titleMap[size]}>{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {actions.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {actions.map((action, i) => {
            const ActionIcon = action.icon
            const inner = (
              <>
                {ActionIcon && <ActionIcon className="size-4" />}
                {action.label}
              </>
            )
            const buttonVariant = action.variant ?? (i === 0 ? "default" : "outline")

            if (action.href) {
              return (
                <Button
                  key={action.label}
                  variant={buttonVariant}
                  className="gap-2"
                  render={<Link href={action.href} />}
                >
                  {inner}
                </Button>
              )
            }

            return (
              <Button
                key={action.label}
                variant={buttonVariant}
                onClick={action.onClick}
                className="gap-2"
              >
                {inner}
              </Button>
            )
          })}
        </div>
      )}

      {hint && (
        <p className="mt-5 text-xs text-muted-foreground/70 max-w-sm">
          {hint}
        </p>
      )}
    </div>
  )

  if (!card) return content

  return (
    <Card className="border-dashed">
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  )
}
