"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from '@/contexts/TranslationContext'

export default function KundliSection() {
  const { t } = useTranslation()

  return (
    <section className="jyoti-cream-bg py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left side - Mystical Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-orange-100 h-full">
            <img
              src="/images/kundli-chart.png"
              alt="Mystical astrological chart with Lord Ganesha and zodiac symbols"
              className="w-full h-full object-cover scale-[1.01]"
            />
          </div>

          {/* Right side - Content */}
          <div className="bg-orange-100 rounded-2xl shadow-2xl border border-orange-100 h-full">
            <div className="px-5 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
              <h3 className="text-xl sm:text-2xl font-bold text-[#252847] mb-4 text-center">
                {t('home.kundliSection.title', '🕉️ Kundli Analysis Services 🕉️')}
              </h3>
              
              <div className="space-y-4 flex-1">
                <div className="text-center mb-4">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {t('home.kundliSection.description', 'Get your birth chart analyzed and discover insights about your future, career, health, and all aspects of life through ancient Vedic wisdom')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg text-[#252847] mb-3 text-center">{t('home.kundliSection.comprehensiveServices', '🌟 Comprehensive Kundli Services')}</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {t('home.kundliSection.serviceDescription1', 'Our expert astrologers provide detailed birth chart analysis based on your exact birth time, date, and location. We use ancient Vedic wisdom and modern astrological techniques to give you accurate insights about your life path.')}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {t('home.kundliSection.serviceDescription2', 'From daily horoscopes to career guidance, marriage compatibility to health solutions, we cover all aspects of your life through planetary analysis.')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-xl border border-orange-300 shadow-lg text-center">
                      <h4 className="font-bold text-lg text-[#252847] mb-3">{t('home.kundliSection.samanyaKundli.title', '📊 Samanya Kundli')}</h4>
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                        {t('home.kundliSection.samanyaKundli.description', 'Basic birth chart analysis with essential insights about your personality, strengths, and life path.')}
                      </p>
                      <Button 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                        onClick={() => window.location.href = '/samanye-kundli'}
                      >
                        {t('home.kundliSection.samanyaKundli.button', 'Get Samanya Kundli')}
                      </Button>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-xl border border-orange-300 shadow-lg text-center">
                      <h4 className="font-bold text-lg text-[#252847] mb-3">{t('home.kundliSection.vipKundli.title', '👑 VIP Kundli')}</h4>
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                        {t('home.kundliSection.vipKundli.description', 'Premium comprehensive analysis with detailed predictions, personalized remedies, and ongoing consultation.')}
                      </p>
                      <Button 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                        onClick={() => window.location.href = '/vip-kundli'}
                      >
                        {t('home.kundliSection.vipKundli.button', 'Get VIP Kundli')}
                      </Button>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
