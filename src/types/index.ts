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
  banner: "Banner图",
  socialMediaImage: "社媒图",
  promoPoster: "促销海报",
  brandStory: "品牌故事",
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

// ===== Platform-specific content type mapping =====
// Defines which content types are available/relevant for each platform
export const platformContentTypes: Record<string, string[]> = {
  amazon: [
    "title", "bulletPoints", "shortDesc", "longDesc",
    "seoKeywords", "mainImage", "sceneImage", "banner",
  ],
  shopify: [
    "title", "shortDesc", "longDesc", "brandStory",
    "seoKeywords", "adCopy", "mainImage", "sceneImage",
    "socialMediaImage", "banner",
  ],
  tiktok: [
    "title", "shortDesc", "adCopy",
    "mainImage", "socialMediaImage", "promoPoster",
  ],
  ebay: [
    "title", "bulletPoints", "shortDesc", "longDesc",
    "seoKeywords", "mainImage", "sceneImage",
  ],
  etsy: [
    "title", "shortDesc", "longDesc", "brandStory",
    "seoKeywords", "mainImage", "sceneImage",
  ],
  walmart: [
    "title", "bulletPoints", "shortDesc", "longDesc",
    "seoKeywords", "mainImage", "banner",
  ],
  aliexpress: [
    "title", "bulletPoints", "shortDesc", "longDesc",
    "seoKeywords", "adCopy", "mainImage", "sceneImage", "promoPoster",
  ],
}

// ===== Platform-specific form config =====
export const platformFormConfig: Record<
  string,
  {
    label: string
    color: string
    bgGradient: string
    description: string
    featurePlaceholder: string
    sellingPointPlaceholder: string
    keywordPlaceholder: string
    tips: string[]
  }
> = {
  amazon: {
    label: "Amazon",
    color: "text-amber-600 dark:text-amber-400",
    bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    description: "Amazon Listing 模式：专注 SEO 排名、五点描述、Backend Keywords 和 A+ 内容",
    featurePlaceholder: "例如：蓝牙5.3、主动降噪ANC、30小时续航、IPX7防水",
    sellingPointPlaceholder: "例如：同价位降噪效果最好、10分钟快充4小时、2年质保",
    keywordPlaceholder: "例如：wireless headphones, bluetooth earbuds, noise cancelling",
    tips: [
      "标题建议 80-200 字符，核心关键词放最前面",
      "五点描述每点以大写开头，突出痛点和数据",
      "Backend Keywords 不重复标题已有关键词",
    ],
  },
  shopify: {
    label: "Shopify",
    color: "text-emerald-600 dark:text-emerald-400",
    bgGradient: "from-emerald-500/10 via-green-500/5 to-transparent",
    description: "Shopify 独立站模式：注重品牌故事、视觉调性和社媒传播",
    featurePlaceholder: "例如：手工打造、天然有机材料、独家设计、限量版",
    sellingPointPlaceholder: "例如：独一无二的设计、环保可持续理念、Instagram 网红同款",
    keywordPlaceholder: "例如：handmade, eco-friendly, minimalist design, gift idea",
    tips: [
      "品牌故事比参数更重要，突出生活方式",
      "适合搭配社媒图和 Banner 用于推广",
      "建议设置品牌调性为'时尚潮流'或'高端奢华'",
    ],
  },
  tiktok: {
    label: "TikTok Shop",
    color: "text-cyan-600 dark:text-cyan-400",
    bgGradient: "from-cyan-500/10 via-teal-500/5 to-transparent",
    description: "TikTok Shop 模式：短文案、强冲击力、适合种草带货场景",
    featurePlaceholder: "例如：开箱即用、颜值超高、性价比爆棚、明星同款",
    sellingPointPlaceholder: "例如：3秒抓住眼球、直播间爆款、用过都说好",
    keywordPlaceholder: "例如：viral, trending, must-have, aesthetic",
    tips: [
      "文案要短小精悍，适合配合短视频展示",
      "社媒图和促销海报是重点",
      "突出视觉冲击力和种草感",
    ],
  },
  ebay: {
    label: "eBay",
    color: "text-blue-600 dark:text-blue-400",
    bgGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    description: "eBay 模式：强调产品标识符、物流信息和详细规格",
    featurePlaceholder: "例如：全新正品、UPC/EAN编码、厂家直发",
    sellingPointPlaceholder: "例如：包邮、30天退换、正品保证",
    keywordPlaceholder: "例如：brand new, free shipping, authentic",
    tips: [
      "标题和描述需包含产品标识符（UPC/EAN）",
      "突出物流优势和退换政策",
      "Item Specifics 越详细越好",
    ],
  },
  etsy: {
    label: "Etsy",
    color: "text-orange-600 dark:text-orange-400",
    bgGradient: "from-orange-500/10 via-red-500/5 to-transparent",
    description: "Etsy 模式：突出手工感、独特性和品牌故事",
    featurePlaceholder: "例如：纯手工制作、独家定制、天然材料、可个性化",
    sellingPointPlaceholder: "例如：独一无二的手工艺、支持定制、送礼首选",
    keywordPlaceholder: "例如：handmade, personalized, vintage, custom gift",
    tips: [
      "Etsy 买家看重手工感和独特性",
      "品牌故事和制作过程描述能提升转化",
      "Tags 最多 13 个，善用长尾词",
    ],
  },
  walmart: {
    label: "Walmart",
    color: "text-blue-600 dark:text-blue-400",
    bgGradient: "from-blue-500/10 via-sky-500/5 to-transparent",
    description: "Walmart 模式：强调性价比、正品保障和大众消费",
    featurePlaceholder: "例如：全新升级、家庭装、性价比之选",
    sellingPointPlaceholder: "例如：Walmart 正品保障、价格优势、门店可退",
    keywordPlaceholder: "例如：best value, family pack, everyday essentials",
    tips: [
      "Walmart 用户注重性价比和实用性",
      "标题简洁明了，突出核心参数",
      "描述中强调售后保障和品牌授权",
    ],
  },
  aliexpress: {
    label: "AliExpress",
    color: "text-red-600 dark:text-red-400",
    bgGradient: "from-red-500/10 via-rose-500/5 to-transparent",
    description: "AliExpress 模式：突出价格优势、跨境物流和多语言描述",
    featurePlaceholder: "例如：工厂直销、批量优惠、多色可选",
    sellingPointPlaceholder: "例如：全球包邮、48小时发货、90天质保",
    keywordPlaceholder: "例如：wholesale, dropshipping, cheap, fast shipping",
    tips: [
      "突出价格优势和跨境物流",
      "多尺寸/多色展示提升转化",
      "促销海报和广告文案是重点",
    ],
  },
}

