import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import { MONTHLY_QUOTA } from "@/lib/quota"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  let user: {
    apiKey: string | null; apiKeyProvider: string; imageApiKey: string | null
    name: string | null; email: string; bonusQuota?: number
  } | null = null
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apiKey: true, apiKeyProvider: true, imageApiKey: true, name: true, email: true, bonusQuota: true },
    })
  } catch {
    // bonusQuota column may not exist yet
    const fallback = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apiKey: true, apiKeyProvider: true, imageApiKey: true, name: true, email: true },
    })
    if (fallback) user = { ...fallback, bonusQuota: 0 }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">设置</h1>
        <p className="text-sm text-muted-foreground mt-1">
          管理你的 API 密钥和账户设置
        </p>
      </div>

      <SettingsForm
        initialApiKey={user?.apiKey || ""}
        initialProvider={user?.apiKeyProvider || "deepseek"}
        initialImageApiKey={user?.imageApiKey || ""}
        initialName={user?.name || ""}
        email={user?.email || ""}
        bonusQuota={user?.bonusQuota ?? 0}
        monthlyQuota={MONTHLY_QUOTA}
      />
    </div>
  )
}
