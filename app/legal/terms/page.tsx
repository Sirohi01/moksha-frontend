import { Container } from "@/components/ui/Elements";
import { FileText, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-stone-50 text-gray-900 py-16">
        <Container>
          <div className="flex items-center gap-2 text-amber-700 text-sm font-medium tracking-widest uppercase mb-3">
            <FileText className="w-4 h-4" />
            <span>Legal Document</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Please read these terms and conditions carefully before using our services or making a donation.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Last Updated: March 9, 2026
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-stone-100">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Introduction */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to Moksha Sewa. These Terms and Conditions (&quot;Terms&quot;) govern your use of our website,
                services, and any donations made to our organization. By accessing our website or making a donation,
                you agree to be bound by these Terms.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Moksha Sewa is a registered non-profit organization dedicated to providing dignified last rites
                and cremation services to unclaimed bodies and those in need. We are committed to transparency,
                compassion, and serving humanity with respect.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">2. Acceptance of Terms</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                By using our website, making a donation, or engaging with our services, you acknowledge that:
              </p>
              <ul className="space-y-2 ml-5">
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>You have read and understood these Terms</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>You agree to comply with all applicable laws and regulations</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>You are at least 18 years of age or have parental/guardian consent</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>All information provided by you is accurate and truthful</span>
                </li>
              </ul>
            </div>

            {/* Donations */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">3. Donations</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">3.1 Voluntary Nature</h3>
                  <p className="text-stone-600 leading-relaxed">
                    All donations to Moksha Sewa are voluntary and made at your own discretion. Donations are
                    non-refundable except as specified in our Refund Policy.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">3.2 Use of Funds</h3>
                  <p className="text-stone-600 leading-relaxed">
                    Donations will be used to support our charitable activities including cremation services,
                    ambulance operations, documentation support, and administrative costs. We reserve the right
                    to allocate funds where they are most needed.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">3.3 Tax Benefits</h3>
                  <p className="text-stone-600 leading-relaxed">
                    Donations are eligible for 80G tax exemption under the Income Tax Act of India. Tax receipts
                    will be issued within 24-48 hours of donation. It is your responsibility to claim tax benefits
                    as per applicable laws.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">3.4 Payment Processing</h3>
                  <p className="text-stone-600 leading-relaxed">
                    We use secure third-party payment gateways to process donations. We do not store your complete
                    payment information. Payment processing is subject to the terms of the payment gateway provider.
                  </p>
                </div>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">4. User Responsibilities</h2>
              <p className="text-stone-600 leading-relaxed mb-4">As a user of our website and services, you agree to:</p>
              <ul className="space-y-2 ml-5">
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Provide accurate and complete information</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Not use our services for any illegal or unauthorized purpose</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Not attempt to gain unauthorized access to our systems</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Not transmit any harmful code, viruses, or malicious software</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Respect the intellectual property rights of Moksha Sewa</span>
                </li>
              </ul>
            </div>

            {/* Privacy & Data Protection */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">5. Privacy & Data Protection</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                We are committed to protecting your privacy and personal information. Our collection, use, and
                disclosure of personal data is governed by our Privacy Policy. By using our services, you consent
                to our data practices as described in the Privacy Policy.
              </p>
              <Link href="/privacy" className="text-saffron-600 underline hover:text-saffron-700">
                Read our Privacy Policy →
              </Link>
            </div>

            {/* Intellectual Property */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">6. Intellectual Property</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                All content on this website, including text, graphics, logos, images, and software, is the property
                of Moksha Sewa and is protected by copyright and intellectual property laws. You may not:
              </p>
              <ul className="space-y-2 ml-5">
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Reproduce, distribute, or modify our content without permission</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Use our logo or branding without written authorization</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Create derivative works based on our content</span>
                </li>
              </ul>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-stone-600 leading-relaxed">
                Our website and services are provided &quot;as is&quot; without any warranties, express or implied. We do not
                guarantee that our website will be uninterrupted, error-free, or free from viruses. We make no
                warranties regarding the accuracy, reliability, or completeness of any content on our website.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">8. Limitation of Liability</h2>
              <p className="text-stone-600 leading-relaxed">
                To the maximum extent permitted by law, Moksha Sewa shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of our website or services. Our
                total liability shall not exceed the amount of your donation, if any.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">9. Governing Law & Jurisdiction</h2>
              <p className="text-stone-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
                arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction
                of the courts in [City Name], India.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">10. Changes to Terms</h2>
              <p className="text-stone-600 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
                posting on our website. Your continued use of our services after changes constitutes acceptance of
                the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-saffron-50 to-gold-50 rounded-2xl border border-saffron-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">11. Contact Information</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2 text-stone-600">
                <p><strong>Email:</strong> <a href="mailto:legal@MokshaSewa.org" className="text-saffron-600 underline">legal@MokshaSewa.org</a></p>
                <p><strong>Phone:</strong> <a href="tel:+911234567890" className="text-saffron-600 underline">+91 123 456 7890</a></p>
                <p><strong>Address:</strong> Moksha Sewa, [Address], India</p>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-amber-800 text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-3">
              Ready to Make a Difference?
            </h2>
            <p className="text-amber-200 mb-6">
              Your contribution helps us provide dignified last rites to those in need.
            </p>
            <Link
              href="/donate"
              className="inline-block px-8 py-3 bg-white text-amber-800 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
            >
              Donate Now
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
