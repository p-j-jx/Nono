import { Navbar } from "@/components/home/navbar"
import { Hero } from "@/components/home/hero"
import { Footer } from "@/components/home/footer"
import { SessionProvider } from "next-auth/react"

export default function Home() {
  return (
    <SessionProvider>
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </SessionProvider>
  )
}
