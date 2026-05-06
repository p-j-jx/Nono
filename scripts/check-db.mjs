import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

try {
  const result = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("Tables:", result.rows.map(r => r.name).join(", "));
  process.exit(0);
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
