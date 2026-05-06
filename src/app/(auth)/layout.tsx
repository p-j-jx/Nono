import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        {/* Glow orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[400px] h-[300px] bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[300px] h-[300px] bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
          <Sparkles className="size-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          AI<span className="text-primary">跨境通</span>
        </span>
      </Link>

      {children}
    </div>
  )
}
