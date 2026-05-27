"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Ticket,
  Plus,
  Copy,
  Check,
  Loader2,
  Clock,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type InviteCode = {
  id: string
  code: string
  bonusQuota: number
  maxUses: number
  usedCount: number
  createdAt: string
  expiresAt: string | null
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "刚刚"
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  return `${days} 天前`
}

export function InviteCodeManager() {
  const [codes, setCodes] = useState<InviteCode[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Generation form state
  const [bonusQuota, setBonusQuota] = useState("200")
  const [maxUses, setMaxUses] = useState("1")
  const [count, setCount] = useState("1")

  const loadCodes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/invite-codes")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCodes(data.codes || [])
    } catch {
      toast.error("加载邀请码列表失败")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCodes()
  }, [loadCodes])

  async function handleCreate() {
    setCreating(true)
    try {
      const res = await fetch("/api/admin/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bonusQuota: parseInt(bonusQuota) || 200,
          maxUses: parseInt(maxUses) || 1,
          count: parseInt(count) || 1,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const newCodes = data.codes as InviteCode[]
      setCodes((prev) => [...newCodes, ...prev])
      toast.success(`已生成 ${newCodes.length} 个邀请码`)
    } catch {
      toast.error("生成邀请码失败")
    } finally {
      setCreating(false)
    }
  }

  function handleCopy(code: string, id: string) {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success(`已复制: ${code}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border/40 px-5 py-3 flex items-center gap-2">
        <Ticket className="size-4 text-violet-500" />
        <h2 className="text-sm font-semibold">邀请码管理</h2>
        <span className="text-[11px] text-muted-foreground ml-auto">
          共 {codes.length} 个
        </span>
      </div>

      <CardContent className="p-5">
        {/* Create form */}
        <div className="flex flex-wrap items-end gap-3 mb-5">
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">额度/码</label>
            <Input
              type="number"
              min={1}
              max={10000}
              value={bonusQuota}
              onChange={(e) => setBonusQuota(e.target.value)}
              className="w-24 h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">可用次数</label>
            <Input
              type="number"
              min={1}
              max={9999}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="w-20 h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">生成数量</label>
            <Input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-20 h-8 text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={creating}
            className="h-8"
          >
            {creating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plus className="size-3.5" />
            )}
            <span className="ml-1.5">生成</span>
          </Button>
        </div>

        {/* Code list */}
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin mx-auto mb-2" />
            加载中...
          </div>
        ) : codes.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            还没有邀请码，点击上方「生成」按钮创建
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
            {codes.map((c) => {
              const exhausted = c.usedCount >= c.maxUses
              const expired = c.expiresAt && new Date(c.expiresAt) < new Date()
              return (
                <div
                  key={c.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    exhausted || expired
                      ? "bg-muted/50 opacity-60"
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  <code className="font-mono font-semibold tracking-wider text-[13px] shrink-0">
                    {c.code}
                  </code>
                  <span className="text-xs text-muted-foreground shrink-0">
                    +{c.bonusQuota} 次
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Users className="size-3" />
                    {c.usedCount}/{c.maxUses}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70 ml-auto shrink-0">
                    <Clock className="size-3" />
                    {relativeTime(c.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(c.code, c.id)}
                    className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                    title="复制邀请码"
                  >
                    {copiedId === c.id ? (
                      <Check className="size-3.5 text-green-500" />
                    ) : (
                      <Copy className="size-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
