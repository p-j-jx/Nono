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

  // Basic product info
  brandName: string | null
  material: string | null
  specifications: string | null
  targetCountry: string | null

  // User scenario info
  painPoints: string | null
  competitiveAdvantages: string | null
  festivalScenario: string | null

  // Brand & style info
  copyStyle: string | null
  bannedWords: string | null
  isPromotional: boolean
  isBrandFocused: boolean

  // Generation config
  visualStyle: string
  generationIntensity: string

  createdAt: Date
  updatedAt: Date
  records: GenerationRecord[]
}

// Label mappings
export const platformLabels: Record<string, string> = {
  amazon: "Amazon",
  shopify: "Shopify",
  tiktok: "TikTok Shop",
  ebay: "eBay",
  etsy: "Etsy",
  walmart: "Walmart",
  aliexpress: "AliExpress",
}

export const languageLabels: Record<string, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  pt: "Português",
  ar: "العربية",
}

export const contentTypeLabels: Record<string, string> = {
  title: "商品标题",
  bulletPoints: "要点描述",
  shortDesc: "短描述",
  longDesc: "长描述",
  mainImage: "商品主图",
  sceneImage: "场景图",
  adCopy: "广告文案",
  seoKeywords: "SEO关键词",
  videoScript: "视频脚本",
  banner: "Banner图",
  socialMediaImage: "社媒图",
  promoPoster: "促销海报",
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

// New label maps
export const visualStyleLabels: Record<string, string> = {
  minimal: "极简白底",
  brand: "品牌质感",
  promotional: "促销风格",
  tech: "科技感",
  lifestyle: "生活方式",
}

export const generationIntensityLabels: Record<string, string> = {
  fast: "快速生成",
  balanced: "均衡模式",
  quality: "质量优先",
}

export const copyStyleLabels: Record<string, string> = {
  professional: "专业权威",
  casual: "轻松口语",
  emotional: "情感共鸣",
  technical: "技术参数",
}

export const modeLabels: Record<string, string> = {
  standard: "标准模式",
  advanced: "高级模式",
  batch: "批量模式",
}

export const targetCountryOptions = [
  { value: "US", label: "美国", platformHint: "amazon" },
  { value: "UK", label: "英国", platformHint: "amazon,shopify" },
  { value: "DE", label: "德国", platformHint: "amazon" },
  { value: "FR", label: "法国", platformHint: "amazon" },
  { value: "JP", label: "日本", platformHint: "amazon" },
  { value: "CA", label: "加拿大", platformHint: "amazon,shopify" },
  { value: "AU", label: "澳大利亚", platformHint: "shopify" },
  { value: "OTHER", label: "其他", platformHint: "all" },
]

// Content type groups for filtered display
export const contentTypeGroups = {
  copy: [
    { key: "title", label: "商品标题", desc: "SEO优化的产品标题" },
    { key: "bulletPoints", label: "要点描述", desc: "核心卖点列表" },
    { key: "shortDesc", label: "短描述", desc: "简洁的产品介绍" },
    { key: "longDesc", label: "长描述", desc: "详细的产品描述" },
    { key: "adCopy", label: "广告文案", desc: "广告投放文案" },
    { key: "seoKeywords", label: "SEO关键词", desc: "搜索引擎关键词" },
    { key: "videoScript", label: "视频脚本", desc: "短视频带货脚本" },
  ],
  image: [
    { key: "mainImage", label: "商品主图", desc: "产品主图提示词" },
    { key: "sceneImage", label: "场景图", desc: "使用场景图提示词" },
    { key: "banner", label: "Banner图", desc: "横幅广告图提示词" },
    { key: "socialMediaImage", label: "社媒图", desc: "社交媒体配图提示词" },
    { key: "promoPoster", label: "促销海报", desc: "促销活动海报提示词" },
  ],
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
    key: "adCopy",
    label: "广告文案",
    desc: "生成广告投放文案",
    iconName: "Megaphone" as const,
    gradient: "from-red-500/20 to-red-600/5",
    iconColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200/50 dark:border-red-800/30",
  },
  {
    key: "seoKeywords",
    label: "SEO关键词",
    desc: "生成搜索引擎关键词",
    iconName: "Search" as const,
    gradient: "from-indigo-500/20 to-indigo-600/5",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-200/50 dark:border-indigo-800/30",
  },
  {
    key: "videoScript",
    label: "视频脚本",
    desc: "生成短视频带货脚本",
    iconName: "Video" as const,
    gradient: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200/50 dark:border-orange-800/30",
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
  {
    key: "banner",
    label: "Banner图",
    desc: "生成横幅广告图",
    iconName: "PanelTop" as const,
    gradient: "from-sky-500/20 to-sky-600/5",
    iconColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-200/50 dark:border-sky-800/30",
  },
  {
    key: "socialMediaImage",
    label: "社媒图",
    desc: "生成社交媒体配图",
    iconName: "Share2" as const,
    gradient: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-200/50 dark:border-rose-800/30",
  },
  {
    key: "promoPoster",
    label: "促销海报",
    desc: "生成促销活动海报",
    iconName: "ImageDown" as const,
    gradient: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200/50 dark:border-purple-800/30",
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
  adCopy: {
    label: "广告文案",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    type: "copy",
  },
  seoKeywords: {
    label: "SEO关键词",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    type: "copy",
  },
  videoScript: {
    label: "视频脚本",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
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
  banner: {
    label: "Banner图",
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    type: "image",
  },
  socialMediaImage: {
    label: "社媒图",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    type: "image",
  },
  promoPoster: {
    label: "促销海报",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
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
