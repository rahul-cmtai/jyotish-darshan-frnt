import HeroSection from "@/components/HeroSection"
import KundliSection from "@/components/KundliSection"
import AppDownloadSection from "@/components/AppDownloadSection"
import AboutUs from "@/components/AboutUs"
import WhyChooseUs from "@/components/WhyChooseUs"
import TestimonialsSection from "@/components/TestimonialsSection"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <HeroSection />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="why-choose-us">
        <WhyChooseUs />
      </div>
      <div id="kundli">
        <KundliSection />
      </div>
      <div id="download-app">
        <AppDownloadSection />
      </div>
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <Footer />
    </main>
  )
}