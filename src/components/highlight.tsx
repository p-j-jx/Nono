interface HighlightProps {
  text: string
  query?: string
  className?: string
}

export function Highlight({ text, query, className = "" }: HighlightProps) {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-sm bg-primary/15 text-foreground px-0.5 -mx-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}
