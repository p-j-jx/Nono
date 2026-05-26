/**
 * 管理员权限检查工具
 *
 * 通过环境变量 ADMIN_EMAILS 控制谁能访问 /admin（逗号分隔多个）。
 * 在 Vercel Dashboard → Settings → Environment Variables 配置：
 *   ADMIN_EMAILS=your-email@example.com,another@example.com
 *
 * 之所以用 email 而非 user.role 字段，是为了避免给 DB 加列、
 * 避免在生产数据库上手动改 role 值。等真有 5+ 管理员时再升级。
 */

function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || ""
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  )
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return getAdminEmails().has(email.toLowerCase())
}

/** 仅供前端展示：是否启用了管理员（用于决定要不要在侧边栏渲染入口）*/
export function hasAdminConfigured(): boolean {
  return getAdminEmails().size > 0
}
