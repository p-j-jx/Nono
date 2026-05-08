import type { Metadata } from "next"
import { GeistSans, GeistMono } from "geist/font"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: "AI跨境通 - AI跨境电商运营助手",
  description:
    "一站式生成亚马逊、Shopify、TikTok Shop多平台商品文案与营销图片，支持中/英/西三语，助力中国品牌高效出海。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
