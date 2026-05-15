"use client"

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#fafafa",
          color: "#1a1a2e",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            出了点问题
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1.5rem" }}>
            应用遇到了意外错误，请尝试刷新页面。
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              padding: "0.5rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "1px solid #ddd",
              borderRadius: "0.5rem",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  )
}
