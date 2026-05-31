import { ImageResponse } from "next/og"

// 社交分享卡片（微信/Twitter/LinkedIn 等分享时显示的预览图）
export const alt = "AI跨境通 - AI跨境电商文案与营销图片生成助手"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a3d2e 0%, #12705280 60%, #0a3d2e 100%)",
          backgroundColor: "#0a3d2e",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo 行 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              backgroundColor: "#2a9d78",
              marginRight: "24px",
            }}
          >
            {/* 白色圆点组成的抽象 spark 标记，不依赖字体字形 */}
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                transform: "rotate(45deg)",
              }}
            />
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700 }}>AI跨境通</div>
        </div>

        {/* 主标题 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "68px",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "32px",
          }}
        >
          <span>AI 驱动的</span>
          <span style={{ color: "#5fd4a8" }}>跨境电商内容引擎</span>
        </div>

        {/* 副标题 */}
        <div style={{ fontSize: "30px", color: "#b8ddcf", maxWidth: "900px", lineHeight: 1.4 }}>
          一站式生成 Amazon、Shopify、TikTok Shop 商品文案与营销图片，中英西三语
        </div>

        {/* 平台标签 */}
        <div style={{ display: "flex", marginTop: "48px" }}>
          {["Amazon", "Shopify", "TikTok Shop"].map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                fontSize: "24px",
                fontWeight: 600,
                color: "#0a3d2e",
                backgroundColor: "#5fd4a8",
                padding: "12px 28px",
                borderRadius: "999px",
                marginRight: "20px",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
