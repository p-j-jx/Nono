import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { redirect } from "next/navigation"
import { Star, FileText, ImageIcon, Sparkles, LayoutTemplate } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
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
        <EmptyState
          icon={Star}
          title={activeTab === "image" ? "还没有收藏的图片" : "还没有收藏的文案"}
          description={
            activeTab === "image"
              ? "AI 生成图片后点击星标，喜欢的素材会保存在这里方便复用"
              : "生成文案后点击星标，优质内容会保存在这里方便复用"
          }
          actions={[
            { label: "去生成内容", href: "/dashboard/new", icon: Sparkles },
            { label: "看看模板", href: "/dashboard/templates", icon: LayoutTemplate, variant: "outline" },
          ]}
          hint="提示：星标内容会同步出现在「导出中心」，可一键导出"
        />
      ) : (
        <FavoritesClient records={records} activeTab={activeTab} />
      )}
    </div>
  )
}
