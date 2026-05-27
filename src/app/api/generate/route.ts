import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { checkMonthlyQuota } from "@/lib/quota"

const contentTypeLabels: Record<string, string> = {
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
}

const languageNames: Record<string, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  pt: "Português",
  ar: "العربية",
}

const platformGuides: Record<string, string> = {
  amazon: "Amazon商品详情页风格，注意关键词密度和A+内容规范",
  shopify: "Shopify独立站风格，注重品牌调性和转化率",
  tiktok: "TikTok Shop风格，简短有力，适合短视频带货场景",
  ebay: "eBay平台风格，需强调产品标识符和物流信息",
  etsy: "Etsy平台风格，注重手工感、独特性和品牌故事",
  walmart: "Walmart平台风格，强调性价比和正品保障",
  aliexpress: "AliExpress风格，突出价格优势和跨境物流",
}

const sampleContents: Record<string, (name: string) => string> = {
  title: (name) => `高品质${name} - 专业设计 性能卓越 值得信赖`,
  bulletPoints: (name) =>
    `• 【核心性能】采用优质材料和先进工艺，确保${name}稳定可靠\n• 【用户体验】精心设计，操作便捷，上手即用\n• 【品质保证】严格质检，经久耐用，性价比出众\n• 【适用广泛】多种场景皆可使用，满足日常需求\n• 【贴心服务】完善的售后保障，让您购物无忧`,
  shortDesc: (name) =>
    `【${name}】集品质与实用性于一体，采用优质材料和精湛工艺打造。无论是日常使用还是专业场景，都能为您带来出色的体验。简约时尚的设计，配合人性化的功能布局，让每一次使用都轻松愉悦。`,
  longDesc: (name) =>
    `# ${name} - 品质之选 值得拥有\n\n## 产品亮点\n秉承精益求精的理念，从选材到工艺层层把关。每一个细节都经过反复推敲，只为呈现更好的使用体验。\n\n## 品质保障\n采用高标准生产流程，经过多重质量检测。选用优质原材料，确保产品稳定耐用，经得起时间考验。\n\n## 适用场景\n无论是居家、办公还是外出，都能轻松应对。简约大方的设计风格，与各种环境都能完美融合。\n\n## 售后服务\n我们提供完善的售后保障，专业团队随时为您解答疑问。您的满意是我们最大的追求。`,
  adCopy: (name) =>
    `【限时特惠】${name}，品质生活从此刻开始！\n✨ 精选优质材料，匠心工艺打造\n💯 严格质检，品质 guaranteed\n🎁 限时折扣 + 包邮，错过等一年\n👉 立即抢购，开启品质生活！`,
  seoKeywords: (name) =>
    `${name}, ${name}推荐, ${name}测评, 高品质好物, 居家必备, 送礼佳品, 热门推荐, 2024新品, 性价比之选`,
  banner: () =>
    "Product showcase banner with clean white background, professional product photography centered, soft natural lighting, minimalist composition, elegant typography overlay, e-commerce product banner, 1200x628 pixels",
  socialMediaImage: () =>
    "Lifestyle product photo for social media, user enjoying the product in a cozy modern home setting, warm ambient lighting, candid style, shallow depth of field, Instagram aesthetic, 1080x1080 pixels",
  promoPoster: () =>
    "Promotional sale poster design, bold product placement, vibrant colors, special offer callout, discount badge, dynamic composition, retail promotional poster, high energy, 1200x1500 pixels",
  brandStory: (name) =>
    `品牌故事 | ${name}\n\n从一个小小的想法，到如今备受信赖的产品。我们始终相信，好产品源于对品质的执着追求。秉持匠心精神，从选材到工艺，每一个环节都精益求精。\n\n我们的使命：让每一位用户都能享受到优质产品带来的美好体验。\n\n我们的承诺：品质保障、售后无忧、持续创新。\n\n选择${name}，不仅是选择一个产品，更是选择一种生活方式。让我们一起，创造更美好的日常。`,
}

