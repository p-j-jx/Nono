"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  LayoutDashboard,
  FolderKanban,
  History,
  Star,
  Download,
  LayoutTemplate,
  Settings,
  Swords,
  ShieldCheck,
  Calculator,
  FileText,
  ImageIcon,
  Upload,
  Sparkles,
  X,
  CornerDownLeft,
} from "lucide-react"
import type { ComponentType } from "react"
import { cn } from "@/lib/utils"

type CommandItem = {
  id: string
  label: string
  description?: string
  icon: ComponentType<{ className?: string }>
  href: string
  /** Keywords for search matching (Chinese + English) */
  keywords?: string[]
  group: "navigate" | "create" | "tool"
}

const commands: CommandItem[] = [
  // Navigation
  { id: "dashboard", label: "仪表盘", icon: LayoutDashboard, href: "/dashboard", keywords: ["dashboard", "home", "首页", "工作台"], group: "navigate" },
  { id: "projects", label: "项目列表", icon: FolderKanban, href: "/dashboard/projects", keywords: ["projects", "list", "项目"], group: "navigate" },
  { id: "history", label: "历史记录", icon: History, href: "/dashboard/history", keywords: ["history", "记录", "历史"], group: "navigate" },
  { id: "favorites", label: "收藏内容", icon: Star, href: "/dashboard/favorites", keywords: ["favorites", "star", "收藏"], group: "navigate" },
  { id: "exports", label: "导出中心", icon: Download, href: "/dashboard/exports", keywords: ["exports", "export", "导出", "下载"], group: "navigate" },
  { id: "templates", label: "平台模板", icon: LayoutTemplate, href: "/dashboard/templates", keywords: ["templates", "模板"], group: "navigate" },
  { id: "settings", label: "个人设置", icon: Settings, href: "/dashboard/settings", keywords: ["settings", "设置", "账户", "account"], group: "navigate" },

  // Create
  { id: "new-project", label: "新建项目", description: "创建一个新的产品项目", icon: Plus, href: "/dashboard/new", keywords: ["new", "create", "新建", "创建"], group: "create" },
  { id: "copy", label: "文案生成", icon: FileText, href: "/dashboard/copy", keywords: ["copy", "text", "文案"], group: "create" },
  { id: "images", label: "图片生成", icon: ImageIcon, href: "/dashboard/images", keywords: ["images", "图片", "image"], group: "create" },
  { id: "batch", label: "批量生成", icon: Upload, href: "/dashboard/batch", keywords: ["batch", "bulk", "批量"], group: "create" },

  // Tools
  { id: "competitor", label: "竞品分析", description: "对比竞品关键词缺口", icon: Swords, href: "/dashboard/competitor", keywords: ["competitor", "竞品", "分析"], group: "tool" },
  { id: "quality", label: "质量检查", description: "Listing 合规性检测", icon: ShieldCheck, href: "/dashboard/quality", keywords: ["quality", "质量", "检查", "合规"], group: "tool" },
  { id: "tax", label: "税务计算", description: "跨境税率查询", icon: Calculator, href: "/dashboard/tax", keywords: ["tax", "税", "税务", "vat"], group: "tool" },
]

const groupLabels: Record<CommandItem["group"], string> = {
  create: "创建",
  navigate: "跳转",
  tool: "分析工具",
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Global keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    function handleOpenEvent() {
      setOpen(true)
    }
    window.addEventListener("keydown", handleKey)
    window.addEventListener("open-command-palette", handleOpenEvent)
    return () => {
      window.removeEventListener("keydown", handleKey)
      window.removeEventListener("open-command-palette", handleOpenEvent)
    }
  }, [])

  const closePalette = useCallback(() => {
    setOpen(false)
    setQuery("")
    setActiveIndex(0)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase().trim()
    return commands.filter((cmd) => {
      if (cmd.label.toLowerCase().includes(q)) return true
      if (cmd.description?.toLowerCase().includes(q)) return true
      if (cmd.keywords?.some((kw) => kw.toLowerCase().includes(q))) return true
      return false
    })
  }, [query])

  // Group results by group key, preserving order: create > tool > navigate
  const groupOrder: CommandItem["group"][] = ["create", "tool", "navigate"]
  const grouped = groupOrder
    .map((g) => ({ group: g, items: filtered.filter((c) => c.group === g) }))
    .filter((g) => g.items.length > 0)
  const flatList = grouped.flatMap((g) => g.items)

  const navigate = useCallback(
    (href: string) => {
      closePalette()
      router.push(href)
    },
    [router, closePalette]
  )

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, flatList.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const item = flatList[activeIndex]
        if (item) navigate(item.href)
      } else if (e.key === "Escape") {
        closePalette()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, activeIndex, flatList, navigate, closePalette])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-black/40 backdrop-blur-sm"
      onClick={() => closePalette()}
      role="dialog"
      aria-modal="true"
      aria-label="命令面板"
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0) // reset selection inline (avoid setState-in-effect)
            }}
            placeholder="搜索功能、跳转页面…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => closePalette()}
            aria-label="关闭"
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto py-2">
          {flatList.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Sparkles className="size-6 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">没有找到匹配的功能</p>
              <p className="mt-1 text-xs text-muted-foreground/70">试试搜索：项目、模板、税务、设置</p>
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.group}>
                <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {groupLabels[g.group]}
                </p>
                {g.items.map((item) => {
                  const flatIdx = flatList.indexOf(item)
                  const isActive = flatIdx === activeIndex
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        isActive ? "bg-primary/8" : "hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg shrink-0",
                          isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        )}
                      </div>
                      {isActive && (
                        <CornerDownLeft className="size-3.5 text-muted-foreground shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="border-t border-border/40 px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/20">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
              导航
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
              选择
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
              关闭
            </span>
          </div>
          <span className="text-muted-foreground/70">⌘K / Ctrl+K 唤起</span>
        </div>
      </div>
    </div>
  )
}
