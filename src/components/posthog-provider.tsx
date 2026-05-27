"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { initPostHog, identifyUser, isPostHogEnabled } from "@/lib/posthog"

/**
 * PostHog 全局 Provider
 *
 * 功能：
 * 1. 初始化 PostHog SDK
 * 2. 登录后自动识别用户
 * 3. SPA 路由切换时自动发送 pageview
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 初始化 PostHog
  useEffect(() => {
    initPostHog()
  }, [])

  // 用户登录后识别
  useEffect(() => {
    if (session?.user?.id) {
      identifyUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      })
    }
  }, [session?.user?.id, session?.user?.email, session?.user?.name])

  // SPA 路由变化时发送 pageview
  useEffect(() => {
    if (!isPostHogEnabled) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
    posthog.capture("$pageview", { $current_url: url })
  }, [pathname, searchParams])

  return <>{children}</>
}
