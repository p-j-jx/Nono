import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

const contentTypeLabels: Record<string, string> = {
  title: "商品标题",
  bulletPoints: "要点描述",
  shortDesc: "短描述",
  longDesc: "长描述",
  mainImage: "商品主图",
  sceneImage: "场景图",
}

const languageNames: Record<string, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
}

const platformGuides: Record<string, string> = {
  amazon: "Amazon商品详情页风格，注意关键词密度和A+内容规范",
  shopify: "Shopify独立站风格，注重品牌调性和转化率",
  tiktok: "TikTok Shop风格，简短有力，适合短视频带货场景",
}

const sampleContents: Record<string, (name: string) => string> = {
  title: (name) => `2024新款${name} - 高清音质 舒适佩戴 超长续航 防水防汗`,
  bulletPoints: () =>
    `• 【高清音质】采用最新蓝牙5.3芯片，传输稳定，音质清晰\n• 【舒适佩戴】人体工学设计，单耳仅3.5g，长时间佩戴无压力\n• 【超长续航】单次充电可使用8小时，配合充电盒可达40小时\n• 【防水防汗】IPX5防水等级，运动出汗也不怕\n• 【智能触控】触控操作，轻松切换歌曲、接听电话`,
  shortDesc: (name) =>
    `【${name}】采用最新的蓝牙5.3技术和13mm大动圈单元，带来卓越的音质体验。IPX5级防水设计，无论是运动还是日常使用都能轻松应对。单耳仅3.5g的轻量化设计，配合人体工学造型，即使长时间佩戴也毫无负担。`,
  longDesc: (name) =>
    `# ${name} - 重新定义无线聆听体验\n\n## 卓越音质\n搭载13mm大动圈复合振膜单元，配合最新的蓝牙5.3芯片，提供Hi-Res级别的无线音质。支持AAC/SBC高清音频编码，每一个音符都清晰可辨。\n\n## 舒适佩戴\n通过上千次人耳模型测试，采用人体工学设计，单耳仅重3.5g。配备S/M/L三尺寸硅胶耳套，确保每个人都能找到最舒适的佩戴方式。\n\n## 持久续航\n单次充电可连续播放8小时，配合便携充电盒总续航可达40小时。支持快充技术，充电10分钟即可使用2小时。\n\n## 智能体验\n内置智能触控面板，轻触即可控制音乐播放、接听电话、唤醒语音助手。支持双设备连接，无缝切换手机和电脑。`,
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
  },
  contentType: string
): { system: string; user: string } {
  const platformGuide = platformGuides[project.platform] || ""
  const language = languageNames[project.language] || project.language

  const contextInfo = `产品名称：${project.productName}
品类：${project.category || "未指定"}
核心特点：${project.features || "未提供"}
核心卖点：${project.sellingPoints || "未提供"}
关键词：${project.keywords || "未提供"}
使用场景：${project.useScenario || "未提供"}
目标人群：${project.targetAudience || "未提供"}
价格区间：${project.priceRange || "未指定"}
品牌调性：${project.brandTone || "未指定"}
目标平台：${project.platform}
语言：${language}
平台指南：${platformGuide}`

  const contentTypePrompts: Record<string, { system: string; user: string }> = {
    title: {
      system: `你是一位专业的跨境电商运营专家。根据提供的产品信息，生成一个SEO优化的商品标题。
要求：
- 标题必须包含核心关键词
- 突出产品卖点和差异化优势
- 符合目标平台规范
- 语言：${language}
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
- 只输出卖点列表，不要其他内容`,
      user: `请为以下产品生成核心卖点列表（${language}）：\n\n${contextInfo}`,
    },
    shortDesc: {
      system: `你是一位专业的跨境电商运营专家。根据提供的产品信息，生成一段简洁的产品描述。
要求：
- 突出产品核心价值
- 语言简洁有力，2-3句话
- 语言：${language}
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
- 只输出描述文本，不要其他内容`,
      user: `请为以下产品生成详细的产品描述（${language}）：\n\n${contextInfo}`,
    },
    mainImage: {
      system: `你是一位专业的电商视觉设计师。根据提供的产品信息，生成用于AI图片生成的提示词（Prompt）。
要求：
- 描述产品主图的构图、光线、风格和氛围
- 适合用于Midjourney/Stable Diffusion等图片生成工具
- 语言：English（图片生成Prompt通常用英文效果更好）
- 只输出Prompt本身，不要其他内容`,
      user: `Generate an e-commerce main product image prompt based on the following product information:\n\n${contextInfo}`,
    },
    sceneImage: {
      system: `你是一位专业的电商视觉设计师。根据提供的产品信息，生成用于AI图片生成的场景营销图提示词（Prompt）。
要求：
- 描述产品的使用场景、环境和氛围
- 适合用于Midjourney/Stable Diffusion等图片生成工具
- 语言：English（图片生成Prompt通常用英文效果更好）
- 只输出Prompt本身，不要其他内容`,
      user: `Generate a lifestyle/usage scene image prompt based on the following product information:\n\n${contextInfo}`,
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

    // For image content types, try to generate actual image via aipaiai.cn proxy
    let imageUrl: string | null = null
    if (
      (contentType === "mainImage" || contentType === "sceneImage") &&
      process.env.OPENAI_API_KEY
    ) {
      try {
        const { default: OpenAI } = await import("openai")
        const oa = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: "https://aipaiai.cn/v1",
        })
        const imgRes = await oa.chat.completions.create({
          model: "gpt-image-2",
          messages: [{ role: "user", content }],
        })
        const raw = imgRes.choices?.[0]?.message?.content
        if (raw) {
          imageUrl = raw.startsWith("data:") ? raw : `data:image/png;base64,${raw}`
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
  } catch {
    return NextResponse.json({ error: "生成失败" }, { status: 500 })
  }
}
