"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@/contexts/TranslationContext"

export default function AboutUs() {
  const { t } = useTranslation()
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#F4E6CD] to-[#E8D5B7]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252847] mb-6">
              {t("home.about.title")}
            </h2>

            {/* Sanskrit Phrase with Namaste Icon */}
            <div className="mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🙏</span>
                <p className="text-xl font-bold text-[#252847]">
                  {t("home.about.sanskritPhrase")}
                </p>
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-6">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {t("home.about.description1")}
              </p>

              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {t("home.about.description2")}
              </p>
            </div>

            {/* Panchang Button */}
            <div className="pt-4">
              <Link href="/panshang">
                <button className="bg-gradient-to-r from-[#F37D00] to-[#EA3F37] hover:from-[#F37D00]/90 hover:to-[#EA3F37]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {t("home.about.panchangButton")}
                </button>
              </Link>
            </div>
          </div>

          {/* Zodiac Wheel with Panchang Link */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative">
              <Link href="/panshang">
                <div className="cursor-pointer group">
                  <Image
                    src="/images/about.png"
                    alt="Zodiac Wheel - Astrological Chart - Click for Panchang"
                    width={500}
                    height={500}
                    className="w-full max-w-md md:max-w-lg animate-slow-spin group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse group-hover:from-transparent group-hover:via-white/20 group-hover:to-transparent transition-all duration-300"></div>
                  
                  {/* Panchang Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/60 text-white px-6 py-3 rounded-full text-lg font-semibold backdrop-blur-sm">
                      {t("home.about.panchangOverlay")}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
