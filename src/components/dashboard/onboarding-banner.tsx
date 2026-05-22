"use client"

import { useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Plus, X, ArrowRight, Loader2, Pencil, Wand2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const DISMISS_KEY = "onboarding-banner-dismissed"

// Subscribe to localStorage changes so a dismiss in one tab is reflected elsewhere
function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getDismissedSnapshot() {
  return localStorage.getItem(DISMISS_KEY) === "1"
}

// During SSR localStorage is unavailable. Default to "dismissed" so nothing
// flashes before hydration; the client snapshot will reveal it if needed.
function getDismissedServerSnapshot() {
  return true
}

export function OnboardingBanner({ hasProjects }: { hasProjects: boolean }) {
  const router = useRouter()
  const dismissedFromStorage = useSyncExternalStore(
    subscribeStorage,
    getDismissedSnapshot,
    getDismissedServerSnapshot
  )
  const [locallyDismissed, setLocallyDismissed] = useState(false)
  const [creatingDemo, setCreatingDemo] = useState(false)

  const dismissed = dismissedFromStorage || locallyDismissed

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1")
    setLocallyDismissed(true)
  }

  async function handleCreateDemo() {
    if (creatingDemo) return
    setCreatingDemo(true)
    try {
      const res = await fetch("/api/projects/demo", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "创建失败")
      }
      if (data.existed) {
        toast.info("已找到你之前的 Demo 项目")
      } else {
        toast.success("Demo 项目已创建，4 条示例内容已就绪")
      }
      // Navigate to the demo project so user can immediately see what content looks like
      router.push(`/dashboard/${data.projectId}`)
      router.refresh()
    } catch (err) {
      console.error("Create demo project failed:", err)
      toast.error("创建 Demo 项目失败，请稍后再试")
    } finally {
      setCreatingDemo(false)
    }
  }

  if (dismissed || hasProjects) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.04] via-card to-card p-6 sm:p-7">
      {/* Decorative accent — subtle dot pattern in top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-44 rounded-full bg-primary/8 blur-3xl"
      />

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="关闭引导"
        className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="size-4" />
      </button>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="size-3" />
            新手引导
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          欢迎，3 步开始你的第一个跨境项目
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          先用 Demo 项目了解流程，或者直接创建你的真实项目
        </p>

        {/* 3 steps */}
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: Pencil,
              title: "填产品信息",
              desc: "产品名、卖点、目标平台",
              step: "01",
            },
            {
              icon: Wand2,
              title: "AI 自动生成",
              desc: "标题 · 五点 · 长描述 · SEO",
              step: "02",
            },
            {
              icon: Download,
              title: "导出上架",
              desc: "Amazon TSV / Shopify CSV",
              step: "03",
            },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.step}
                className="relative rounded-xl border border-border/50 bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-bold text-primary/50 tabular-nums">
                        {s.step}
                      </span>
                      <h3 className="text-sm font-semibold">{s.title}</h3>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={handleCreateDemo}
            disabled={creatingDemo}
            className="gap-2 h-11"
          >
            {creatingDemo ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                正在创建...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                试试 Demo 项目
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>

          <Link href="/dashboard/new" className="sm:order-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-2 h-11 w-full sm:w-auto"
            >
              <Plus className="size-4" />
              创建第一个项目
            </Button>
          </Link>

          <p className="hidden sm:block text-xs text-muted-foreground ml-auto self-center">
            点 Demo 立刻看到完整效果
          </p>
        </div>
      </div>
    </div>
  )
}
