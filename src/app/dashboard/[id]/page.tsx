import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { notFound, redirect } from "next/navigation"
import { ProjectDetail } from "./project-detail"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const project = await prisma.productProject.findUnique({
    where: { id },
    include: {
      records: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!project || project.userId !== session.user.id) notFound()

  return <ProjectDetail project={project} />
}
