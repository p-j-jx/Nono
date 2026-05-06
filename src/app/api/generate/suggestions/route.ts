import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

const mockSuggestions: Record<
  string,
  {
    features: string
    sellingPoints: string
    keywords: string
    useScenario: string
    targetAudience: string
  }
> = {
  default: {
    features:
      "高品质材料, 创新设计, 耐用可靠, 易于使用, 环保环保",
    sellingPoints:
      "独特的功能设计，解决用户痛点\n高品质保证，远超同类产品\n性价比极高，物超所值",
    keywords: "高品质, 创新, 时尚, 实用, 热销",
    useScenario:
      "日常居家使用, 办公场所, 户外活动, 旅行出差, 送礼佳品",
    targetAudience: "18-45岁追求品质生活的消费者",
  },
}

function generateMockSuggestions(productName: string) {
  const base = mockSuggestions.default
  return {
    features: `${productName}的${base.features}`,
    sellingPoints: base.sellingPoints,
    keywords: `${productName}, ${base.keywords}`,
    useScenario: base.useScenario,
    targetAudience: base.targetAudience,
  }
}

const suggestionPrompt = (productName: string) => ({
  system: `你是一位跨境电商产品专家。根据产品名称，生成产品的基础信息建议。
以 JSON 格式返回，包含以下字段：
- features: 产品核心特点（中文，逗号分隔，3-5项）
- sellingPoints: 核心卖点（中文，每行一项，2-3项）
- keywords: 搜索关键词（中文，逗号分隔，3-5个）
- useScenario: 使用场景（中文，逗号分隔，3-5项）
- targetAudience: 目标人群（中文，一句话描述）

只返回 JSON，不要其他内容。`,
  user: `产品名称：${productName}`,
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    const { productName } = await req.json()

    if (!productName?.trim()) {
      return NextResponse.json({ error: "产品名称不能为空" }, { status: 400 })
    }

    // Resolve API key
    let apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { apiKey: true },
      })
      if (user?.apiKey) {
        apiKey = user.apiKey
      }
    }

    if (apiKey) {
      try {
        const { default: OpenAI } = await import("openai")
        const openai = new OpenAI({
          apiKey,
          baseURL: "https://api.deepseek.com",
        })

        const { system, user } = suggestionPrompt(productName)

        const response = await openai.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        })

        const text = response.choices[0]?.message?.content || ""
        if (text) {
          const parsed = JSON.parse(text)
          return NextResponse.json({ suggestions: parsed })
        }
      } catch {
        // Fall through to mock
      }
    }

    // Mock fallback
    const suggestions = generateMockSuggestions(productName)
    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ error: "生成建议失败" }, { status: 500 })
  }
}
