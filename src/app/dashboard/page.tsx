import { auth } from "@/lib/auth"
import { prisma } from "@/db/prisma"
import { DashboardBackground } from "@/components/dashboard/dashboard-background"
import { OnboardingBanner } from "@/components/dashboard/onboarding-banner"
import { UsageBar } from "@/components/dashboard/usage-bar"
import { MONTHLY_QUOTA } from "@/lib/quota"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { StatCards } from "@/components/dashboard/stat-cards"
import { TemplateCards } from "@/components/dashboard/template-cards"
import { ProjectList } from "@/components/dashboard/project-list"
import { RecentProjects } from "@/components/dashboard/recent-projects"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Start of current month for usage quota tracking (resets monthly)
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [projects, todayRecords, monthGenerations, monthAnalyses] = await Promise.all([
    prisma.productProject.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { records: true } } },
    }),
    prisma.generationRecord.count({
      where: {
        project: { userId: session.user.id },
        createdAt: { gte: today },
      },
    }),
    // Generations counted toward this month's quota
    prisma.generationRecord.count({
      where: {
        project: { userId: session.user.id },
        createdAt: { gte: monthStart },
      },
    }),
    // Analyses also count toward quota (competitor / quality / tax)
    prisma.analysisRecord.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: monthStart },
      },
    }).catch(() => 0), // AnalysisRecord table may not exist on fresh DB
  ])

  const favoritedCount = await prisma.generationRecord.count({
    where: {
      project: { userId: session.user.id },
      favorited: true,
    },
  })

  const totalGenerations = projects.reduce((sum, p) => sum + p._count.records, 0)
  const monthlyUsed = monthGenerations + monthAnalyses

  return (
    <>
      <DashboardBackground />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Onboarding banner — only shown to new users without projects */}
        {projects.length === 0 && (
          <section className="mb-8">
            <OnboardingBanner hasProjects={false} />
          </section>
        )}

        {/* Usage bar — only shown to users who have started using the platform */}
        {projects.length > 0 && (
          <section className="mb-6">
            <UsageBar
              used={monthlyUsed}
              quota={MONTHLY_QUOTA}
              breakdown={{ generations: monthGenerations, analyses: monthAnalyses }}
            />
          </section>
        )}

        {/* Welcome + Quick Actions — tight cluster */}
        <div className="space-y-6">
          <section>
            <WelcomeHeader
              userName={session.user.name || "用户"}
              projectCount={projects.length}
              todayRecords={todayRecords}
              totalGenerations={totalGenerations}
            />
          </section>
          <section>
            <QuickActions />
          </section>
        </div>

        {/* Stats — breathing room above */}
        <section className="mt-10">
          <StatCards
            projectCount={projects.length}
            totalGenerations={totalGenerations}
            todayRecords={todayRecords}
            favoritedCount={favoritedCount}
          />
        </section>

        {/* Content sections — larger gaps between groups */}
        <section className="mt-12">
          <RecentProjects />
        </section>

        <section className="mt-12">
          <TemplateCards />
        </section>

        <section className="mt-12">
          <ProjectList projects={projects} />
        </section>
      </div>
    </>
  )
}
