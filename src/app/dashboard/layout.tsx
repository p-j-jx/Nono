import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { CommandPalette } from "@/components/dashboard/command-palette"
import { SessionProvider } from "next-auth/react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  // Ensure session is serializable - create a plain object
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
      <SidebarProvider>
        <div className="min-h-screen flex">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <DashboardHeader />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <CommandPalette />
      </SidebarProvider>
    </SessionProvider>
  )
}
