"use client"

export default function AppDownloadSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-8">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-800 font-normal mb-4">DOWNLOAD APP</h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - App Features */}
          <div>
            <h2 className="text-3xl font-serif text-gray-800 font-normal mb-8">App Features:</h2>
            <ul className="space-y-4 text-gray-800 text-lg font-serif mb-10">
              <li className="flex items-start">
                <span className="text-gray-800 mr-3 text-xl">•</span>
                Health reports based on your child's exact birth details.
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 mr-3 text-xl">•</span>
                Customized nutrition and care suggestions.
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 mr-3 text-xl">•</span>
                Tips and guidance for your child's growth and development.
              </li>
              <li className="flex items-start">
                <span className="text-gray-800 mr-3 text-xl">•</span>
                Daily reminders and notifications so you never miss important care steps.
              </li>
            </ul>

            {/* Google Play Button */}
            <div className="inline-flex items-center gap-3 bg-white  px-6 py-4 rounded-lg ">
              <img
                src="/images/play_store_button.png"
                alt="Get it on Google Play"
                className="h-15 w-auto"
              />
            </div>
          </div>

          {/* Right Side - Phone Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Orange glow effect */}
              <div className="absolute -right-8 top-0 w-80 h-96 bg-orange-200 rounded-full blur-3xl opacity-60"></div>
              
              {/* Phone image */}
              <div className="relative z-10">
                <img
                  src="/images/phone.png"
                  alt="Mobile app interface"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
