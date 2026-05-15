/**
 * Competitor analysis engine — pure rule-based, no AI needed.
 * Compares your listing content against a competitor's to find gaps and opportunities.
 */

// ─── Types ─────────────────────────────────────────────────────

export type KeywordGap = {
  /** Keywords you have but competitor doesn't */
  unique: string[]
  /** Keywords competitor has but you don't */
  missing: string[]
  /** Keywords you both share */
  shared: string[]
}

export type TitleAnalysis = {
  yourLength: number
  competitorLength: number
  lengthVerdict: "shorter" | "similar" | "longer"
  /** Keywords found in competitor title but not yours */
  missingKeywords: string[]
}

export type ContentComparison = {
  yourScore: number
  competitorScore: number
  scoreDiff: number
}

export type SellingPointDiff = {
  /** Points only you mention */
  yourUnique: string[]
  /** Points only competitor mentions */
  competitorUnique: string[]
  /** Overlapping themes */
  shared: string[]
}

export type CompetitorReport = {
  platform: string
  keywordGap: KeywordGap
  titleAnalysis: TitleAnalysis | null
  sellingPointDiff: SellingPointDiff
  structureNotes: string[]
  suggestions: string[]
}

// ─── Helpers ───────────────────────────────────────────────────

/** Extract meaningful keywords from text (Chinese + English) */
function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase()

  // Split on common delimiters and whitespace
  const raw = lower.split(/[\s,，、;；|·\-—()（）【】\[\]""''""]+/)

  // Filter out too-short or stop words
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "for", "with", "in", "on", "at", "to",
    "is", "are", "of", "by", "from", "this", "that", "it", "as", "be",
    "的", "了", "和", "与", "在", "是", "不", "有", "也", "就", "都",
    "而", "及", "等", "之", "为", "以", "可", "更", "让", "将", "从",
  ])

  return raw
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !stopWords.has(w))
    .filter((w, i, arr) => arr.indexOf(w) === i) // deduplicate
}

/** Extract selling points from text */
function extractPoints(text: string): string[] {
  return text
    .split(/[\n,，、;；]/)
    .map((p) => p.replace(/^[\s•\-\d.、]+/, "").trim())
    .filter((p) => p.length >= 4)
}

/** Simple keyword overlap check */
function findOverlap(a: string[], b: string[]): { shared: string[]; onlyA: string[]; onlyB: string[] } {
  const setB = new Set(b)
  const setA = new Set(a)
  const shared = a.filter((w) => setB.has(w))
  const onlyA = a.filter((w) => !setB.has(w))
  const onlyB = b.filter((w) => !setA.has(w))
  return { shared, onlyA, onlyB }
}

/** Simple scoring heuristic for content quality */
function quickScore(text: string): number {
  let score = 50
  const len = text.length

  // Length factor
  if (len >= 50) score += 10
  if (len >= 100) score += 5
  if (len >= 200) score += 5

  // Keyword density (more unique words = richer content)
  const words = extractKeywords(text)
  if (words.length >= 5) score += 5
  if (words.length >= 10) score += 5
  if (words.length >= 20) score += 5

  // Structure bonus (bullet points, paragraphs)
  const lines = text.split(/\n/).filter((l) => l.trim().length > 0)
  if (lines.length >= 3) score += 5
  if (lines.length >= 5) score += 5

  return Math.min(100, score)
}

/** Fuzzy match: check if pointA's theme appears in pointB */
function themeOverlap(pointA: string, pointB: string): boolean {
  const wordsA = extractKeywords(pointA)
  const wordsB = new Set(extractKeywords(pointB))
  const matchCount = wordsA.filter((w) => wordsB.has(w)).length
  return matchCount >= 2 || (wordsA.length <= 3 && matchCount >= 1)
}

// ─── Main analysis ─────────────────────────────────────────────

export type CompetitorInput = {
  platform: string
  /** Your content fields */
  your: {
    title?: string
    bulletPoints?: string
    description?: string
    keywords?: string
  }
  /** Competitor's content fields */
  competitor: {
    title?: string
    bulletPoints?: string
    description?: string
  }
}

