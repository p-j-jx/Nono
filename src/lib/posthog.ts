/**
 * PostHog 客户端配置
 *
 * 环境变量：
 *   NEXT_PUBLIC_POSTHOG_KEY   — PostHog project API key
 *   NEXT_PUBLIC_POSTHOG_HOST  — PostHog 实例地址（默认 https://us.i.posthog.com）
 *
 * 注意：NEXT_PUBLIC_ 前缀意味着这些值会暴露到浏览器端，这是正常的，
 * PostHog 的 project key 本身就是公开的（类似 Google Analytics ID）。
 */

import posthog from "posthog-js"

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || ""
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

/** PostHog 是否已配置（key 非空） */
export const isPostHogEnabled = !!POSTHOG_KEY

/**
 * 初始化 PostHog（仅在浏览器端调用一次）
 */
export function initPostHog() {
  if (typeof window === "undefined") return
  if (!isPostHogEnabled) return
  if (posthog.__loaded) return // 防止重复初始化

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // 自动采集页面浏览
    capture_pageview: true,
    // 自动采集页面离开
    capture_pageleave: true,
    // Session replay（免费 5000 sessions/月）
    session_recording: {
      maskAllInputs: true,     // 遮蔽所有输入框（保护隐私）
      maskTextSelector: "[data-mask]", // 自定义遮蔽
    },
    // 性能：不加载 toolbar（节省带宽）
    loaded: (ph) => {
      // 开发环境关闭追踪
      if (process.env.NODE_ENV === "development") {
        ph.opt_out_capturing()
      }
    },
  })
}

/**
 * 识别用户（登录后调用）
 */
export function identifyUser(user: {
  id: string
  email?: string | null
  name?: string | null
}) {
  if (!isPostHogEnabled) return
  posthog.identify(user.id, {
    email: user.email || undefined,
    name: user.name || undefined,
  })
}

/**
 * 追踪自定义事件
 */
export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (!isPostHogEnabled) return
  posthog.capture(event, properties)
}

/**
 * 重置用户（登出时调用）
 */
export function resetUser() {
  if (!isPostHogEnabled) return
  posthog.reset()
}

export default posthog
