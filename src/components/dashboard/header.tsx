"use client"

import { useTheme } from "next-themes"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  Moon,
  Sun,
  History,
  LogOut,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "./sidebar-context"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const router = useRouter()
  const { open, toggle } = useSidebar()

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center justify-between px-4 sm:px-6">
        {/* Left: mobile hamburger + mobile logo */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden -ml-1.5"
            onClick={toggle}
            aria-label={open ? "关闭菜单" : "打开菜单"}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          {/* Mobile logo (desktop logo is in sidebar) */}
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-3" />
            </div>
            <span className="text-sm font-bold">
              AI<span className="text-primary">跨境通</span>
            </span>
          </Link>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="切换主题"
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-full hover:bg-muted transition-colors outline-none">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">{session?.user?.name || "用户"}</div>
                <div className="text-xs text-muted-foreground font-normal">
                  {session?.user?.email}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <User className="size-4" />
                工作台
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/history")}>
                <History className="size-4" />
                历史记录
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="size-4" />
                设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="size-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
