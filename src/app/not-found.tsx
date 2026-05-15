import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <p className="text-6xl font-bold text-muted-foreground/20 mb-4">404</p>
      <h2 className="text-lg font-semibold mb-2">页面不存在</h2>
      <p className="text-sm text-muted-foreground mb-6">
        你访问的页面可能已被移除或地址有误。
      </p>
      <Button variant="outline" className="gap-2" render={<a href="/" />}>
        <ArrowLeft className="size-4" />
        返回首页
      </Button>
    </div>
  )
}
