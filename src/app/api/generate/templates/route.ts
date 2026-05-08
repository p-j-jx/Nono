import { NextResponse } from "next/server"

type ProductTemplate = {
  id: string
  name: string
  description: string
  category: string
  preset: Record<string, string>
}

const templates: ProductTemplate[] = [
  {
    id: "electronics",
    name: "3C数码模板",
    description: "适用于电子产品、数码配件类商品",
    category: "electronics",
    preset: {
      brandTone: "professional",
      copyStyle: "technical",
      visualStyle: "tech",
      targetAudience: "18-40岁科技爱好者",
      platform: "amazon",
    },
  },
  {
    id: "clothing",
    name: "服装鞋帽模板",
    description: "适用于服装、鞋子、配饰类商品",
    category: "clothing",
    preset: {
      brandTone: "fashionable",
      copyStyle: "emotional",
      visualStyle: "lifestyle",
      targetAudience: "20-35岁追求时尚的年轻消费者",
      platform: "shopify",
    },
  },
  {
    id: "beauty",
    name: "美妆个护模板",
    description: "适用于美容护肤、个人护理类商品",
    category: "beauty",
    preset: {
      brandTone: "friendly",
      copyStyle: "emotional",
      visualStyle: "brand",
      targetAudience: "18-45岁注重护肤的女性消费者",
      platform: "shopify",
    },
  },
  {
    id: "home",
    name: "家居用品模板",
    description: "适用于家居、园艺、收纳类商品",
    category: "home",
    preset: {
      brandTone: "friendly",
      copyStyle: "casual",
      visualStyle: "lifestyle",
      targetAudience: "25-50岁注重生活品质的家庭用户",
      platform: "amazon",
    },
  },
  {
    id: "sports",
    name: "运动户外模板",
    description: "适用于运动器材、户外用品类商品",
    category: "sports",
    preset: {
      brandTone: "professional",
      copyStyle: "casual",
      visualStyle: "lifestyle",
      targetAudience: "18-40岁热爱运动的消费者",
      platform: "amazon",
    },
  },
  {
    id: "tiktok-fashion",
    name: "TikTok爆款模板",
    description: "适用于TikTok Shop短视频带货",
    category: "clothing",
    preset: {
      brandTone: "fashionable",
      copyStyle: "casual",
      visualStyle: "promotional",
      platform: "tiktok",
      language: "en",
      targetAudience: "16-30岁TikTok活跃用户",
    },
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  let result = templates
  if (category) {
    result = templates.filter((t) => t.category === category)
  }

  return NextResponse.json({ templates: result })
}
