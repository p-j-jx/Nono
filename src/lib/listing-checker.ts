/**
 * Listing quality checker — pure rule engine, no AI needed.
 * Validates generated content against platform-specific requirements.
 */

export type CheckSeverity = "pass" | "warn" | "fail"

export type CheckResult = {
  id: string
  label: string
  severity: CheckSeverity
  message: string
  /** Optional numeric value for display (e.g. character count) */
  value?: number
  limit?: number
}

export type QualityReport = {
  platform: string
  contentType: string
  score: number // 0-100
  checks: CheckResult[]
}

// ─── Banned words per platform ───────────────────────────────────

const COMMON_BANNED_WORDS_ZH = [
  "最好", "第一", "绝对", "永远", "100%", "完美", "最佳",
  "顶级", "极致", "最强", "独一无二", "史上最", "全网最低",
]

const COMMON_BANNED_WORDS_EN = [
  "best", "#1", "number one", "perfect", "guaranteed",
  "miracle", "revolutionary", "unbeatable", "risk-free",
]

const AMAZON_BANNED = [
  ...COMMON_BANNED_WORDS_ZH,
  ...COMMON_BANNED_WORDS_EN,
  "cheap", "free shipping", "limited time", "act now",
  "sale", "discount", "promotion", "bonus",
]

// ─── Platform rules ─────────────────────────────────────────────

type PlatformRules = {
  title: { minLen: number; maxLen: number; tips: string[] }
  bulletPoints: { count: number; maxPerPoint: number }
  shortDesc: { minLen: number; maxLen: number }
  longDesc: { minLen: number; maxLen: number }
  seoKeywords: { minCount: number; maxCount: number }
  bannedWords: string[]
}

const PLATFORM_RULES: Record<string, PlatformRules> = {
  amazon: {
    title: {
      minLen: 80,
      maxLen: 200,
      tips: ["核心关键词放最前面", "品牌名建议出现在标题开头"],
    },
    bulletPoints: { count: 5, maxPerPoint: 500 },
    shortDesc: { minLen: 50, maxLen: 500 },
    longDesc: { minLen: 200, maxLen: 2000 },
    seoKeywords: { minCount: 5, maxCount: 20 },
    bannedWords: AMAZON_BANNED,
  },
  shopify: {
    title: {
      minLen: 20,
      maxLen: 70,
      tips: ["SEO 友好标题建议 60-70 字符"],
    },
    bulletPoints: { count: 3, maxPerPoint: 300 },
    shortDesc: { minLen: 120, maxLen: 160 },
    longDesc: { minLen: 300, maxLen: 5000 },
    seoKeywords: { minCount: 3, maxCount: 10 },
    bannedWords: COMMON_BANNED_WORDS_ZH,
  },
  tiktok: {
    title: {
      minLen: 10,
      maxLen: 60,
      tips: ["短小有冲击力", "适合配合短视频展示"],
    },
    bulletPoints: { count: 3, maxPerPoint: 200 },
    shortDesc: { minLen: 20, maxLen: 150 },
    longDesc: { minLen: 50, maxLen: 1000 },
    seoKeywords: { minCount: 3, maxCount: 10 },
    bannedWords: COMMON_BANNED_WORDS_ZH,
  },
  // Defaults for other platforms
  _default: {
    title: { minLen: 30, maxLen: 200, tips: [] },
    bulletPoints: { count: 5, maxPerPoint: 500 },
    shortDesc: { minLen: 50, maxLen: 500 },
    longDesc: { minLen: 200, maxLen: 3000 },
    seoKeywords: { minCount: 3, maxCount: 15 },
    bannedWords: COMMON_BANNED_WORDS_ZH,
  },
}

function getRules(platform: string): PlatformRules {
  return PLATFORM_RULES[platform] || PLATFORM_RULES._default
}

// ─── Individual check functions ─────────────────────────────────

function checkBannedWords(
  content: string,
  bannedWords: string[],
  customBanned?: string | null
): CheckResult {
  const allBanned = [...bannedWords]
  if (customBanned) {
    allBanned.push(
      ...customBanned.split(/[,，、\n]/).map((w) => w.trim()).filter(Boolean)
    )
  }

  const lower = content.toLowerCase()
  const found = allBanned.filter((w) => lower.includes(w.toLowerCase()))

  if (found.length === 0) {
    return {
      id: "banned-words",
      label: "违禁词检查",
      severity: "pass",
      message: "未检测到违禁词",
    }
  }
  return {
    id: "banned-words",
    label: "违禁词检查",
    severity: "fail",
    message: `包含违禁词：${found.slice(0, 5).join("、")}${found.length > 5 ? ` 等 ${found.length} 个` : ""}`,
  }
}