function buildPrompt(
  project: {
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
    brandName: string | null
    material: string | null
    specifications: string | null
    targetCountry: string | null
    painPoints: string | null
    competitiveAdvantages: string | null
    festivalScenario: string | null
    copyStyle: string | null
    bannedWords: string | null
    isPromotional: boolean
    isBrandFocused: boolean
    visualStyle: string
    generationIntensity: string
  },
  contentType: string
): { system: string; user: string } {
  const platformGuide = platformGuides[project.platform] || ""
  const language = languageNames[project.language] || project.language

  const contextInfo = `产品名称：${project.productName}
品类：${project.category || "未指定"}
品牌名称：${project.brandName || "未指定"}
核心特点：${project.features || "未提供"}
核心卖点：${project.sellingPoints || "未提供"}
关键词：${project.keywords || "未提供"}
使用场景：${project.useScenario || "未提供"}
目标人群：${project.targetAudience || "未提供"}
用户痛点：${project.painPoints || "未提供"}
竞争优势：${project.competitiveAdvantages || "未提供"}
节日活动场景：${project.festivalScenario || "未指定"}
价格区间：${project.priceRange || "未指定"}
品牌调性：${project.brandTone || "未指定"}
文案风格：${project.copyStyle || "未指定"}
材质：${project.material || "未指定"}
规格参数：${project.specifications || "未指定"}
目标国家：${project.targetCountry || "未指定"}
禁用词：${project.bannedWords || "未指定"}
促销活动：${project.isPromotional ? "是" : "否"}
品牌聚焦：${project.isBrandFocused ? "是" : "否"}
视觉风格：${project.visualStyle || "未指定"}
生成强度：${project.generationIntensity || "未指定"}
目标平台：${project.platform}
语言：${language}
平台指南：${platformGuide}`

  const bannedWordHint = project.bannedWords
    ? `\n注意：避免使用以下敏感词：${project.bannedWords}`
    : ""

  const contentTypePrompts: Record<string, { system: string; user: string }> = {
    title: {
      system: `你是一位专业的跨境电商运营专家。根据提供的产品信息，生成一个SEO优化的商品标题。
要求：
- 标题必须包含核心关键词
- 突出产品卖点和差异化优势
- 符合目标平台规范
- 语言：${language}
${bannedWordHint}
- 只输出标题本身，不要其他内容`,
      user: `请为以下产品生成一个商品标题（${language}）：\n\n${contextInfo}`,
    },
    bulletPoints: {
      system: `你是一位专业的跨境电商运营专家。根据提供的产品信息，生成产品的核心卖点列表。
要求：
- 每条卖点用•开头
- 突出产品核心优势和差异化
- 包含具体参数和细节
- 语言：${language}
${bannedWordHint}
- 只输出卖点列表，不要其他内容`,
      user: `请为以下产品生成核心卖点列表（${language}）：\n\n${contextInfo}`,
    },
    shortDesc: {
      system: `你是一位专业的跨境电商运营专家。根据提供的产品信息，生成一段简洁的产品描述。
要求：
- 突出产品核心价值
- 语言简洁有力，2-3句话
- 语言：${language}
${bannedWordHint}
- 只输出描述文本，不要其他内容`,
      user: `请为以下产品生成一段短描述（${language}）：\n\n${contextInfo}`,
    },
    longDesc: {
      system: `你是一位专业的跨境电商运营专家。根据提供的产品信息，生成详细的产品描述。
要求：
- 使用Markdown格式，包含小标题
- 从多个维度详细介绍产品（功能、设计、体验、品质等）
- 语言有感染力，促进转化
- 语言：${language}
${bannedWordHint}
- 只输出描述文本，不要其他内容`,
      user: `请为以下产品生成详细的产品描述（${language}）：\n\n${contextInfo}`,
    },
    adCopy: {
      system: `你是一位专业的跨境电商广告优化师。根据提供的产品信息，生成一则吸引人的广告文案。
要求：
- 开头要有吸引力，抓住注意力
- 突出产品卖点和差异化优势
- 包含明确的行动号召（CTA）
- 语言简洁有力，适合广告投放
- 语言：${language}
${bannedWordHint}
- 只输出广告文案，不要其他内容`,
      user: `请为以下产品生成一则广告文案（${language}）：\n\n${contextInfo}`,
    },
    seoKeywords: {
      system: `你是一位专业的跨境电商SEO专家。根据提供的产品信息，生成产品的SEO关键词列表。
要求：
- 包含核心词、长尾词和场景词
- 逗号分隔
- 覆盖搜索意图
- 语言：${language}
- 只输出关键词列表，不要其他内容`,
      user: `请为以下产品生成SEO关键词列表（${language}）：\n\n${contextInfo}`,
    },
    mainImage: {
      system: `你是一位专业的电商视觉设计师。根据提供的产品信息，生成用于AI图片生成的提示词（Prompt）。
要求：
- 描述产品主图的构图、光线、风格和氛围
- 视觉风格参考：${project.visualStyle || "minimal"}
- 适合用于Midjourney/Stable Diffusion等图片生成工具
- 语言：English（图片生成Prompt通常用英文效果更好）
- 只输出Prompt本身，不要其他内容`,
      user: `Generate an e-commerce main product image prompt based on the following product information:\n\n${contextInfo}`,
    },
    sceneImage: {
      system: `你是一位专业的电商视觉设计师。根据提供的产品信息，生成用于AI图片生成的场景营销图提示词（Prompt）。
要求：
- 描述产品的使用场景、环境和氛围
- 视觉风格参考：${project.visualStyle || "minimal"}
- 适合用于Midjourney/Stable Diffusion等图片生成工具
- 语言：English（图片生成Prompt通常用英文效果更好）
- 只输出Prompt本身，不要其他内容`,
      user: `Generate a lifestyle/usage scene image prompt based on the following product information:\n\n${contextInfo}`,
    },
    banner: {
      system: `你是一位专业的电商视觉设计师。根据提供的产品信息，生成用于AI图片生成的Banner图提示词（Prompt）。
要求：
- 描述Banner图的布局、文案位置、色彩和风格
- 适合用于电商平台首页/活动页
- 视觉风格参考：${project.visualStyle || "minimal"}
- 语言：English
- 只输出Prompt本身，不要其他内容`,
      user: `Generate an e-commerce banner image prompt based on the following product information:\n\n${contextInfo}`,
    },
    socialMediaImage: {
      system: `你是一位专业的社交媒体视觉设计师。根据提供的产品信息，生成用于AI图片生成的社交媒体配图提示词（Prompt）。
要求：
- 描述社媒图的生活化场景、氛围和风格
- 适合Instagram/TikTok/Pinterest等平台
- 视觉风格参考：${project.visualStyle || "minimal"}
- 语言：English
- 只输出Prompt本身，不要其他内容`,
      user: `Generate a social media image prompt based on the following product information:\n\n${contextInfo}`,
    },
    promoPoster: {
      system: `你是一位专业的促销视觉设计师。根据提供的产品信息，生成用于AI图片生成的促销海报提示词（Prompt）。
要求：
- 描述促销海报的视觉冲击力、促销信息和氛围
- 包含促销感和紧迫感
- 视觉风格参考：${project.visualStyle || "minimal"}
- 语言：English
- 只输出Prompt本身，不要其他内容`,
      user: `Generate a promotional poster image prompt based on the following product information:\n\n${contextInfo}`,
    },
    brandStory: {
      system: `你是一位专业的品牌文案策划师。根据提供的产品信息，创作一个有温度的品牌故事。
要求：
- 以品牌创始或产品研发的视角讲述
- 语言有感染力和情感共鸣
- 突出品牌理念和产品品质
- 语言：${language}
${bannedWordHint}
- 只输出品牌故事本身，不要其他内容`,
      user: `请为以下产品创作一个品牌故事（${language}）：\n\n${contextInfo}`,
    },
  }

  return (
    contentTypePrompts[contentType] || {
      system: `生成${contentTypeLabels[contentType] || contentType}内容。语言：${language}`,
      user: contextInfo,
    }
  )
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  // Rate limit: 30 requests per minute per user
  const { success, remaining, retryAfterMs } = rateLimit(
    `generate:${session.user.id}`,
    30,
    60_000
  )
  if (!success) {
    return NextResponse.json(
      { error: `请求过于频繁，请 ${Math.ceil(retryAfterMs / 1000)} 秒后再试` },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    )
  }

  // Monthly quota check — hard block when exhausted
  const quota = await checkMonthlyQuota(session.user.id)
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: `本月免费额度已用完（${quota.used}/${quota.limit}次），请下月再试或升级套餐`,
        kind: "QUOTA_EXCEEDED",
      },
      { status: 403 }
    )
  }

  try {
    const { projectId, contentType } = await req.json()

    if (!projectId || !contentType) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 })
    }

    const project = await prisma.productProject.findUnique({
      where: { id: projectId },
    })

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 })
    }

    let content: string

    // Resolve API key: user-configured > environment variable
    let apiKey: string | undefined
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apiKey: true, imageApiKey: true },
    })
    if (user?.apiKey) {
      apiKey = user.apiKey
    }
    if (!apiKey) {
      apiKey = process.env.DEEPSEEK_API_KEY
    }

    // Try real AI API first, fall back to mock
    if (apiKey) {
      try {
        const { default: OpenAI } = await import("openai")
        const openai = new OpenAI({
          apiKey,
          baseURL: "https://api.deepseek.com",
        })

        const { system, user } = buildPrompt(project, contentType)

        const response = await openai.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        })

        content = response.choices[0]?.message?.content || ""
        if (!content) throw new Error("Empty response")
      } catch (aiError) {
        console.error("AI API 调用失败，使用模拟数据:", aiError)
        const generateFn = sampleContents[contentType]
        content = generateFn
          ? generateFn(project.productName)
          : `已生成${contentTypeLabels[contentType] || contentType}内容`
      }
    } else {
      const generateFn = sampleContents[contentType]
      content = generateFn
        ? generateFn(project.productName)
        : `已生成${contentTypeLabels[contentType] || contentType}内容`
    }

    // For image content types, generate image via aipaiai.cn Images API
    const imageContentTypes = ["mainImage", "sceneImage", "banner", "socialMediaImage", "promoPoster"]
    let imageUrl: string | null = null
    const imageApiKey = user?.imageApiKey || process.env.OPENAI_API_KEY
    if (
      imageContentTypes.includes(contentType) &&
      imageApiKey
    ) {
      try {
        const { default: OpenAI } = await import("openai")
        const oa = new OpenAI({
          apiKey: imageApiKey,
          baseURL: "https://aipaiai.cn/v1",
        })
        const imgRes = await oa.images.generate({
          model: "gpt-image-2",
          prompt: content,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
        })
        const b64 = imgRes.data?.[0]?.b64_json
        if (b64) {
          imageUrl = `data:image/png;base64,${b64}`
        }
      } catch (e) {
        console.error("图片生成失败:", e)
      }
    }

    const record = await prisma.generationRecord.create({
      data: {
        projectId,
        contentType,
        content,
        imageUrl,
        prompt: `为"${project.productName}"生成${contentTypeLabels[contentType] || contentType}`,
      },
    })

    return NextResponse.json({ record })
  } catch (err) {
    console.error("[Generate]", err)
    return NextResponse.json({ error: "生成失败" }, { status: 500 })
  }
}
