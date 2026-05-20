import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
  const isSecure =
    req.headers.get("x-forwarded-proto") === "https" ||
    req.url?.startsWith("https://")

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecure,
  })

  if (!token) {
    // API routes: return 401 JSON instead of redirect
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }
    // Page routes: redirect to login
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/results/:path*",
    "/history/:path*",
    "/api/projects/:path*",
    "/api/generate/:path*",
    "/api/records/:path*",
    "/api/user/:path*",
    "/api/analysis/:path*",
  ],
}
