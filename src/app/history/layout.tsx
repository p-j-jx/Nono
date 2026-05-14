import { redirect } from "next/navigation"

export default function HistoryLayoutRedirect({
  children,
}: {
  children: React.ReactNode
}) {
  redirect("/dashboard/history")
}
