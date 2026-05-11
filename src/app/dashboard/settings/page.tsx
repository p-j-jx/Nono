import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { apiKey: true, apiKeyProvider: true, imageApiKey: true, name: true, email: true },
  })

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
      />
    </div>
  )
}
