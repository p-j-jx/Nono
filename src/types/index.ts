// Shared types for the e-commerce assistant

// Reused from Prisma schema for frontend display
export type GenerationRecord = {
  id: string
  contentType: string
  content: string | null
  imageUrl: string | null
  prompt: string | null
  favorited: boolean
  createdAt: Date
}

export type Project = {
  id: string
  productName: string
  category: string | null
  features: string | null
  sellingPoints: string | null
  keywords: string | null
  useScenario: string | null
  targetAudience: string | null
  priceRange: string | null
  brandTone: string | null
  platform: string
  language: string
  createdAt: Date
  updatedAt: Date
  records: GenerationRecord[]
}

// Label mappings
export const platformLabels: Record<string, string> = {
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok Shop",
}

export const languageLabels: Record<string, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
}

export const contentTypeLabels: Record<string, string> = {
  title: "商品标题",
  bulletPoints: "要点描述",
  shortDesc: "短描述",
  longDesc: "长描述",
  mainImage: "商品主图",
  sceneImage: "场景图",
}

export function categoryLabel(value: string): string {
  const map: Record<string, string> = {
    electronics: "电子产品",
    clothing: "服装鞋帽",
    home: "家居园艺",
    beauty: "美容个护",
    sports: "运动户外",
    toys: "玩具游戏",
    food: "食品饮料",
    other: "其他",
  }
  return map[value] || value
}

// Content type config for generation cards
export const generationTypeConfig = [
  {
    key: "title",
    label: "商品标题",
    desc: "生成SEO优化的产品标题",
    iconName: "FileText" as const,
    gradient: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200/50 dark:border-blue-800/30",
  },
  {
    key: "bulletPoints",
    label: "要点描述",
    desc: "生成产品核心卖点列表",
    iconName: "ListOrdered" as const,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
  },
  {
    key: "shortDesc",
    label: "短描述",
    desc: "生成简洁的产品介绍",
    iconName: "AlignLeft" as const,
    gradient: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-200/50 dark:border-violet-800/30",
  },
  {
    key: "longDesc",
    label: "长描述",
    desc: "生成详细的产品描述",
    iconName: "BookOpen" as const,
    gradient: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200/50 dark:border-amber-800/30",
  },
  {
    key: "mainImage",
    label: "商品主图",
    desc: "生成产品主图提示词",
    iconName: "ImageIcon" as const,
    gradient: "from-pink-500/20 to-pink-600/5",
    iconColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-200/50 dark:border-pink-800/30",
  },
  {
    key: "sceneImage",
    label: "场景图",
    desc: "生成产品使用场景图",
    iconName: "ImagePlus" as const,
    gradient: "from-cyan-500/20 to-cyan-600/5",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-200/50 dark:border-cyan-800/30",
  },
]

// Content type info for results view
export const contentTypeInfo: Record<
  string,
  {
    label: string
    color: string
    bgColor: string
    type: "copy" | "image"
  }
> = {
  title: {
    label: "商品标题",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    type: "copy",
  },
  bulletPoints: {
    label: "要点描述",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    type: "copy",
  },
  shortDesc: {
    label: "短描述",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    type: "copy",
  },
  longDesc: {
    label: "长描述",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    type: "copy",
  },
  mainImage: {
    label: "商品主图",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    type: "image",
  },
  sceneImage: {
    label: "场景图",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    type: "image",
  },
}

// Utility
export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
