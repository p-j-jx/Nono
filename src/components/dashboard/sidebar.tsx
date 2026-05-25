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
  Calculator,
  PanelLeftClose,
  PanelLeftOpen,
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
      { label: "税务计算", href: "/dashboard/tax", icon: Calculator },
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
  collapsed,
  onClick,
}: {
  href: string
  icon: typeof LayoutDashboard
  label: string
  active: boolean
  collapsed: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && (
        <>
          <span>{label}</span>
          {active && (
            <div aria-hidden className="ml-auto size-1.5 rounded-full bg-primary" />
          )}
        </>
      )}
    </Link>
  )
}

function NavSection({
  children,
  label,
  collapsed,
}: {
  children: React.ReactNode
  label: string
  collapsed: boolean
}) {
  return (
    <div>
      {!collapsed && (
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          {label}
        </p>
      )}
      <div className={cn("space-y-0.5", collapsed && "pt-1")}>{children}</div>
    </div>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { open, close, collapsed, toggleCollapsed } = useSidebar()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  // Mobile drawer always shows expanded view regardless of desktop collapsed state
  function renderContent(forceExpanded = false) {
    const isCollapsed = forceExpanded ? false : collapsed
    return (
      <div className="flex h-full flex-col py-4 gap-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "justify-center px-2" : "px-6"
          )}
          onClick={close}
          title={isCollapsed ? "AI 跨境通" : undefined}
        >
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shrink-0">
            <Sparkles className="size-3.5" />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-bold">
              AI<span className="text-primary">跨境通</span>
            </span>
          )}
        </Link>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 flex flex-col gap-5 overflow-y-auto",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          {navSections.map((section) => (
            <NavSection key={section.label} label={section.label} collapsed={isCollapsed}>
              {section.items.map((item) => (
                <NavLink
                  key={item.href + item.label}
                  {...item}
                  active={isActive(item.href)}
                  collapsed={isCollapsed}
                  onClick={close}
                />
              ))}
            </NavSection>
          ))}
        </nav>

        {/* Collapse toggle — desktop only, hidden on mobile drawer */}
        {!forceExpanded && (
          <div className={cn("hidden lg:flex border-t border-border/40 pt-3", isCollapsed ? "px-2 justify-center" : "px-3 justify-end")}>
            <button
              type="button"
              onClick={toggleCollapsed}
              title={isCollapsed ? "展开侧栏 (Ctrl+B)" : "折叠侧栏 (Ctrl+B)"}
              className="inline-flex items-center justify-center gap-1.5 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <>
                  <PanelLeftClose className="size-4" />
                  <span className="text-xs">折叠</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:shrink-0 border-r border-border/40 bg-background/80 backdrop-blur-xl transition-[width] duration-200",
          collapsed ? "lg:w-16" : "lg:w-56"
        )}
      >
        {renderContent()}
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
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  )
}
