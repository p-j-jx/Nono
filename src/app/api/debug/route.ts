import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { createClient } = await import("@libsql/client")

    const hasDbUrl = !!process.env.DATABASE_URL
    const hasAuthToken = !!process.env.TURSO_AUTH_TOKEN
    const hasAuthSecret = !!process.env.AUTH_SECRET
    const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY

    const info: Record<string, unknown> = {
      env: {
        DATABASE_URL: hasDbUrl ? `${process.env.DATABASE_URL?.slice(0, 20)}...` : "未设置",
        TURSO_AUTH_TOKEN: hasAuthToken ? "已设置" : "未设置",
        AUTH_SECRET: hasAuthSecret ? "已设置" : "未设置",
        DEEPSEEK_API_KEY: hasDeepSeek ? "已设置" : "未设置",
      },
    }

    // Test DB connection
    if (hasDbUrl && hasAuthToken) {
      try {
        const db = createClient({
          url: process.env.DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN!,
        })
        const result = await db.execute("SELECT 1 as ping")
        info["db_test"] = `连接成功: ${JSON.stringify(result.rows)}`
      } catch (e) {
        info["db_test"] = `连接失败: ${e instanceof Error ? e.message : String(e)}`
      }
    }

    return NextResponse.json(info)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
