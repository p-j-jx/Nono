import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

function generateMockSuggestions(productName: string) {
  return {
    features: `优质材料, 创新设计, 安全可靠, 操作便捷, 经久耐用`,
    sellingPoints:
      `${productName}采用优质材料精心打造，品质有保障\n独特设计兼顾美观与实用，解决日常痛点\n性价比出众，为您提供超值选择`,
    keywords: `${productName}, 高品质, 实用好物, 居家必备, 潮流单品`,
    useScenario: "日常居家, 办公环境, 户外出行, 旅行携带, 送礼首选",
    targetAudience: "注重品质与性价比的18-45岁消费者",
    brandName: `${productName.split(/[\s,，、]/)[0] || ""}品牌`,
    painPoints: "品质参差不齐, 选择困难, 使用体验不佳",
    competitiveAdvantages: "品质保证, 价格优势, 创新设计, 售后服务",
    festivalScenario: "情人节, 圣诞季, 黑五促销, 春节年货",
    copyStyle: "professional",
    bannedWords: "最好, 第一, 绝对, 永不",
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
- brandName: 建议的品牌名称（中文）
- painPoints: 用户痛点（中文，逗号分隔，2-4项）
- competitiveAdvantages: 竞争优势（中文，逗号分隔，2-4项）
- festivalScenario: 适用节日/活动场景（中文，逗号分隔，2-3项）
- copyStyle: 建议的文案风格（professional/casual/emotional/technical 选一）
- bannedWords: 建议避免的敏感词（中文，逗号分隔，2-4项）

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
          // Strip markdown code fences if present
          const clean = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim()
          try {
            const parsed = JSON.parse(clean)
            return NextResponse.json({ suggestions: parsed })
          } catch {
            console.error("[Suggestions] AI returned invalid JSON:", text.slice(0, 200))
          }
        }
      } catch (err) {
        console.error("[Suggestions] API call failed:", err)
        // Fall through to mock
      }
    }

    // Mock fallback
    const suggestions = generateMockSuggestions(productName)
    return NextResponse.json({ suggestions })
  } catch (err) {
    console.error("[Suggestions]", err)
    return NextResponse.json({ error: "生成建议失败" }, { status: 500 })
  }
}
