"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Moon, Sparkles, Sun, X, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "首页", href: "/" },
  { label: "功能", href: "/#features" },
  { label: "价格", href: "/pricing" },
  { label: "关于", href: "/#about" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm shadow-black/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            AI<span className="text-primary">跨境通</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
          {session ? (
            <Button render={<Link href="/dashboard" />} className="gap-2">
              <LayoutDashboard className="size-4" />
              进入工作台
            </Button>
          ) : (
            <>
              <Button variant="outline" render={<Link href="/login" />}>
                登录
              </Button>
              <Button render={<Link href="/register" />}>
                免费注册
              </Button>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/40 md:hidden animate-slide-down">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/40 pt-2">
              {session ? (
                <Button render={<Link href="/dashboard" onClick={() => setOpen(false)} />} className="w-full gap-2">
                  <LayoutDashboard className="size-4" />
                  进入工作台
                </Button>
              ) : (
                <>
                  <Button variant="outline" render={<Link href="/login" />} className="w-full">
                    登录
                  </Button>
                  <Button render={<Link href="/register" />} className="w-full">
                    免费注册
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