function checkLength(
  content: string,
  min: number,
  max: number,
  label: string
): CheckResult {
  const len = content.length
  if (len < min) {
    return {
      id: `length-${label}`,
      label: `${label}长度`,
      severity: "warn",
      message: `当前 ${len} 字符，建议至少 ${min} 字符`,
      value: len,
      limit: min,
    }
  }
  if (len > max) {
    return {
      id: `length-${label}`,
      label: `${label}长度`,
      severity: "fail",
      message: `当前 ${len} 字符，超出上限 ${max} 字符`,
      value: len,
      limit: max,
    }
  }
  return {
    id: `length-${label}`,
    label: `${label}长度`,
    severity: "pass",
    message: `${len} 字符（${min}-${max}）`,
    value: len,
    limit: max,
  }
}

function checkKeywordCoverage(
  content: string,
  keywords: string | null
): CheckResult {
  if (!keywords) {
    return {
      id: "keyword-coverage",
      label: "关键词覆盖",
      severity: "warn",
      message: "项目未设置关键词，无法检测覆盖率",
    }
  }

  const keywordList = keywords
    .split(/[,，、\n]/)
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 1)

  if (keywordList.length === 0) {
    return {
      id: "keyword-coverage",
      label: "关键词覆盖",
      severity: "warn",
      message: "关键词为空",
    }
  }

  const lower = content.toLowerCase()
  const covered = keywordList.filter((k) => lower.includes(k))
  const ratio = covered.length / keywordList.length

  if (ratio >= 0.7) {
    return {
      id: "keyword-coverage",
      label: "关键词覆盖",
      severity: "pass",
      message: `覆盖 ${covered.length}/${keywordList.length} 个关键词（${Math.round(ratio * 100)}%）`,
      value: covered.length,
      limit: keywordList.length,
    }
  }
  if (ratio >= 0.4) {
    return {
      id: "keyword-coverage",
      label: "关键词覆盖",
      severity: "warn",
      message: `仅覆盖 ${covered.length}/${keywordList.length} 个关键词，建议补充`,
      value: covered.length,
      limit: keywordList.length,
    }
  }
  return {
    id: "keyword-coverage",
    label: "关键词覆盖",
    severity: "fail",
    message: `仅覆盖 ${covered.length}/${keywordList.length} 个关键词，覆盖率过低`,
    value: covered.length,
    limit: keywordList.length,
  }
}

function checkBrandName(
  content: string,
  brandName: string | null,
  platform: string
): CheckResult {
  if (!brandName) {
    if (platform === "amazon") {
      return {
        id: "brand-name",
        label: "品牌名称",
        severity: "warn",
        message: "项目未设置品牌名，Amazon 标题建议包含品牌",
      }
    }
    return {
      id: "brand-name",
      label: "品牌名称",
      severity: "pass",
      message: "未设置品牌名，跳过检查",
    }
  }

  const lower = content.toLowerCase()
  const brandLower = brandName.toLowerCase()

  if (!lower.includes(brandLower)) {
    return {
      id: "brand-name",
      label: "品牌名称",
      severity: platform === "amazon" ? "fail" : "warn",
      message: `标题中未包含品牌名「${brandName}」`,
    }
  }

  // Check if brand is at the beginning (Amazon best practice)
  if (platform === "amazon") {
    const first50 = lower.slice(0, 50)
    if (!first50.includes(brandLower)) {
      return {
        id: "brand-name",
        label: "品牌名称",
        severity: "warn",
        message: `品牌名「${brandName}」建议放在标题开头`,
      }
    }
  }

  return {
    id: "brand-name",
    label: "品牌名称",
    severity: "pass",
    message: `标题包含品牌名「${brandName}」`,
  }
}

function checkBulletPoints(
  content: string,
  expectedCount: number,
  maxPerPoint: number
): CheckResult[] {
  const results: CheckResult[] = []

  // Split by newline, filter empty lines
  const points = content
    .split(/\n/)
    .map((l) => l.replace(/^[\s•\-\d.、]+/, "").trim())
    .filter((l) => l.length > 0)

  if (points.length < expectedCount) {
    results.push({
      id: "bullet-count",
      label: "要点数量",
      severity: "warn",
      message: `当前 ${points.length} 条，建议 ${expectedCount} 条`,
      value: points.length,
      limit: expectedCount,
    })
  } else {
    results.push({
      id: "bullet-count",
      label: "要点数量",
      severity: "pass",
      message: `${points.length} 条要点`,
      value: points.length,
      limit: expectedCount,
    })
  }

  const longPoints = points.filter((p) => p.length > maxPerPoint)
  if (longPoints.length > 0) {
    results.push({
      id: "bullet-length",
      label: "要点长度",
      severity: "warn",
      message: `${longPoints.length} 条要点超过 ${maxPerPoint} 字符`,
    })
  }

  return results
}

