import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { notFound, redirect } from "next/navigation"
import ProjectForm from "@/components/project-form"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const project = await prisma.productProject.findUnique({
    where: { id },
  })

  if (!project || project.userId !== session.user.id) notFound()

  return (
    <ProjectForm
      initialData={{
        id: project.id,
        productName: project.productName,
        category: project.category,
        features: project.features,
        sellingPoints: project.sellingPoints,
        keywords: project.keywords,
        useScenario: project.useScenario,
        targetAudience: project.targetAudience,
        priceRange: project.priceRange,
        brandTone: project.brandTone,
        platform: project.platform,
        language: project.language,
      }}
      projectId={project.id}
    />
  )
}
