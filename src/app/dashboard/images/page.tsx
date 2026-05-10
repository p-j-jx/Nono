import { QuickGenerate } from "@/components/dashboard/quick-generate"

const contentTypeOptions = [
  { key: "mainImage", label: "商品主图", desc: "产品主图/白底图" },
  { key: "sceneImage", label: "场景图", desc: "产品使用场景图" },
  { key: "banner", label: "Banner 图", desc: "横幅广告图" },
  { key: "socialMediaImage", label: "社媒图", desc: "社交媒体配图" },
  { key: "promoPoster", label: "促销海报", desc: "促销活动海报" },
]

export default function ImagesPage() {
  return (
    <QuickGenerate
      title="图片生成"
      description="利用 AI 生成高质量商品图片和营销视觉素材"
      accentGradient="from-sky-500 to-blue-500"
      accentColor="text-sky-600 dark:text-sky-400"
      contentTypeOptions={contentTypeOptions}
      defaultContentTypes={["mainImage", "sceneImage"]}
    />
  )
}
