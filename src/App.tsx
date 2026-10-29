import { MotionProvider } from '@/components/MotionProvider'
import { Footer } from '@/components/layout/Footer'
import { Marquee } from '@/components/layout/Marquee'
import { Navbar } from '@/components/layout/Navbar'
import { ContactTopicProvider } from '@/features/coffee/ContactTopicProvider'
import { BrewSection } from '@/sections/brew/BrewSection'
import { CoffeeMenuSection } from '@/sections/coffee/CoffeeMenuSection'
import { ContactSection } from '@/sections/contact/ContactSection'
import { HeroSection } from '@/sections/hero/HeroSection'
import { StorySection } from '@/sections/story/StorySection'

function App() {
  return (
    <MotionProvider>
      <ContactTopicProvider>
        <Navbar />
        <main>
          <HeroSection />
          <Marquee />
          <BrewSection />
          <StorySection />
          <CoffeeMenuSection />
          <ContactSection />
        </main>
        <Footer />
      </ContactTopicProvider>
    </MotionProvider>
  )
}

export default App
