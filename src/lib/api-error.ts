/**
 * API 错误处理工具
 *
 * 把 fetch 调用返回的各种错误（HTTP 错误、网络错误、JSON 解析失败）
 * 转换成对用户友好的提示，并给出对应的恢复建议。
 */

import { toast } from "sonner"

export type ApiErrorKind =
  | "network"        // 网络断开 / 服务器不可达
  | "auth"           // 401 未登录或会话过期
  | "forbidden"      // 403 权限不足
  | "not_found"      // 404
  | "rate_limit"     // 429 限流
  | "server"         // 5xx 服务器错误
  | "validation"     // 400 参数错误
  | "quota"          // 用户配额用完
  | "unknown"

export type ApiError = {
  kind: ApiErrorKind
  message: string
  /** 服务端原始错误信息（如果有）*/
  raw?: string
  /** Retry-After 头的秒数，仅 rate_limit 有 */
  retryAfter?: number
  status?: number
}

/**
 * 解析 fetch Response，提取友好错误信息。
 * 即使 res.json() 失败也不会再抛错。
 */
export async function parseApiError(res: Response): Promise<ApiError> {
  const status = res.status

  // Try to extract server error message
  let raw: string | undefined
  try {
    const data = await res.json()
    raw = data?.error || data?.message
  } catch {
    // Response 不是 JSON，可能是 HTML 错误页或空响应
  }

  if (status === 401) {
    return {
      kind: "auth",
      message: "会话已过期，请重新登录",
      raw,
      status,
    }
  }
  if (status === 403) {
    return {
      kind: "forbidden",
      message: raw || "没有权限执行此操作",
      raw,
      status,
    }
  }
  if (status === 404) {
    return {
      kind: "not_found",
      message: raw || "请求的资源不存在",
      raw,
      status,
    }
  }
  if (status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") || "0", 10) || undefined
    return {
      kind: "rate_limit",
      message: retryAfter
        ? `请求过于频繁，请等 ${retryAfter} 秒后再试`
        : raw || "请求过于频繁，请稍后再试",
      raw,
      retryAfter,
      status,
    }
  }
  // 配额用完 — 服务端可能用 402 或专门提示
  if (raw && /quota|额度|配额/i.test(raw)) {
    return {
      kind: "quota",
      message: "本月免费额度已用完，请升级套餐或下月再试",
      raw,
      status,
    }
  }
  if (status >= 500) {
    return {
      kind: "server",
      message: "服务暂时不可用，我们正在排查",
      raw,
      status,
    }
  }
  if (status >= 400) {
    return {
      kind: "validation",
      message: raw || "请求参数有误",
      raw,
      status,
    }
  }
  return {
    kind: "unknown",
    message: raw || "未知错误",
    raw,
    status,
  }
}

/**
 * 包装 fetch 调用，统一处理网络错误。返回 [data, error]。
 * 失败时 data 为 null，error 为 ApiError；成功时 error 为 null。
 */
export async function safeFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<[T | null, ApiError | null]> {
  let res: Response
  try {
    res = await fetch(input, init)
  } catch (networkErr) {
    console.error("Network error:", networkErr)
    return [
      null,
      {
        kind: "network",
        message: "网络连接失败，请检查网络后重试",
      },
    ]
  }

  if (!res.ok) {
    const err = await parseApiError(res)
    return [null, err]
  }

  try {
    const data = (await res.json()) as T
    return [data, null]
  } catch (parseErr) {
    console.error("Response parse error:", parseErr)
    return [
      null,
      {
        kind: "unknown",
        message: "服务器返回数据格式异常",
      },
    ]
  }
}

/**
 * 显示错误 toast，根据错误类型自动决定是否带「重试」按钮。
 */
export function showApiErrorToast(
  err: ApiError,
  options?: {
    /** 操作上下文，用作 toast 标题前缀（如「生成失败」）*/
    title?: string
    /** 用户点击重试时执行的回调 */
    onRetry?: () => void
  }
) {
  const title = options?.title
  const fullMessage = title ? `${title}：${err.message}` : err.message

  // 这些错误重试无意义
  const noRetry: ApiErrorKind[] = ["auth", "forbidden", "not_found", "validation", "quota"]
  const canRetry = options?.onRetry && !noRetry.includes(err.kind)

  toast.error(fullMessage, {
    duration: err.kind === "rate_limit" ? 6000 : 4000,
    action: canRetry
      ? {
          label: "重试",
          onClick: options!.onRetry!,
        }
      : undefined,
  })
}