export function analyzeCompetitor(input: CompetitorInput): CompetitorReport {
  const { platform, your: mine, competitor: comp } = input
  const structureNotes: string[] = []
  const suggestions: string[] = []

  // ── 1. Keyword gap analysis ──
  const allMyText = [mine.title, mine.bulletPoints, mine.description, mine.keywords]
    .filter(Boolean)
    .join(" ")
  const allCompText = [comp.title, comp.bulletPoints, comp.description]
    .filter(Boolean)
    .join(" ")

  const myKw = extractKeywords(allMyText)
  const compKw = extractKeywords(allCompText)
  const kwOverlap = findOverlap(myKw, compKw)

  const keywordGap: KeywordGap = {
    unique: kwOverlap.onlyA.slice(0, 20),
    missing: kwOverlap.onlyB.slice(0, 20),
    shared: kwOverlap.shared.slice(0, 15),
  }

  if (kwOverlap.onlyB.length > 0) {
    suggestions.push(
      `竞品使用了 ${kwOverlap.onlyB.length} 个你没有的关键词，考虑补充：${kwOverlap.onlyB.slice(0, 5).join("、")}`
    )
  }

  if (kwOverlap.shared.length < 3 && myKw.length > 0 && compKw.length > 0) {
    structureNotes.push("你和竞品的关键词重叠度很低，可能定位了不同的搜索意图")
  }

  // ── 2. Title analysis ──
  let titleAnalysis: TitleAnalysis | null = null
  if (mine.title && comp.title) {
    const yourLen = mine.title.length
    const compLen = comp.title.length
    const diff = yourLen - compLen

    let lengthVerdict: "shorter" | "similar" | "longer" = "similar"
    if (diff < -20) lengthVerdict = "shorter"
    else if (diff > 20) lengthVerdict = "longer"

    const myTitleKw = extractKeywords(mine.title)
    const compTitleKw = extractKeywords(comp.title)
    const missingInTitle = compTitleKw.filter((w) => !new Set(myTitleKw).has(w))

    titleAnalysis = {
      yourLength: yourLen,
      competitorLength: compLen,
      lengthVerdict,
      missingKeywords: missingInTitle.slice(0, 10),
    }

    if (lengthVerdict === "shorter") {
      suggestions.push(
        `你的标题（${yourLen} 字符）比竞品（${compLen} 字符）短，考虑补充关键词`
      )
    }
    if (missingInTitle.length > 0) {
      suggestions.push(
        `竞品标题包含 ${missingInTitle.length} 个你标题中没有的词：${missingInTitle.slice(0, 5).join("、")}`
      )
    }

    // Platform-specific title tips
    if (platform === "amazon") {
      if (yourLen < 80) structureNotes.push("你的标题不足 80 字符，Amazon 建议 80-200")
      if (compLen >= 120 && yourLen < 100)
        structureNotes.push("竞品标题更长且关键词更密集，建议丰富你的标题")
    }
  }

  // ── 3. Selling point / bullet point diff ──
  const myPoints = mine.bulletPoints ? extractPoints(mine.bulletPoints) : []
  const compPoints = comp.bulletPoints ? extractPoints(comp.bulletPoints) : []

  const yourUnique: string[] = []
  const competitorUnique: string[] = []
  const shared: string[] = []

  for (const mp of myPoints) {
    const hasMatch = compPoints.some((cp) => themeOverlap(mp, cp))
    if (hasMatch) shared.push(mp)
    else yourUnique.push(mp)
  }
  for (const cp of compPoints) {
    const hasMatch = myPoints.some((mp) => themeOverlap(mp, cp))
    if (!hasMatch) competitorUnique.push(cp)
  }

  const sellingPointDiff: SellingPointDiff = {
    yourUnique: yourUnique.slice(0, 10),
    competitorUnique: competitorUnique.slice(0, 10),
    shared: shared.slice(0, 10),
  }

  if (competitorUnique.length > 0) {
    suggestions.push(
      `竞品提到了你没有的卖点，考虑是否需要补充：${competitorUnique.slice(0, 3).map((p) => `"${p.slice(0, 20)}"`).join("、")}`
    )
  }

  if (myPoints.length < compPoints.length) {
    structureNotes.push(
      `你的要点（${myPoints.length} 条）比竞品（${compPoints.length} 条）少`
    )
  }

  // ── 4. Structure notes ──
  if (comp.description && !mine.description) {
    structureNotes.push("竞品有详细描述而你没有，建议补充长描述")
  }
  if (mine.description && comp.description) {
    const myScore = quickScore(mine.description)
    const compScore = quickScore(comp.description)
    if (compScore > myScore + 15) {
      structureNotes.push("竞品描述内容丰富度高于你的描述，建议增加细节")
    }
  }

  // General suggestions if we have few
  if (suggestions.length === 0) {
    suggestions.push("整体内容和竞品差异不大，可以考虑从品牌故事或差异化卖点入手")
  }

  return {
    platform,
    keywordGap,
    titleAnalysis,
    sellingPointDiff,
    structureNotes,
    suggestions,
  }
}
