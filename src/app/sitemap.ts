import type { MetadataRoute } from "next"

const siteUrl = "https://www.ai-cea.com"

/**
 * 站点地图：只收录公开的营销/落地页面。
 * Dashboard、admin、API 等需登录的私有路由不应被搜索引擎抓取。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority: number
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/login", changeFrequency: "monthly", priority: 0.3 },
    { path: "/register", changeFrequency: "monthly", priority: 0.5 },
  ]

  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
