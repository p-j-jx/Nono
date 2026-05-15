"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Plus,
  FileText,
  ImageIcon,
  Upload,
  FolderKanban,
  History,
  Star,
  Download,
  LayoutTemplate,
  Settings,
  Sparkles,
  Swords,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

const navSections = [
  {
    label: "总览",
    items: [
      { label: "仪表盘", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "内容生成",
    items: [
      { label: "新建项目", href: "/dashboard/new", icon: Plus },
      { label: "文案生成", href: "/dashboard/copy", icon: FileText },
      { label: "图片生成", href: "/dashboard/images", icon: ImageIcon },
      { label: "批量生成", href: "/dashboard/batch", icon: Upload },
    ],
  },
  {
    label: "分析工具",
    items: [
      { label: "竞品分析", href: "/dashboard/competitor", icon: Swords },
      { label: "质量检查", href: "/dashboard/quality", icon: ShieldCheck },
    ],
  },
  {
    label: "资产管理",
    items: [
      { label: "项目列表", href: "/dashboard/projects", icon: FolderKanban },
      { label: "历史记录", href: "/dashboard/history", icon: History },
      { label: "收藏内容", href: "/dashboard/favorites", icon: Star },
      { label: "导出中心", href: "/dashboard/exports", icon: Download },
    ],
  },
  {
    label: "模板中心",
    items: [
      { label: "平台模板", href: "/dashboard/templates", icon: LayoutTemplate },
    ],
  },
  {
    label: "设置",
    items: [
      { label: "个人设置", href: "/dashboard/settings", icon: Settings },
    ],
  },
]

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string
  icon: typeof LayoutDashboard
  label: string
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
      {active && (
        <div aria-hidden className="ml-auto size-1.5 rounded-full bg-primary" />
      )}
    </Link>
  )
}

function NavSection({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { open, close } = useSidebar()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex h-full flex-col py-4 px-3 gap-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 px-3" onClick={close}>
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="size-3.5" />
        </div>
        <span className="text-sm font-bold">
          AI<span className="text-primary">跨境通</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-5 overflow-y-auto">
        {navSections.map((section) => (
          <NavSection key={section.label} label={section.label}>
            {section.items.map((item) => (
              <NavLink
                key={item.href + item.label}
                {...item}
                active={isActive(item.href)}
                onClick={close}
              />
            ))}
          </NavSection>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 border-r border-border/40 bg-background/80 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="导航菜单"
        >
          <aside
            className="fixed inset-y-0 left-0 z-50 w-60 bg-background border-r border-border/40 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
