import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import { Star, FileText, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FavoritesClient } from "./favorites-client"
import Link from "next/link"

export const dynamic = "force-dynamic"

const contentTypes = [
  { value: "copy", label: "收藏文案", types: ["title", "bulletPoints", "shortDesc", "longDesc", "adCopy", "seoKeywords", "brandStory"] },
  { value: "image", label: "收藏图片", types: ["mainImage", "sceneImage", "banner", "socialMediaImage", "promoPoster"] },
]

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { tab } = await searchParams
  const activeTab = tab === "image" ? "image" : "copy"
  const currentGroup = contentTypes.find((g) => g.value === activeTab)!

  const records = await prisma.generationRecord.findMany({
    where: {
      project: { userId: session.user.id },
      favorited: true,
      contentType: { in: currentGroup.types },
    },
    include: {
      project: { select: { productName: true, platform: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">收藏内容</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理和复用你收藏的优质文案和图片
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-0.5 rounded-lg bg-muted w-fit">
        {contentTypes.map((g) => {
          const isActive = activeTab === g.value
          const Icon = g.value === "copy" ? FileText : ImageIcon
          return (
            <Link
              key={g.value}
              href={`/dashboard/favorites?tab=${g.value}`}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {g.label}
              {isActive && records.length > 0 && (
                <span className="ml-0.5 text-xs text-muted-foreground">
                  {records.length}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {records.length === 0 ? (
        <Card className="relative overflow-hidden border-dashed">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.02] to-primary/[0.02]" />
          <CardContent className="flex flex-col items-center justify-center text-center py-16">
            <div className="size-14 rounded-xl bg-gradient-to-br from-violet-500/10 to-primary/10 flex items-center justify-center mb-4">
              <Star className="size-7 text-violet-500/40" />
            </div>
            <h3 className="text-base font-semibold mb-1">还没有收藏内容</h3>
            <p className="text-sm text-muted-foreground mb-2 max-w-sm">
              在生成结果中点击收藏按钮，优质内容会保存在这里
            </p>
          </CardContent>
        </Card>
      ) : (
        <FavoritesClient records={records} activeTab={activeTab} />
      )}
    </div>
  )
}