// ===== Industry-specific form config =====
export const industryFormConfig: Record<
  string,
  {
    label: string
    icon: string
    description: string
    featurePlaceholder: string
    sellingPointPlaceholder: string
    keywordPlaceholder: string
    scenarioPlaceholder: string
    audiencePlaceholder: string
    suggestedBrandTones: string[]
  }
> = {
  electronics: {
    label: "电子产品",
    icon: "⚡",
    description: "电子产品模板：突出技术参数、性能对比和使用体验",
    featurePlaceholder: "例如：处理器型号、电池容量mAh、屏幕分辨率、连接协议",
    sellingPointPlaceholder: "例如：跑分超越同价位竞品30%、续航同类最长、通过XX认证",
    keywordPlaceholder: "例如：wireless, bluetooth 5.3, fast charging, 4K display",
    scenarioPlaceholder: "例如：通勤降噪、游戏电竞、远程办公、户外运动",
    audiencePlaceholder: "18-40岁科技爱好者、数码发烧友",
    suggestedBrandTones: ["professional", "luxury"],
  },
  clothing: {
    label: "服装鞋帽",
    icon: "👗",
    description: "服装模板：注重面料质感、穿搭场景和时尚调性",
    featurePlaceholder: "例如：100%纯棉、修身版型、四季可穿、机洗不变形",
    sellingPointPlaceholder: "例如：时尚博主推荐、舒适亲肤、一衣多搭百搭款",
    keywordPlaceholder: "例如：cotton, casual wear, streetwear, oversized, trendy",
    scenarioPlaceholder: "例如：通勤职场、约会穿搭、休闲出街、旅行度假",
    audiencePlaceholder: "20-35岁追求时尚的年轻消费者",
    suggestedBrandTones: ["fashionable", "luxury"],
  },
  beauty: {
    label: "美容个护",
    icon: "💄",
    description: "美妆个护模板：强调成分功效、使用感受和安全认证",
    featurePlaceholder: "例如：玻尿酸成分、无添加配方、通过皮肤科测试",
    sellingPointPlaceholder: "例如：28天淡纹效果可见、敏感肌适用、成分天然",
    keywordPlaceholder: "例如：skincare, anti-aging, hyaluronic acid, organic, cruelty-free",
    scenarioPlaceholder: "例如：日常护肤、约会妆容、换季修复、送礼",
    audiencePlaceholder: "18-45岁注重护肤的女性消费者",
    suggestedBrandTones: ["friendly", "luxury"],
  },
  home: {
    label: "家居园艺",
    icon: "🏠",
    description: "家居模板：营造生活氛围感，突出实用性和空间搭配",
    featurePlaceholder: "例如：实木材质、静音设计、易安装、多功能收纳",
    sellingPointPlaceholder: "例如：北欧简约设计、小户型神器、一物多用",
    keywordPlaceholder: "例如：home decor, kitchen organizer, minimalist, space-saving",
    scenarioPlaceholder: "例如：客厅布置、厨房收纳、卧室装饰、办公桌面",
    audiencePlaceholder: "25-50岁注重生活品质的家庭用户",
    suggestedBrandTones: ["friendly", "professional"],
  },
  sports: {
    label: "运动户外",
    icon: "⛹️",
    description: "运动户外模板：强调性能参数、场景适配和运动体验",
    featurePlaceholder: "例如：速干面料、人体工学设计、防滑耐磨、轻量化",
    sellingPointPlaceholder: "例如：专业运动员推荐、透气排汗、运动不受限",
    keywordPlaceholder: "例如：sports, workout, running shoes, gym equipment, outdoor",
    scenarioPlaceholder: "例如：健身房训练、户外跑步、登山徒步、球类运动",
    audiencePlaceholder: "18-40岁热爱运动的消费者",
    suggestedBrandTones: ["professional", "fashionable"],
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
