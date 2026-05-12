import { Navbar } from "@/components/home/navbar"
import { SessionProvider } from "next-auth/react"

export default function Home() {
  return (
    <SessionProvider>
      <Navbar />
      <div style={{ padding: 40, fontFamily: "sans-serif", marginTop: 80 }}>
        <h1>AI跨境通 测试 - Navbar</h1>
        <a href="/login">去登录</a> | <a href="/dashboard">工作台</a>
      </div>
    </SessionProvider>
  )
}
