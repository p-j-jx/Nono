import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

const CALC_SYSTEM_PROMPT = `你是一个专业的跨境电商税务顾问。每次回答前，必须使用联网搜索功能查询最新的官方税率，禁止使用过时数据或凭空编造。

## 搜索要求
1. **关税**：搜索 "TARIC [HS编码] [目的国] duty rate 2026 site:europa.eu"
2. **增值税**：搜索 "[国家名] standard VAT rate 2026 site:ec.europa.eu"
3. **反倾销税**：搜索 "EU anti-dumping duty China [产品名] 2026 site:eur-lex.europa.eu"
4. **物流费率**：搜索 "China to Europe [air/sea/rail] freight rate per kg 2026"

## 计算规则
- CIF价格 = 货值 + 运费 + 保险费（保险费按 CIF 的 0.5% 估算）
- 增值税 = (CIF价格 + 关税) × 目的国标准增值税率
- 若搜索结果中存在多个税率，取基础关税（erga omnes），存在反倾销税则叠加
- 如果搜索不到精确的HS编码税率，用同类商品平均值估算，并在字段中注明 "estimated"

## 输出格式（严格 JSON）
{
  "product": "产品名称",
  "hs_code": "HS编码",
  "destination_country": "目的国",
  "base_duty_rate": 基础关税率（百分比数字，例如 12.0）,
  "anti_dumping_rate": 反倾销税率（百分比数字，无则为 0）,
  "vat_rate": 增值税率（百分比数字）,
  "unit_value_cny": 产品单价（人民币元）,
  "weight_kg": 单件重量（公斤）,
  "shipping_mode": "运输方式（air/sea/rail）",
  "quantity": 数量,
  "shipping_cost_per_unit": 单件运费（人民币元）,
  "insurance_per_unit": 单件保险费（人民币元）,
  "cif_value_per_unit": 单件CIF价值（人民币元）,
  "duty_per_unit": 单件关税（人民币元）,
  "vat_per_unit": 单件增值税（人民币元）,
  "total_tax_per_unit": 单件总税（人民币元）,
  "total_landed_cost_per_unit": 单件落地成本（人民币元）,
  "total_tax_batch": 整批总税（人民币元）,
  "total_landed_cost_batch": 整批总落地成本（人民币元）
}`

const REPORT_SYSTEM_PROMPT = `你是一位资深的跨境电商战略顾问。你将收到一份税务计算结果（JSON格式），需要基于这些数据生成一份专业的建议报告。

## 报告要求
1. **税务总结**：用通俗语言解释该产品出口到目标国的税务成本构成（关税、增值税、是否有反倾销税）。
2. **物流优化建议**：对比当前运输方式与其他方式（空运/海运/铁路）的成本和时效差异，给出优化建议。
3. **关税筹划**：如果存在反倾销税或较高关税，建议可行的规避策略（如第三国中转、产品归类调整等，需说明法律风险）。
4. **市场风险提示**：结合当前欧盟政策动态（如2026年7月1日起价值≤150欧元包裹征收每类3欧元临时关税，2028年7月起全额征税）给出预警。
5. **行动清单**：给出3-5条具体可执行的下一步建议。

## 输出格式
使用 Markdown 分级标题，分点清晰，语言专业但易懂。不要重复输出原始 JSON 数据。`

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { productName, hsCode, destinationCountry, shippingMode, unitPrice, weight, quantity } = body

    if (!productName || !destinationCountry || !unitPrice || !weight || !quantity) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 })
    }

    // Resolve API key
    let apiKey: string | undefined
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apiKey: true },
    })
    if (user?.apiKey) apiKey = user.apiKey
    if (!apiKey) apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "未配置 API Key，请在设置中配置" }, { status: 400 })
    }

    const { default: OpenAI } = await import("openai")
    const openai = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" })

    // Step 1: Tax calculation with web search
    const calcInput = `${productName} HS ${hsCode || "未提供"} 出口${destinationCountry} ${shippingMode} ${quantity}件 单价${unitPrice}元 重量${weight}kg`
    const calcRes = await (openai.chat.completions.create as any)({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: CALC_SYSTEM_PROMPT },
        { role: "user", content: calcInput },
      ],
      temperature: 0.3,
      extra_body: { enable_search: true },
    })

    const rawCalc = calcRes.choices[0]?.message?.content || ""
    let calcData: Record<string, unknown>

    try {
      calcData = JSON.parse(rawCalc)
    } catch {
      const jsonMatch = rawCalc.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        calcData = JSON.parse(jsonMatch[1])
      } else {
        return NextResponse.json({ error: "解析税务数据失败", raw: rawCalc }, { status: 500 })
      }
    }

    // Step 2: Strategy report
    const reportRes = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: REPORT_SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(calcData, null, 2) },
      ],
      temperature: 0.7,
    })

    const report = reportRes.choices[0]?.message?.content || ""

    return NextResponse.json({ calculation: calcData, report })
  } catch (err) {
    console.error("[Tax]", err)
    return NextResponse.json({ error: "税务计算失败" }, { status: 500 })
  }
}
