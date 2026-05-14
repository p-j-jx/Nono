import { Sparkles } from "lucide-react"
import Link from "next/link"

const footerLinks = [
  {
    title: "产品",
    links: [
      { label: "功能介绍", href: "/#features" },
      { label: "平台支持", href: "/#platforms" },
    ],
  },
  {
    title: "快速入口",
    links: [
      { label: "免费注册", href: "/register" },
      { label: "立即登录", href: "/login" },
      { label: "联系我们", href: "mailto:support@aikuajingtong.com" },
    ],
  },
  {
    title: "法律",
    links: [
      { label: "隐私政策", href: "#about" },
      { label: "服务条款", href: "#about" },
    ],
  },
]

export function Footer() {
  return (
    <footer id="about" className="border-t border-border/30 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2 group">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <span className="text-base font-bold">
                AI<span className="text-primary">跨境通</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI 驱动的跨境电商运营助手，帮助中国品牌更高效地完成商品内容生成与营销素材制作。
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-semibold text-foreground/80">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/20 pt-8">
          <p className="text-center text-sm text-muted-foreground/60">
            &copy; {new Date().getFullYear()} AI跨境通. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
