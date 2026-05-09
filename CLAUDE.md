@AGENTS.md

# 代理 (Proxy)
- 代理地址: http://127.0.0.1:7897
- 用于访问 Vercel / Turso / Google 等外网服务
- 已在 `.claude/settings.json` 中全局设置 HTTPS_PROXY 和 HTTP_PROXY

# Vercel 生产环境
- 项目名: nono
- 固定生产 URL: https://nono-azure-ten.vercel.app
- GitHub: https://github.com/p-j-jx/Nono
- 生产环境变量在 Vercel 上设置 (AUTH_URL, AUTH_SECRET, DATABASE_URL, TURSO_AUTH_TOKEN, DEEPSEEK_API_KEY, OPENAI_API_KEY)
- 数据库: Turso (libsql://nono-db-p-j-jx.aws-ap-northeast-1.turso.io)
- 不要修改本地 .env 的 AUTH_URL！线上部署用 Vercel 环境变量中的 AUTH_URL
