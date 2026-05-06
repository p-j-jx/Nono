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
import { Eye, EyeOff, Loader2, Check } from "lucide-react"
import { toast } from "sonner"

interface SettingsFormProps {
  initialApiKey: string
  initialProvider: string
}

export function SettingsForm({
  initialApiKey,
  initialProvider,
}: SettingsFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey)
  const [provider, setProvider] = useState(initialProvider)
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, apiKeyProvider: provider }),
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

  return (
    <div className="space-y-6">
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
          <CardTitle className="text-lg">关于 API 密钥</CardTitle>
          <CardDescription>
            <ul className="mt-2 space-y-2 text-sm list-disc list-inside">
              <li>密钥仅存储在数据库中，仅用于调用 AI 服务</li>
              <li>如不配置，系统将使用模拟数据展示功能</li>
              <li>你也可以在服务器 .env 文件中配置 DEEPSEEK_API_KEY 作为全局密钥</li>
              <li>用户配置的密钥优先级高于环境变量</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
