import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const REQUIRED_COLUMNS: Record<string, { name: string; def: string }[]> = {
  GenerationRecord: [
    { name: "favorited", def: "BOOLEAN NOT NULL DEFAULT false" },
  ],
  User: [
    { name: "apiKey", def: "TEXT" },
    { name: "apiKeyProvider", def: "TEXT NOT NULL DEFAULT 'deepseek'" },
    { name: "imageApiKey", def: "TEXT" },
  ],
  ProductProject: [
    { name: "brandName", def: "TEXT" },
    { name: "material", def: "TEXT" },
    { name: "specifications", def: "TEXT" },
    { name: "targetCountry", def: "TEXT" },
    { name: "painPoints", def: "TEXT" },
    { name: "competitiveAdvantages", def: "TEXT" },
    { name: "festivalScenario", def: "TEXT" },
    { name: "copyStyle", def: "TEXT" },
    { name: "bannedWords", def: "TEXT" },
    { name: "isPromotional", def: "BOOLEAN NOT NULL DEFAULT false" },
    { name: "isBrandFocused", def: "BOOLEAN NOT NULL DEFAULT false" },
    { name: "visualStyle", def: "TEXT NOT NULL DEFAULT 'minimal'" },
    { name: "generationIntensity", def: "TEXT NOT NULL DEFAULT 'balanced'" },
  ],
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  const results: Record<string, string> = {}

  try {
    const { createClient } = await import("@libsql/client")

    const dbUrl = process.env.DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!dbUrl) {
      return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 })
    }

    const db = createClient({
      url: dbUrl.trim(),
      authToken: authToken?.trim(),
    })

    // Get existing tables
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    )
    const existingTables = new Set(tables.rows.map((r) => (r.name as string).toLowerCase()))

    // Create new tables that don't exist yet
    if (!existingTables.has("analysisrecord")) {
      try {
        await db.execute(`
          CREATE TABLE "AnalysisRecord" (
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
        await db.execute(`CREATE INDEX "AnalysisRecord_userId_createdAt_idx" ON "AnalysisRecord"("userId", "createdAt" DESC)`)
        await db.execute(`CREATE INDEX "AnalysisRecord_userId_analysisType_idx" ON "AnalysisRecord"("userId", "analysisType")`)
        results["AnalysisRecord (table)"] = "已创建 ✅"
      } catch (e) {
        results["AnalysisRecord (table)"] = `失败: ${e instanceof Error ? e.message : String(e)}`
      }
    } else {
      results["AnalysisRecord (table)"] = "已存在"
    }

    for (const table of tables.rows) {
      const tableName = table.name as string
      const columnsToAdd = REQUIRED_COLUMNS[tableName]
      if (!columnsToAdd) continue

      // Get existing columns for this table
      const colInfo = await db.execute(`PRAGMA table_info("${tableName}")`)
      const existingCols = new Set(
        colInfo.rows.map((r) => (r.name as string).toLowerCase())
      )

      for (const col of columnsToAdd) {
        if (existingCols.has(col.name.toLowerCase())) {
          results[`${tableName}.${col.name}`] = "已存在"
          continue
        }

        try {
          await db.execute(
            `ALTER TABLE "${tableName}" ADD COLUMN "${col.name}" ${col.def}`
          )
          results[`${tableName}.${col.name}`] = "已添加 ✅"
        } catch (e) {
          results[`${tableName}.${col.name}`] = `失败: ${e instanceof Error ? e.message : String(e)}`
        }
      }
    }

    // Also run VACUUM/ANALYZE to refresh
    try {
      await db.execute("ANALYZE")
    } catch {}

    return NextResponse.json({ success: true, results })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
