import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { redirect, notFound } from "next/navigation"
import { ResultsView } from "./results-view"

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { projectId } = await searchParams
  if (!projectId) redirect("/dashboard")

  const project = await prisma.productProject.findUnique({
    where: { id: projectId },
    include: {
      records: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!project || project.userId !== session.user.id) notFound()

  return <ResultsView project={project} />
}