function checkSellingPointCoverage(
  content: string,
  sellingPoints: string | null
): CheckResult {
  if (!sellingPoints) {
    return {
      id: "selling-points",
      label: "卖点覆盖",
      severity: "pass",
      message: "未设置卖点，跳过检查",
    }
  }

  const points = sellingPoints
    .split(/[,，、\n]/)
    .map((p) => p.trim().toLowerCase())
    .filter((p) => p.length > 2)

  if (points.length === 0) {
    return {
      id: "selling-points",
      label: "卖点覆盖",
      severity: "pass",
      message: "卖点为空",
    }
  }

  const lower = content.toLowerCase()
  const covered = points.filter((p) => lower.includes(p))
  const ratio = covered.length / points.length

  return {
    id: "selling-points",
    label: "卖点覆盖",
    severity: ratio >= 0.5 ? "pass" : "warn",
    message: `覆盖 ${covered.length}/${points.length} 个核心卖点`,
    value: covered.length,
    limit: points.length,
  }
}

// ─── Main checker ───────────────────────────────────────────────

type CheckInput = {
  platform: string
  contentType: string
  content: string
  keywords?: string | null
  brandName?: string | null
  sellingPoints?: string | null
  bannedWords?: string | null
}

export function checkListing(input: CheckInput): QualityReport {
  const { platform, contentType, content, keywords, brandName, sellingPoints, bannedWords } = input
  const rules = getRules(platform)
  const checks: CheckResult[] = []

  switch (contentType) {
    case "title": {
      checks.push(checkLength(content, rules.title.minLen, rules.title.maxLen, "标题"))
      checks.push(checkBannedWords(content, rules.bannedWords, bannedWords))
      checks.push(checkKeywordCoverage(content, keywords || null))
      checks.push(checkBrandName(content, brandName || null, platform))
      break
    }
    case "bulletPoints": {
      checks.push(
        ...checkBulletPoints(content, rules.bulletPoints.count, rules.bulletPoints.maxPerPoint)
      )
      checks.push(checkBannedWords(content, rules.bannedWords, bannedWords))
      checks.push(checkSellingPointCoverage(content, sellingPoints || null))
      checks.push(checkKeywordCoverage(content, keywords || null))
      break
    }
    case "shortDesc": {
      checks.push(checkLength(content, rules.shortDesc.minLen, rules.shortDesc.maxLen, "短描述"))
      checks.push(checkBannedWords(content, rules.bannedWords, bannedWords))
      checks.push(checkKeywordCoverage(content, keywords || null))
      break
    }
    case "longDesc": {
      checks.push(checkLength(content, rules.longDesc.minLen, rules.longDesc.maxLen, "长描述"))
      checks.push(checkBannedWords(content, rules.bannedWords, bannedWords))
      checks.push(checkKeywordCoverage(content, keywords || null))
      checks.push(checkSellingPointCoverage(content, sellingPoints || null))
      break
    }
    case "seoKeywords": {
      const kwList = content
        .split(/[,，、\n]/)
        .map((k) => k.trim())
        .filter(Boolean)
      const uniqueKw = new Set(kwList.map((k) => k.toLowerCase()))

      checks.push({
        id: "kw-count",
        label: "关键词数量",
        severity:
          uniqueKw.size >= rules.seoKeywords.minCount && uniqueKw.size <= rules.seoKeywords.maxCount
            ? "pass"
            : uniqueKw.size < rules.seoKeywords.minCount
              ? "warn"
              : "fail",
        message: `${uniqueKw.size} 个关键词（建议 ${rules.seoKeywords.minCount}-${rules.seoKeywords.maxCount}）`,
        value: uniqueKw.size,
        limit: rules.seoKeywords.maxCount,
      })

      if (uniqueKw.size < kwList.length) {
        checks.push({
          id: "kw-duplicates",
          label: "重复关键词",
          severity: "warn",
          message: `存在 ${kwList.length - uniqueKw.size} 个重复关键词`,
        })
      }
      break
    }
    case "adCopy":
    case "brandStory": {
      checks.push(checkBannedWords(content, rules.bannedWords, bannedWords))
      checks.push(
        checkLength(content, 50, 2000, contentType === "adCopy" ? "广告文案" : "品牌故事")
      )
      break
    }
    default: {
      // Image types or unknown — minimal checks
      if (content) {
        checks.push(checkBannedWords(content, rules.bannedWords, bannedWords))
      }
    }
  }

  // Calculate score
  const total = checks.length
  if (total === 0) {
    return { platform, contentType, score: 100, checks }
  }
  const passCount = checks.filter((c) => c.severity === "pass").length
  const warnCount = checks.filter((c) => c.severity === "warn").length
  const score = Math.round(((passCount + warnCount * 0.5) / total) * 100)

  return { platform, contentType, score, checks }
}
