import { Navbar } from "@/components/home/navbar"
import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Platforms } from "@/components/home/platforms"
import { Features } from "@/components/home/features"
import { OutputShowcase } from "@/components/home/output-showcase"
import { HowItWorks } from "@/components/home/how-it-works"
import { UseCases } from "@/components/home/use-cases"
import { Pricing } from "@/components/home/pricing"
import { FAQ } from "@/components/home/faq"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/home/footer"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  const serializableSession = session
    ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
        },
        expires: session.expires,
      }
    : null

  return (
    <SessionProvider session={serializableSession}>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Platforms />
        <Features />
        <OutputShowcase />
        <HowItWorks />
        <UseCases />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </SessionProvider>
  )
}
