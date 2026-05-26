import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isAdminEmail } from "@/lib/admin"
import { Shield } from "lucide-react"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")
  if (!isAdminEmail(session.user.email)) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Slim admin header with explicit warning */}
      <header className="sticky top-0 z-40 border-b border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex h-12 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold">管理后台</span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400">
              仅管理员可见
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← 返回工作台
            </Link>
            <span className="text-muted-foreground">
              {session.user.email}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
