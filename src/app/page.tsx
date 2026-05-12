import { Navbar } from "@/components/home/navbar"
import { Hero } from "@/components/home/hero"
import { Platforms } from "@/components/home/platforms"
import { Features } from "@/components/home/features"
import { HowItWorks } from "@/components/home/how-it-works"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/home/footer"
import { ScrollAnimate } from "@/components/scroll-animate"
import { SessionProvider } from "next-auth/react"

export default function Home() {
  return (
    <SessionProvider>
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
