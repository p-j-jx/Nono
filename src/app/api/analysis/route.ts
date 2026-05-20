import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"

const VALID_TYPES = ["competitor", "quality", "tax"]

let tableEnsured = false

/** Lazily create AnalysisRecord table + indexes on Turso if missing. */
async function ensureTable() {
  if (tableEnsured) return
  try {
    const { createClient } = await import("@libsql/client")
    const dbUrl = process.env.DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN
    if (!dbUrl) {
      tableEnsured = true
      return
    }
    const db = createClient({ url: dbUrl.trim(), authToken: authToken?.trim() })
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND lower(name)='analysisrecord'"
    )
    if (tables.rows.length === 0) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS "AnalysisRecord" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "projectId" TEXT,
          "projectName" TEXT,
          "analysisType" TEXT NOT NULL,
          "inputData" TEXT NOT NULL,
          "resultData" TEXT NOT NULL,
          "summary" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "AnalysisRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `)
      try {
        await db.execute(
          `CREATE INDEX IF NOT EXISTS "AnalysisRecord_userId_createdAt_idx" ON "AnalysisRecord"("userId", "createdAt" DESC)`
        )
        await db.execute(
          `CREATE INDEX IF NOT EXISTS "AnalysisRecord_userId_analysisType_idx" ON "AnalysisRecord"("userId", "analysisType")`
        )
      } catch {}
    }
    tableEnsured = true
  } catch (err) {
    console.error("[Analysis/ensureTable]", err)
  }
}

export async function GET(req: Request) {
  await ensureTable()
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const type = url.searchParams.get("type")
    const projectId = url.searchParams.get("projectId")
    const limit = parseInt(url.searchParams.get("limit") || "20", 10)

    const where: Record<string, unknown> = { userId: session.user.id }
    if (type && VALID_TYPES.includes(type)) where.analysisType = type
    if (projectId) where.projectId = projectId

    const records = await prisma.analysisRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
    })

    return NextResponse.json({ records })
  } catch (err) {
    console.error("[Analysis/list]", err)
    return NextResponse.json({ error: "获取分析记录失败" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  await ensureTable()
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { projectId, projectName, analysisType, inputData, resultData, summary } = body

    if (!analysisType || !VALID_TYPES.includes(analysisType)) {
      return NextResponse.json({ error: "无效的分析类型" }, { status: 400 })
    }
    if (!inputData || !resultData) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    const record = await prisma.analysisRecord.create({
      data: {
        userId: session.user.id,
        projectId: projectId || null,
        projectName: projectName || null,
        analysisType,
        inputData: typeof inputData === "string" ? inputData : JSON.stringify(inputData),
        resultData: typeof resultData === "string" ? resultData : JSON.stringify(resultData),
        summary: summary || null,
      },
    })

    return NextResponse.json({ record })
  } catch (err) {
    console.error("[Analysis/create]", err)
    return NextResponse.json({ error: "保存分析记录失败" }, { status: 500 })
  }
}
