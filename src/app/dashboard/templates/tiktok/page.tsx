import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Video,
  Sparkles,
  Music,
  Hash,
  Clapperboard,
  Zap,
  Timer,
  Heart,
  ArrowRight,
  Eye,
  ShoppingBag,
} from "lucide-react"

const videoBeats = [
  { time: "0–3s", label: "Hook 钩子", desc: "夸张反应 / 痛点提问 / 反转开场", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20" },
  { time: "3–10s", label: "Problem 痛点", desc: "放大用户痛点，建立共鸣", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20" },
  { time: "10–30s", label: "Solution 解决方案", desc: "展示产品如何解决问题", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-cyan-500/20" },
  { time: "30–50s", label: "Proof 信任背书", desc: "数据 / 评价 / 使用前后对比", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20" },
  { time: "50–60s", label: "CTA 行动召唤", desc: "点黄车 / 限时折扣 / 库存紧张", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20" },
]

const hashtagGroups = [
  { label: "爆款流量", tags: ["#TikTokMadeMeBuyIt", "#TikTokShopFinds", "#AmazonFinds"], color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { label: "品类垂直", tags: ["#SummerOOTD", "#FashionTips", "#OutfitInspo"], color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { label: "互动话题", tags: ["#GRWM", "#TryOnHaul", "#StorytimeWithMe"], color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
]

export default function TikTokTemplatePage() {
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
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-background p-6 sm:p-8 mb-8">
        <div aria-hidden className="absolute -top-20 -right-20 size-64 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-20 size-72 rounded-full bg-gradient-to-tr from-rose-500/10 to-transparent blur-3xl" />
        <div className="relative">
          <Badge variant="outline" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 mb-3">
            TikTok Shop
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            短视频带货型模板
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            围绕 60 秒短视频带货逻辑设计：3 秒钩子定生死、口播脚本逐帧分镜、爆款 Hashtag 组合 + BGM 推荐。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button render={<a href="/dashboard/new?template=tiktok" />} className="gap-2 shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-500/90 hover:to-teal-500/90 text-white border-0">
              <Sparkles className="size-4" />
              使用此模板
            </Button>
            <Button variant="outline" render={<a href="/dashboard/templates" />}>
              对比其他模板
            </Button>
          </div>
        </div>
      </div>

      {/* Video Structure */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10">
            <Clapperboard className="size-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold">60 秒视频结构</h2>
          <span className="text-xs text-muted-foreground">·黄金 5 段</span>
        </div>

        <div className="space-y-2">
          {videoBeats.map((b, i) => (
            <div key={b.time} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center min-w-[60px] h-9 px-2 rounded-lg ring-1 ${b.color} text-xs font-mono font-medium`}>
                  {b.time}
                </div>
                {i < videoBeats.length - 1 && (
                  <div aria-hidden className="w-px flex-1 bg-border/40 my-1" />
                )}
              </div>
              <Card className="flex-1">
                <CardContent className="py-2.5 px-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{b.label}</p>
                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                  </div>
                  {i === 0 && <Zap className="size-4 text-rose-500" />}
                  {i === videoBeats.length - 1 && <ShoppingBag className="size-4 text-emerald-500" />}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Script Example */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10">
            <Video className="size-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold">口播脚本示例</h2>
          <span className="text-xs text-muted-foreground">示例商品：夏季雪纺连衣裙</span>
        </div>

        <Card>
          <CardContent className="p-0">
            {[
              {
                time: "0:00",
                act: "Hook",
                emoji: "😱",
                line: '"Wait, 这条裙子真的只要 $29?!" — 镜头快速 zoom in 商品价签',
                visual: "近景商品 + 大字幕「$29 ONLY」+ 惊讶反应叠加",
                color: "border-l-rose-500",
              },
              {
                time: "0:03",
                act: "Pain",
                emoji: "😩",
                line: '"我夏天的衣服全是这种：不是太厚就是显胖，出门一身汗还不显瘦..."',
                visual: "切换：穿其它厚衣服走路出汗 / 试镜不满意的反应",
                color: "border-l-amber-500",
              },
              {
                time: "0:10",
                act: "Solution",
                emoji: "✨",
                line: '"直到我发现了这条 — 雪纺面料超透气，A 字裙摆显瘦藏肉，颜色还有 5 种..."',
                visual: "穿上裙子转圈展示 / 5 种颜色快速切换 / 慢动作飘逸感",
                color: "border-l-cyan-500",
              },
              {
                time: "0:30",
                act: "Proof",
                emoji: "🤩",
                line: '"上次穿出去被问了 8 次链接，朋友都让我发链接给她！评论区已经 500+ 留言..."',
                visual: "截图朋友圈聊天记录 / TikTok 评论区滚动 / 多人试穿对比",
                color: "border-l-violet-500",
              },
              {
                time: "0:50",
                act: "CTA",
                emoji: "🛒",
                line: '"点左下角小黄车，今晚 24 点前买送同款丝巾，库存最后 50 件，手慢无！"',
                visual: "箭头指向小黄车 + 倒计时条 + 库存数字滚动",
                color: "border-l-emerald-500",
              },
            ].map((s) => (
              <div key={s.time} className={`border-l-4 ${s.color} px-4 py-3 border-b last:border-b-0`}>
                <div className="flex items-start gap-3">
                  <div className="text-center shrink-0">
                    <div className="text-xs font-mono text-muted-foreground">{s.time}</div>
                    <div className="text-[10px] font-semibold tracking-wide text-foreground/60 mt-0.5">{s.act}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">
                      <span className="mr-1.5">{s.emoji}</span>
                      {s.line}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
                      <Eye className="size-3 mt-0.5 shrink-0" />
                      {s.visual}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Hashtags & BGM */}
      <section className="mb-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-cyan-600" />
              <CardTitle className="text-sm">Hashtag 组合策略</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {hashtagGroups.map((g) => (
              <div key={g.label}>
                <div className="text-[11px] text-muted-foreground mb-1.5">{g.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.tags.map((t) => (
                    <span key={t} className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${g.color}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/40">
              💡 推荐：3 个爆款流量 + 3 个垂直 + 2 个互动话题
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Music className="size-4 text-cyan-600" />
              <CardTitle className="text-sm">BGM 与节奏建议</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs">
              <Timer className="size-3.5 mt-0.5 text-cyan-500 shrink-0" />
              <div>
                <p className="font-medium text-foreground">BPM 120–140</p>
                <p className="text-muted-foreground">轻快节奏，搭配画面快切，符合 TikTok 用户滑动习惯</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <Heart className="size-3.5 mt-0.5 text-rose-500 shrink-0" />
              <div>
                <p className="font-medium text-foreground">使用热门 Trending Sound</p>
                <p className="text-muted-foreground">优先选择当周 TikTok 热门 BGM，蹭流量算法推荐</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <Zap className="size-3.5 mt-0.5 text-amber-500 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Beat Drop 触发卖点</p>
                <p className="text-muted-foreground">在音乐高潮点切换到产品核心卖点画面</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom CTA */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-background">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
              <Video className="size-4 text-cyan-600" />
              准备好让 AI 帮你写出爆款带货脚本了吗？
            </h3>
            <p className="text-sm text-muted-foreground">
              输入商品信息，AI 将为你生成钩子、口播脚本、分镜表、Hashtag 组合。
            </p>
          </div>
          <Button render={<a href="/dashboard/new?template=tiktok" />} size="lg" className="gap-2 shrink-0 shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-500/90 hover:to-teal-500/90 text-white border-0">
            <Sparkles className="size-4" />
            使用此模板
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
