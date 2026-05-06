"use client"

import { useTheme } from "next-themes"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Sparkles,
  Moon,
  Sun,
  LayoutDashboard,
  History,
  LogOut,
  User,
  Settings,
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

const navLinks = [
  { label: "工作台", href: "/dashboard", icon: LayoutDashboard },
  { label: "历史记录", href: "/history", icon: History },
]

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-3.5" />
            </div>
            <span className="text-sm font-bold">
              AI<span className="text-primary">跨境通</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={active || undefined}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active]:bg-muted data-[active]:text-foreground"
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
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
