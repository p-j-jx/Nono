import { Navbar } from "@/components/home/navbar"
import { Hero } from "@/components/home/hero"
import { Platforms } from "@/components/home/platforms"
import { Features } from "@/components/home/features"
import { HowItWorks } from "@/components/home/how-it-works"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/home/footer"
import { ScrollAnimate } from "@/components/scroll-animate"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  // Serialize session to a plain object to avoid RSC serialization errors
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
        <ScrollAnimate>
          <Platforms />
        </ScrollAnimate>
        <ScrollAnimate>
          <Features />
        </ScrollAnimate>
        <ScrollAnimate>
          <HowItWorks />
        </ScrollAnimate>
        <ScrollAnimate>
          <CTASection />
        </ScrollAnimate>
      </main>
      <Footer />
    </SessionProvider>
  )
}
