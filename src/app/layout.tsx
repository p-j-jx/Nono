import type { Metadata } from "next"
import { DM_Sans, Noto_Sans_SC } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const siteUrl = "https://www.ai-cea.com"
const siteName = "AI跨境通"
const siteDescription =
  "一站式生成亚马逊、Shopify、TikTok Shop多平台商品文案与营销图片，支持中/英/西三语，助力中国品牌高效出海。"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI跨境通 - AI跨境电商文案与营销图片生成助手",
    template: "%s | AI跨境通",
  },
  description: siteDescription,
  keywords: [
    "跨境电商",
    "AI文案生成",
    "亚马逊listing",
    "Amazon文案",
    "Shopify文案",
    "TikTok Shop",
    "跨境电商工具",
    "商品描述生成",
    "SEO关键词",
    "营销图片生成",
    "AI营销",
    "出海工具",
  ],
  authors: [{ name: "AI跨境通" }],
  creator: "AI跨境通",
  publisher: "AI跨境通",
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName,
    title: "AI跨境通 - AI跨境电商文案与营销图片生成助手",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI跨境通 - AI跨境电商文案与营销图片生成助手",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased ${dmSans.variable} ${notoSansSC.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
