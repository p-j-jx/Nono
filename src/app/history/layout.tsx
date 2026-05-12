import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { SessionProvider } from "next-auth/react"

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const serializableSession = {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    expires: session.expires,
  }

  return (
    <SessionProvider session={serializableSession}>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  )
}
