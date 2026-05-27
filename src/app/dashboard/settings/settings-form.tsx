"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Loader2, Check, Ticket } from "lucide-react"
import { toast } from "sonner"
import { trackEvent } from "@/lib/posthog"

interface SettingsFormProps {
  initialApiKey: string
  initialProvider: string
  initialImageApiKey: string
  initialName: string
  email: string
  bonusQuota: number
  monthlyQuota: number
}

export function SettingsForm({
  initialApiKey,
  initialProvider,
  initialImageApiKey,
  initialName,
  email,
  bonusQuota: initialBonusQuota,
  monthlyQuota,
}: SettingsFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey)
  const [provider, setProvider] = useState(initialProvider)
  const [imageApiKey, setImageApiKey] = useState(initialImageApiKey)
  const [name, setName] = useState(initialName)
  const [showKey, setShowKey] = useState(false)
  const [showImageKey, setShowImageKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingAccount, setSavingAccount] = useState(false)
  const [savedAccount, setSavedAccount] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [redeeming, setRedeeming] = useState(false)
  const [bonusQuota, setBonusQuota] = useState(initialBonusQuota)

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, apiKeyProvider: provider, imageApiKey }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "保存失败")
      }

      setSaved(true)
      toast.success("设置已保存")
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败")
    } finally {
      setSaving(false)
    }
  }

  async function handleClear() {
    setApiKey("")
    setSaving(true)

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: "", apiKeyProvider: provider }),
      })

      if (!res.ok) throw new Error()

      toast.success("API 密钥已清除")
    } catch {
      toast.error("清除失败")
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveAccount() {
    setSavingAccount(true)
    setSavedAccount(false)

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "保存失败")
      }

      setSavedAccount(true)
      toast.success("账户信息已保存")
      setTimeout(() => setSavedAccount(false), 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败")
    } finally {
      setSavingAccount(false)
    }
  }

  async function handleRedeem() {
    if (!inviteCode.trim()) return
    setRedeeming(true)
    try {
      const res = await fetch("/api/user/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "兑换失败")
      setBonusQuota(data.bonusQuota)
      setInviteCode("")
      toast.success(data.message)
      trackEvent("invite_code_redeemed", { bonus: data.added })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "兑换失败")
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">账户信息</CardTitle>
          <CardDescription>管理你的账户基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">昵称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入昵称"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">邮箱地址不可修改</p>
          </div>
          <div className="pt-2">
            <Button onClick={handleSaveAccount} disabled={savingAccount} className="gap-2">
              {savingAccount ? (
                <Loader2 className="size-4 animate-spin" />
              ) : savedAccount ? (
                <Check className="size-4" />
              ) : null}
              {savingAccount ? "保存中..." : savedAccount ? "已保存" : "保存"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI API 密钥</CardTitle>
          <CardDescription>
            配置 AI 服务 API 密钥以启用真实内容生成。不配置时将使用模拟数据。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">API 提供商</Label>
            <Select
              value={provider}
              onValueChange={(value) => value && setProvider(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              从{" "}
              <a
                href="https://platform.deepseek.com/api_keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                platform.deepseek.com
              </a>{" "}
              获取你的 API 密钥
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API 密钥</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10 font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? "隐藏" : "显示"}
              >
                {showKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : saved ? (
                <Check className="size-4" />
              ) : null}
              {saving ? "保存中..." : saved ? "已保存" : "保存"}
            </Button>
            {apiKey && (
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={saving}
              >
                清除密钥
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">图片生成 API 密钥</CardTitle>
          <CardDescription>
            配置图片生成服务的 API 密钥（兼容 OpenAI Images API），用于生成商品主图、场景图、Banner 等。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageApiKey">API 密钥</Label>
            <div className="relative">
              <Input
                id="imageApiKey"
                type={showImageKey ? "text" : "password"}
                value={imageApiKey}
                onChange={(e) => setImageApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10 font-mono text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
                onClick={() => setShowImageKey(!showImageKey)}
                aria-label={showImageKey ? "隐藏" : "显示"}
              >
                {showImageKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              支持兼容 OpenAI Images API 的服务商。不配置时将使用服务器环境变量中的密钥。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ticket className="size-5 text-violet-500" />
            邀请码兑换
          </CardTitle>
          <CardDescription>
            输入邀请码获取额外月度生成额度。
            当前额度：{monthlyQuota} + {bonusQuota} 次/月
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="请输入邀请码"
              className="font-mono tracking-wider uppercase"
              maxLength={12}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRedeem()
              }}
            />
            <Button
              onClick={handleRedeem}
              disabled={redeeming || !inviteCode.trim()}
              className="shrink-0 gap-2"
            >
              {redeeming ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Ticket className="size-4" />
              )}
              兑换
            </Button>
          </div>
          {bonusQuota > 0 && (
            <p className="mt-3 text-sm text-green-600 dark:text-green-400">
              已通过邀请码获得 {bonusQuota} 次额外额度
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">关于 API 密钥</CardTitle>
          <CardDescription>密钥安全与优先级说明</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>密钥仅存储在数据库中，仅用于调用 AI 服务</li>
            <li>如不配置，系统将使用模拟数据展示功能</li>
            <li>也可在服务器 .env 文件中配置 DEEPSEEK_API_KEY 作为全局密钥</li>
            <li>用户配置的密钥优先级高于环境变量</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
