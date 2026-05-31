import type { MetadataRoute } from "next"

const siteUrl = "https://www.ai-cea.com"

/**
 * 爬虫规则：允许抓取公开页面，禁止抓取登录后的私有区域与 API。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api", "/results", "/history"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
