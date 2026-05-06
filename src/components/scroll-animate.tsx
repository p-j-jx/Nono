"use client"

import { useEffect, useRef, useState } from "react"

type AnimationVariant =
  | "fade-up"
  | "fade-in"
  | "fade-left"
  | "fade-right"
  | "scale-in"

interface ScrollAnimateProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  className?: string
  once?: boolean
}

const animations: Record<AnimationVariant, string> = {
  "fade-up": "animate-fade-up",
  "fade-in": "animate-fade-in",
  "fade-left": "animate-fade-left",
  "fade-right": "animate-fade-right",
  "scale-in": "animate-scale-in",
}

export function ScrollAnimate({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
  once = true,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? animations[variant] : "opacity-0"}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </div>
  )
}
