"use client"

import { useState } from "react"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Package, Store, Music2, Check, Copy } from "lucide-react"

type PlatformKey = "amazon" | "shopify" | "tiktok"

const platforms: Array<{
  key: PlatformKey
  name: string
  tag: string
  icon: typeof Package
  accent: string
  accentMuted: string
}> = [
  {
    key: "amazon",
    name: "Amazon",
    tag: "A9 算法优化",
    icon: Package,
    accent: "text-platform-amazon",
    accentMuted: "bg-platform-amazon-muted",
  },
  {
    key: "shopify",
    name: "Shopify",
    tag: "品牌独立站",
    icon: Store,
    accent: "text-platform-shopify",
    accentMuted: "bg-platform-shopify-muted",
  },
  {
    key: "tiktok",
    name: "TikTok",
    tag: "短视频带货",
    icon: Music2,
    accent: "text-platform-tiktok",
    accentMuted: "bg-platform-tiktok-muted",
  },
]

const sampleInput = {
  product: "无线蓝牙降噪耳机 Pro Max",
  category: "消费电子 / 音频设备",
  sellingPoints: ["主动降噪 ANC", "40 小时续航", "Hi-Res 高清音质", "可折叠便携"],
}

const outputs: Record<
  PlatformKey,
  {
    title: string
    titleLabel: string
    bullets: { label: string; text: string }[]
  }
> = {
  amazon: {
    titleLabel: "Product Title",
    title:
      "Wireless Bluetooth 5.3 Headphones, Active Noise Cancelling Over-Ear, 40Hr Playtime, Hi-Res Audio, Foldable Design with Carrying Case",
    bullets: [
      {
        label: "Bullet 1",
        text: "INDUSTRY-LEADING ANC: Hybrid active noise cancellation reduces ambient noise by up to 35dB, ideal for travel and focus work.",
      },
      {
        label: "Bullet 2",
        text: "40-HOUR BATTERY LIFE: Listen all week on a single charge. 10-minute quick charge gives you 5 hours of playback.",
      },
      {
        label: "Bullet 3",
        text: "HI-RES CERTIFIED AUDIO: 40mm dynamic drivers deliver studio-grade sound with deep bass and crystal-clear highs.",
      },
    ],
  },
  shopify: {
    titleLabel: "产品页标题",
    title: "ProSound Max 无线降噪耳机 — 为深度聆听而生",
    bullets: [
      {
        label: "品牌故事",
        text: "我们相信，好声音应该陪你穿越喧嚣。ProSound Max 用 40 小时不间断续航和定制单元，把工作室的细腻带到通勤路上。",
      },
      {
        label: "SEO Meta",
        text: "ProSound Max 无线蓝牙降噪耳机 | 40 小时续航 · Hi-Res 音质 · 可折叠便携 | 官方店铺直供",
      },
      {
        label: "邮件首句",
        text: "你的耳朵值得更好的——本周限定，ProSound Max 8 折，仅限会员。",
      },
    ],
  },
  tiktok: {
    titleLabel: "口播脚本（3 秒钩子）",
    title: "戴上它的第一秒，整个地铁车厢都安静了。",
    bullets: [
      {
        label: "卖点 1",
        text: "通勤族必备。一键开启 ANC，把外面那个吵到爆的世界静音 35dB。",
      },
      {
        label: "Hashtag",
        text: "#降噪耳机 #通勤神器 #打工人 #数码好物 #耳机推荐 #无线蓝牙耳机",
      },
      {
        label: "信息流广告",
        text: "上班路上嘈杂崩溃？这副耳机已经让 10 万打工人重新爱上通勤。点击立即体验。",
      },
    ],
  },
}

export function OutputShowcase() {
  const [active, setActive] = useState<PlatformKey>("amazon")
  const current = outputs[active]
  const platform = platforms.find((p) => p.key === active)!

  return (
    <section className="relative border-t border-border/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimate>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              同一个产品，三种平台味道
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              切换平台，看 AI 如何根据算法和用户习惯重写文案
            </p>
          </div>
        </ScrollAnimate>

        <ScrollAnimate>
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* Left: Input card */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border/50 bg-card p-6 sticky top-24">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  输入信息
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1.5">产品</div>
                    <div className="text-sm font-medium text-foreground">
                      {sampleInput.product}
                    </div>
                  </div>

                  <div className="border-t border-border/40" />

                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1.5">品类</div>
                    <div className="text-sm text-foreground/80">{sampleInput.category}</div>
                  </div>

                  <div className="border-t border-border/40" />

                  <div>
                    <div className="text-[11px] text-muted-foreground mb-2">核心卖点</div>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleInput.sellingPoints.map((sp) => (
                        <span
                          key={sp}
                          className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-foreground/80"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  实时根据平台生成 →
                </div>
              </div>
            </div>

            {/* Right: Platform tabs + output */}
            <div className="lg:col-span-3">
              {/* Platform tabs */}
              <div className="flex items-center gap-1.5 mb-4 p-1 rounded-xl border border-border/50 bg-muted/30 w-fit">
                {platforms.map((p) => {
                  const Icon = p.icon
                  const isActive = active === p.key
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setActive(p.key)}
                      className={`relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-card text-foreground shadow-sm border border-border/40"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className={`size-3.5 ${isActive ? p.accent : ""}`} />
                      {p.name}
                    </button>
                  )
                })}
              </div>

              {/* Output card */}
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${platform.accentMuted} ${platform.accent}`}
                    >
                      {platform.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {platform.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="size-3" /> 已生成
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {current.titleLabel}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="复制"
                      >
                        <Copy className="size-3" />
                        复制
                      </button>
                    </div>
                    <div className="rounded-lg bg-muted/40 border border-border/40 p-4">
                      <p className="text-sm text-foreground leading-relaxed font-medium">
                        {current.title}
                      </p>
                    </div>
                  </div>

                  {current.bullets.map((b) => (
                    <div key={b.label}>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        {b.label}
                      </div>
                      <div className="rounded-lg bg-muted/40 border border-border/40 p-4">
                        <p className="text-sm text-foreground/85 leading-relaxed">
                          {b.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}
