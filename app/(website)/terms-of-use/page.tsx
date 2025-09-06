  import React from 'react';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Jyotish Lok ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Jyotish Lok provides astrological services including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Kundli analysis and horoscope services</li>
              <li>Puja and spiritual consultation services</li>
              <li>Gemstone and Rudraksha recommendations</li>
              <li>Sacred books and spiritual materials</li>
              <li>Yantra and Sadhana programs</li>
              <li>Daily horoscope and astrological guidance</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate and truthful information</li>
              <li>Use our services for personal and spiritual growth only</li>
              <li>Respect the spiritual and cultural nature of our services</li>
              <li>Not misuse or misrepresent our services</li>
              <li>Maintain confidentiality of personal consultations</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              Our astrological services are provided for spiritual guidance and entertainment purposes only. We do not guarantee specific outcomes or results. Astrological predictions and recommendations should not replace professional medical, legal, or financial advice. Users should exercise their own judgment and discretion in all matters.
            </p>
          </section>

          {/* Payment and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment and Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All services must be paid for in advance. We offer the following refund policy:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Full refund within 24 hours of booking if service hasn't commenced</li>
              <li>Partial refund for cancelled services with 48 hours notice</li>
              <li>No refunds for completed consultations or services</li>
              <li>Refunds processed within 5-7 business days</li>
            </ul>
          </section>

          {/* Privacy and Confidentiality */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Confidentiality</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to protecting your privacy and maintaining the confidentiality of all personal information shared during consultations. Your birth details, personal concerns, and consultation records are kept strictly confidential and are never shared with third parties without your explicit consent.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Jyotish Lok and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Jyotish Lok shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid for the specific service in question.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> info@jyotidarshan.in<br />
                <strong>Phone:</strong> +91 9773380099<br />
                <strong>Website:</strong> jyotidarshan.com
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
