import { Navbar } from "@/components/home/navbar"
import { Hero } from "@/components/home/hero"
import { Platforms } from "@/components/home/platforms"
import { Features } from "@/components/home/features"
import { HowItWorks } from "@/components/home/how-it-works"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/home/footer"
import { ScrollAnimate } from "@/components/scroll-animate"

export default function Home() {
  return (
    <>
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
    </>
  )
}
