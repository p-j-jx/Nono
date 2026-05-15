/**
 * Platform format export — transforms generated content into
 * platform-specific file formats for direct upload.
 *
 * Supports: Amazon Flat File (TSV), Shopify CSV, generic TXT.
 */

import type { GenerationRecord } from "@/types"

// ─── Types ─────────────────────────────────────────────────────

export type ExportFormat = "amazon-tsv" | "shopify-csv" | "generic-txt"

export type ExportResult = {
  filename: string
  mimeType: string
  content: string
}

type ContentMap = Record<string, string>

// ─── Helpers ───────────────────────────────────────────────────

function buildContentMap(records: GenerationRecord[]): ContentMap {
  const map: ContentMap = {}
  // Use the newest record for each content type
  for (const r of records) {
    if (r.content && !map[r.contentType]) {
      map[r.contentType] = r.content
    }
  }
  return map
}

/** Escape a field for TSV (tabs → spaces, newlines → \\n literal) */
function tsvEscape(val: string): string {
  return val.replace(/\t/g, " ").replace(/\n/g, "\\n").replace(/\r/g, "")
}

/** Escape a field for CSV (wrap in quotes, double-quote internal quotes) */
function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

/** Split bullet points from a single text block */
function parseBulletPoints(text: string): string[] {
  return text
    .split(/\n/)
    .map((l) => l.replace(/^[\s•\-\d.、]+/, "").trim())
    .filter((l) => l.length > 0)
}

// ─── Amazon Flat File (TSV) ────────────────────────────────────

function exportAmazonTSV(
  productName: string,
  records: GenerationRecord[],
  meta: { brandName?: string; keywords?: string }
): ExportResult {
  const cm = buildContentMap(records)
  const bullets = cm.bulletPoints ? parseBulletPoints(cm.bulletPoints) : []

  // Amazon Flat File columns (simplified for Listing Loader)
  const headers = [
    "item_name",
    "brand_name",
    "bullet_point1",
    "bullet_point2",
    "bullet_point3",
    "bullet_point4",
    "bullet_point5",
    "product_description",
    "generic_keywords",
  ]

  const values = [
    tsvEscape(cm.title || productName),
    tsvEscape(meta.brandName || ""),
    tsvEscape(bullets[0] || ""),
    tsvEscape(bullets[1] || ""),
    tsvEscape(bullets[2] || ""),
    tsvEscape(bullets[3] || ""),
    tsvEscape(bullets[4] || ""),
    tsvEscape(cm.longDesc || cm.shortDesc || ""),
    tsvEscape(meta.keywords || cm.seoKeywords || ""),
  ]

  const content = headers.join("\t") + "\n" + values.join("\t") + "\n"

  return {
    filename: `${productName}-amazon-flat-file.tsv`,
    mimeType: "text/tab-separated-values;charset=utf-8",
    content,
  }
}

// ─── Shopify CSV ───────────────────────────────────────────────

function exportShopifyCSV(
  productName: string,
  records: GenerationRecord[],
  meta: { brandName?: string; keywords?: string }
): ExportResult {
  const cm = buildContentMap(records)

  // Shopify product CSV columns
  const headers = [
    "Handle",
    "Title",
    "Body (HTML)",
    "Vendor",
    "Tags",
    "SEO Title",
    "SEO Description",
  ]

  // Generate handle from product name
  const handle = productName
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, "-")
    .replace(/^-|-$/g, "")

  // Build HTML body from long desc
  let bodyHtml = ""
  if (cm.longDesc) {
    const paragraphs = cm.longDesc.split(/\n\n?/).filter(Boolean)
    bodyHtml = paragraphs.map((p) => `<p>${p.trim()}</p>`).join("\n")
  }

  // Tags from SEO keywords
  const tags = (meta.keywords || cm.seoKeywords || "")
    .split(/[,，、\n]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .join(", ")

  const values = [
    csvEscape(handle),
    csvEscape(cm.title || productName),
    csvEscape(bodyHtml),
    csvEscape(meta.brandName || ""),
    csvEscape(tags),
    csvEscape(cm.title || productName),
    csvEscape(cm.shortDesc || ""),
  ]

  const content = headers.join(",") + "\n" + values.join(",") + "\n"

  return {
    filename: `${productName}-shopify.csv`,
    mimeType: "text/csv;charset=utf-8",
    content,
  }
}

// ─── Generic TXT ───────────────────────────────────────────────

function exportGenericTXT(
  productName: string,
  records: GenerationRecord[],
  meta: { platform?: string }
): ExportResult {
  const cm = buildContentMap(records)
  const platformLabel = meta.platform || "通用"

  const sections: string[] = []
  sections.push(`# ${productName}`)
  sections.push(`# 平台: ${platformLabel}`)
  sections.push(`# 导出时间: ${new Date().toLocaleString("zh-CN")}`)
  sections.push("")

  const typeLabels: Record<string, string> = {
    title: "商品标题",
    bulletPoints: "要点描述",
    shortDesc: "短描述",
    longDesc: "长描述",
    adCopy: "广告文案",
    seoKeywords: "SEO关键词",
    brandStory: "品牌故事",
  }

  const order = ["title", "bulletPoints", "shortDesc", "longDesc", "adCopy", "seoKeywords", "brandStory"]

  for (const key of order) {
    if (cm[key]) {
      sections.push(`═══ ${typeLabels[key] || key} ═══`)
      sections.push(cm[key])
      sections.push("")
    }
  }

  return {
    filename: `${productName}-${platformLabel}-全部内容.txt`,
    mimeType: "text/plain;charset=utf-8",
    content: sections.join("\n"),
  }
}

// ─── Main export function ──────────────────────────────────────

export function exportForPlatform(
  format: ExportFormat,
  productName: string,
  records: GenerationRecord[],
  meta: {
    brandName?: string
    keywords?: string
    platform?: string
  } = {}
): ExportResult {
  // Sort records by newest first so buildContentMap picks newest
  const sorted = [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  switch (format) {
    case "amazon-tsv":
      return exportAmazonTSV(productName, sorted, meta)
    case "shopify-csv":
      return exportShopifyCSV(productName, sorted, meta)
    case "generic-txt":
      return exportGenericTXT(productName, sorted, meta)
    default:
      return exportGenericTXT(productName, sorted, meta)
  }
}

/** Trigger a browser download from an ExportResult */
export function downloadExport(result: ExportResult) {
  const bom = "﻿" // BOM for Excel compatibility
  const blob = new Blob([bom + result.content], { type: result.mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = result.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Get available export formats for a given platform */
export function getAvailableFormats(platform: string): Array<{
  format: ExportFormat
  label: string
  desc: string
}> {
  const formats: Array<{ format: ExportFormat; label: string; desc: string }> = []

  if (platform === "amazon") {
    formats.push({
      format: "amazon-tsv",
      label: "Amazon Flat File (TSV)",
      desc: "可直接导入 Seller Central 的 Listing Loader 格式",
    })
  }

  if (platform === "shopify") {
    formats.push({
      format: "shopify-csv",
      label: "Shopify 产品 CSV",
      desc: "可直接导入 Shopify 后台的产品 CSV 格式",
    })
  }

  // Always available
  formats.push({
    format: "generic-txt",
    label: "全部内容 (TXT)",
    desc: "所有文案内容的纯文本汇总",
  })

  return formats
}
