import { QuickGenerate } from "@/components/dashboard/quick-generate"

const contentTypeOptions = [
  { key: "title", label: "商品标题", desc: "SEO 优化的产品标题" },
  { key: "shortDesc", label: "短描述", desc: "简洁的产品介绍" },
  { key: "bulletPoints", label: "要点描述", desc: "核心卖点列表" },
  { key: "longDesc", label: "长描述", desc: "详细的产品描述" },
  { key: "adCopy", label: "广告文案", desc: "广告投放文案" },
  { key: "seoKeywords", label: "SEO 关键词", desc: "搜索引擎关键词" },
  { key: "brandStory", label: "品牌故事", desc: "有温度的品牌故事" },
  { key: "videoScript", label: "视频脚本", desc: "短视频带货脚本" },
]

export default function CopyPage() {
  return (
    <QuickGenerate
      title="文案生成"
      description="为你的商品生成多平台适配的专业文案，支持中英文双语"
      accentGradient="from-primary to-violet-500"
      accentColor="text-primary"
      contentTypeOptions={contentTypeOptions}
      defaultContentTypes={["title", "bulletPoints", "shortDesc", "longDesc"]}
    />
  )
}
