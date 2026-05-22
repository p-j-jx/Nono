import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

// Sample project content. Lets new users immediately see what a finished project looks like
// without having to wait for AI generation or fill in 20 fields.
const DEMO_PROJECT = {
  productName: "无线蓝牙降噪耳机 Pro Max",
  category: "消费电子 / 音频设备",
  features: "支持蓝牙 5.3、主动降噪 ANC、40 小时超长续航、可折叠收纳、Hi-Res 认证",
  sellingPoints: "主动降噪 ANC|40 小时续航|Hi-Res 高清音质|可折叠便携|快充 10 分钟用 5 小时",
  keywords: "wireless headphones, noise cancelling, bluetooth headphones, ANC, hi-res audio, over-ear",
  useScenario: "通勤、办公、长途飞行、居家娱乐",
  targetAudience: "25-40 岁城市白领、商务出差人群、深度音乐爱好者",
  priceRange: "$89-$129",
  brandTone: "professional",
  platform: "amazon",
  language: "en",
  brandName: "AudioPro",
  material: "premium plastic, memory foam earcups, metal headband",
  specifications: "Bluetooth 5.3 | 40mm dynamic drivers | 40hr battery | USB-C fast charging | Foldable design",
  targetCountry: "US",
  painPoints: "传统耳机续航短，戴久了耳朵疼，降噪效果差",
  competitiveAdvantages: "续航是同价位产品的 2 倍，降噪深度 35dB 行业领先",
  copyStyle: "专业 · 数据驱动",
  isPromotional: false,
  isBrandFocused: true,
  visualStyle: "minimal",
  generationIntensity: "balanced",
}

// Pre-generated sample content. Saves AI cost and gives instant gratification.
const DEMO_RECORDS = [
  {
    contentType: "title",
    content:
      "AudioPro Pro Max Wireless Bluetooth 5.3 Headphones — Active Noise Cancelling Over-Ear, 40Hr Playtime, Hi-Res Audio, Foldable Design with Premium Carrying Case",
    prompt: "Generate Amazon-compliant title following A9 SEO rules (Demo)",
  },
  {
    contentType: "bulletPoints",
    content: `• INDUSTRY-LEADING ANC: Hybrid active noise cancellation reduces ambient noise by up to 35dB, perfect for travel, focus work, and crowded commutes.

• 40-HOUR BATTERY LIFE: Listen all week on a single charge. 10-minute quick charge gives you 5 hours of playback when you're on the go.

• HI-RES CERTIFIED AUDIO: 40mm dynamic drivers deliver studio-grade sound with deep bass, balanced mids, and crystal-clear highs.

• ALL-DAY COMFORT: Memory foam earcups and adjustable metal headband distribute weight evenly for marathon listening sessions.

• FOLDABLE & PORTABLE: Premium carrying case included. Folds flat for easy storage in any backpack, briefcase, or carry-on.`,
    prompt: "Generate 5 Amazon bullet points for headphones (Demo)",
  },
  {
    contentType: "shortDesc",
    content:
      "Experience studio-quality sound anywhere. The AudioPro Pro Max combines industry-leading active noise cancellation with 40 hours of battery life and Hi-Res certified audio — engineered for professionals who refuse to compromise.",
    prompt: "Generate short product description (Demo)",
  },
  {
    contentType: "seoKeywords",
    content:
      "wireless bluetooth headphones, active noise cancelling headphones, over ear headphones, ANC headphones, hi-res audio headphones, 40 hour battery headphones, foldable headphones, premium headphones for travel, headphones with carrying case, professional noise cancelling",
    prompt: "Generate Backend Keywords for Amazon (Demo)",
  },
]

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    // Prevent users from creating multiple demo projects accidentally
    const existingDemo = await prisma.productProject.findFirst({
      where: {
        userId: session.user.id,
        productName: DEMO_PROJECT.productName,
      },
    })

    if (existingDemo) {
      return NextResponse.json(
        {
          message: "你已经有一个 Demo 项目了",
          projectId: existingDemo.id,
          existed: true,
        },
        { status: 200 }
      )
    }

    const project = await prisma.productProject.create({
      data: {
        userId: session.user.id,
        ...DEMO_PROJECT,
        records: {
          create: DEMO_RECORDS,
        },
      },
      include: {
        records: true,
      },
    })

    return NextResponse.json({
      message: "Demo 项目已创建",
      projectId: project.id,
      existed: false,
    })
  } catch (err) {
    console.error("[Projects/demo] Create demo project failed:", err)
    return NextResponse.json({ error: "创建 Demo 项目失败" }, { status: 500 })
  }
}
