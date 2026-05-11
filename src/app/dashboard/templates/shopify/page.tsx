import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Heart,
  Globe,
  Mail,
  BookOpen,
  Type,
  Tag,
  Search,
  Quote,
} from "lucide-react"

export default function ShopifyTemplatePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/templates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="size-4" />
        返回模板中心
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-background p-6 sm:p-8 mb-8">
        <div aria-hidden className="absolute -top-20 -right-20 size-64 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 right-1/3 size-72 rounded-full bg-gradient-to-tr from-teal-500/10 to-transparent blur-3xl" />
        <div className="relative">
          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-3">
            Shopify
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            品牌独立站型模板
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            独立站的核心不是流量，是品牌信任。围绕「品牌故事 + 产品叙事 + SEO Meta + 邮件营销」构建完整内容矩阵。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button render={<Link href="/dashboard/new?template=shopify" />} className="gap-2 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-500/90 hover:to-green-600/90 text-white border-0">
              <Sparkles className="size-4" />
              使用此模板
            </Button>
            <Button variant="outline" render={<Link href="/dashboard/templates" />}>
              对比其他模板
            </Button>
          </div>
        </div>
      </div>

      {/* Content Matrix Overview */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <BookOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">内容矩阵</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, label: "Brand Story", desc: "品牌使命与价值观", color: "text-rose-500" },
            { icon: Type, label: "Product Narrative", desc: "产品叙事而非参数", color: "text-emerald-500" },
            { icon: Search, label: "SEO Meta", desc: "Google 搜索优化", color: "text-blue-500" },
            { icon: Mail, label: "Email Sequence", desc: "邮件营销全流程", color: "text-violet-500" },
          ].map((c) => {
            const Icon = c.icon
            return (
              <Card key={c.label}>
                <CardContent className="p-4">
                  <Icon className={`size-5 ${c.color} mb-2`} />
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Brand Story Example */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Heart className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">品牌故事示例</h2>
          <span className="text-xs text-muted-foreground">示例商品：女士瑜伽套装</span>
        </div>
        <Card className="border-l-4 border-l-emerald-500/60">
          <CardContent className="p-6">
            <Quote className="size-6 text-emerald-500/30 mb-3" />
            <div className="space-y-3 text-sm leading-relaxed font-serif">
              <p className="text-foreground/90">
                <span className="text-base font-semibold not-italic">FlowLine</span> was born in a small Brooklyn studio in 2021, when our founder Maya found herself constantly tugging at uncomfortable yoga pants mid-pose.
              </p>
              <p className="text-foreground/80">
                <em className="text-emerald-600 dark:text-emerald-400 not-italic font-medium">&ldquo;Why does activewear designed for women still squeeze, ride up, and lose shape after a few washes?&rdquo;</em>
              </p>
              <p className="text-foreground/80">
                We set out to build the activewear we wished existed. Every piece is engineered with <strong className="text-foreground">4-way stretch fabric</strong>, <strong className="text-foreground">squat-proof opacity</strong>, and a flatlock seam construction that moves with your body—not against it.
              </p>
              <p className="text-foreground/70 italic">
                Today, FlowLine pieces are worn by 50,000+ women in 32 countries—from sunrise yoga to weekend hikes.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-emerald-600">2021</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Founded</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">50K+</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Customers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">32</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Product Description */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Type className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">产品描述（叙事型）</h2>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">The Everyday Flow Set — Made to Move With You</h3>
            <p className="text-sm leading-relaxed text-foreground/80">
              From morning yoga to mid-afternoon errands, the <em>Everyday Flow Set</em> is designed for the way you actually live. Ultra-soft buttery fabric hugs your curves without compression, while a high-rise waistband stays put through every downward dog and side stretch.
            </p>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">Features</p>
              <ul className="space-y-1.5 text-sm text-foreground/80">
                <li>· <strong>4-Way Stretch Fabric</strong> — 78% Nylon, 22% Spandex</li>
                <li>· <strong>Squat-Proof Opacity</strong> — Tested by 200+ women</li>
                <li>· <strong>Flatlock Seams</strong> — Zero chafing, even on long runs</li>
                <li>· <strong>Hidden Pocket</strong> — Fits cards, keys, AirPods</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">Fit & Care</p>
              <p className="text-sm text-foreground/70">
                True to size. Wash cold, hang dry. Available in 6 colors—from classic Midnight Black to limited-edition Sage Green.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SEO Meta */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Globe className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">SEO Meta 信息</h2>
        </div>

        {/* Google Preview */}
        <Card className="mb-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="size-3.5" />
              Google 搜索预览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-background p-4 font-sans">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-0.5">flowline.com › collections › yoga-set</p>
              <h4 className="text-lg text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-tight">
                Everyday Flow Yoga Set — High-Rise Leggings + Sports Bra | FlowLine
              </h4>
              <p className="text-sm text-muted-foreground mt-1 leading-snug">
                Ultra-soft 4-way stretch yoga set with squat-proof opacity and hidden pocket. Designed for women who flow through life. Free shipping over $75.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Meta Title (60 字符)</p>
              <p className="text-sm font-mono leading-relaxed bg-muted/30 rounded p-2">
                Everyday Flow Yoga Set | FlowLine
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Meta Description (155 字符)</p>
              <p className="text-sm font-mono leading-relaxed bg-muted/30 rounded p-2">
                Ultra-soft 4-way stretch leggings + sports bra. Squat-proof, hidden pocket. Free shipping over $75.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="size-3.5 text-emerald-600" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Target Keywords</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "yoga set women",
                "high waist leggings",
                "matching workout set",
                "buttery soft leggings",
                "squat proof leggings",
                "sustainable activewear",
              ].map((k) => (
                <span key={k} className="inline-flex items-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-xs font-medium">
                  {k}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Email Sequence */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Mail className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold">邮件营销序列</h2>
          <span className="text-xs text-muted-foreground">·欢迎流程</span>
        </div>
        <div className="space-y-3">
          {[
            {
              when: "Day 0 · 立即",
              subject: "Welcome to the FlowLine fam 🌿 — Here's 15% off",
              preview: "Maya here. Thanks for joining—let me tell you why we built this...",
              type: "Welcome",
            },
            {
              when: "Day 2",
              subject: "The science behind our buttery soft fabric",
              preview: "Curious why our leggings stay opaque after 100 washes? Here's the story...",
              type: "Education",
            },
            {
              when: "Day 5",
              subject: "What 50,000 women are saying about us",
              preview: '"Best leggings I\'ve ever owned." — Sarah K., New York · Read more reviews...',
              type: "Social Proof",
            },
            {
              when: "Day 7",
              subject: "Your 15% off expires tonight ⏰",
              preview: "Last chance to use code WELCOME15 — your cart is waiting...",
              type: "Urgency",
            },
          ].map((e) => (
            <Card key={e.when}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{e.when}</div>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{e.type}</Badge>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{e.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{e.preview}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-background">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-600" />
              准备好让 AI 帮你打造完整品牌内容矩阵了吗？
            </h3>
            <p className="text-sm text-muted-foreground">
              输入商品和品牌信息，AI 将为你生成品牌故事、产品描述、SEO Meta 和邮件营销文案。
            </p>
          </div>
          <Button render={<Link href="/dashboard/new?template=shopify" />} size="lg" className="gap-2 shrink-0 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-500/90 hover:to-green-600/90 text-white border-0">
            <Sparkles className="size-4" />
            使用此模板
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
