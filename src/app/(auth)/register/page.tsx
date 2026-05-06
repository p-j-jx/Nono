"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const name = form.get("name") as string
    const email = form.get("email") as string
    const password = form.get("password") as string
    const confirmPassword = form.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("两次输入的密码不一致")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error("密码至少需要6个字符")
      setLoading(false)
      return
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "注册失败")
      setLoading(false)
      return
    }

    toast.success("注册成功！请登录")
    router.push("/login")
  }

  return (
    <div className="w-full max-w-sm animate-scale-in">
      <div className="rounded-2xl border border-border/40 bg-card/95 backdrop-blur-sm p-8 shadow-xl shadow-black/5">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/20">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">创建账户</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            注册后即可免费使用所有功能
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              placeholder="你的名字"
              autoComplete="name"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              autoComplete="email"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="至少6个字符"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-11 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="再次输入密码"
              required
              minLength={6}
              autoComplete="new-password"
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "注册中..." : "创建账户"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          已有账户？{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            登录
          </Link>
        </p>
      </div>
    </div>
  )
}
