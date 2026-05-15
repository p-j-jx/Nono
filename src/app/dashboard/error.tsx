"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react"

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="size-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold mb-2">页面加载出错了</h2>
      <p className="text-sm text-muted-foreground mb-1 max-w-sm">
        抱歉，加载此页面时遇到了问题。你可以尝试重新加载。
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground/60 mb-6 font-mono">
          错误代码: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Button onClick={() => unstable_retry()} className="gap-2">
          <RotateCcw className="size-4" />
          重试
        </Button>
        <Button variant="outline" className="gap-2" render={<a href="/dashboard" />}>
          <ArrowLeft className="size-4" />
          返回工作台
        </Button>
      </div>
    </div>
  )
}
