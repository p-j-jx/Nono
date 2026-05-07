import { NextResponse } from "next/server"

const REQUIRED_COLUMNS: Record<string, { name: string; def: string }[]> = {
  GenerationRecord: [
    { name: "favorited", def: "BOOLEAN NOT NULL DEFAULT false" },
  ],
  User: [
    { name: "apiKey", def: "TEXT" },
    { name: "apiKeyProvider", def: "TEXT NOT NULL DEFAULT 'deepseek'" },
  ],
}

export async function GET() {
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
