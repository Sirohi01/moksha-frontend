import { Container } from "@/components/ui/Elements";
import { AlertCircle, CheckCircle, XCircle, Clock, Mail, Phone, FileText, Shield } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
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
            Refund & Cancellation Policy
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Complete information about donation refunds, cancellations, and our commitment to transparency.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Last Updated: March 9, 2026
          </p>
        </Container>
      </section>

      {/* Quick Summary */}
      <section className="py-8 bg-amber-50 border-b border-amber-100">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Refund Window</h3>
                <p className="text-sm text-gray-600">7 days from donation date for eligible cases</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Processing Time</h3>
                <p className="text-sm text-gray-600">5-7 business days after approval</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">100% Transparent</h3>
                <p className="text-sm text-gray-600">Clear process with email updates</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-stone-100">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">Policy Overview</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                At Moksha Sewa, we understand that sometimes circumstances change. While donations are generally
                non-refundable as they support our ongoing humanitarian work, we have established this policy to
                address genuine cases where refunds may be warranted.
              </p>
              <p className="text-stone-600 leading-relaxed">
                This policy applies to all donations made through our website, mobile app, or any other digital
                payment channels. We are committed to handling all refund requests fairly, transparently, and
                in accordance with applicable laws.
              </p>
            </div>

            {/* Refund Eligibility */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Refund Eligibility Criteria</h2>

              <div className="space-y-6">
                {/* Eligible Cases */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-stone-800 text-lg">Eligible for Refund</h3>
                  </div>
                  <ul className="space-y-3 ml-7">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Duplicate Transaction:</strong> If you were charged multiple times for the same donation
                        due to technical error or payment gateway issue.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Unauthorized Transaction:</strong> If the donation was made without your knowledge or
                        authorization (requires proof and police complaint in some cases).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Technical Error:</strong> If you were charged an incorrect amount due to a system error
                        (refund will be issued for the excess amount).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Payment Failure:</strong> If your account was debited but the donation was not processed
                        or reflected in our system.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Accidental Donation:</strong> If you made a donation by mistake and request a refund
                        within 24 hours of the transaction.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Non-Eligible Cases */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-stone-800 text-lg">Not Eligible for Refund</h3>
                  </div>
                  <ul className="space-y-3 ml-7">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Change of Mind:</strong> Refunds are not provided if you simply change your mind after
                        making a voluntary donation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>After Fund Utilization:</strong> Once the donated funds have been allocated or utilized
                        for our charitable activities (typically after 7 days).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Tax Receipt Issued:</strong> If an 80G tax exemption certificate has already been issued
                        and claimed for tax benefits.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Recurring Donations:</strong> For monthly/yearly recurring donations after the first
                        successful payment (you can cancel future payments).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-stone-600">
                        <strong>Campaign-Specific Donations:</strong> Donations made to specific campaigns or memorial
                        funds after the campaign has commenced.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Refund Process */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">How to Request a Refund</h2>

              <div className="space-y-6">
                <p className="text-stone-600 leading-relaxed">
                  If you believe your donation qualifies for a refund based on the eligibility criteria above,
                  please follow these steps:
                </p>

                {/* Step by Step Process */}
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Submit Refund Request",
                      description: "Send an email to info@mokshasewa.org with the subject line 'Refund Request - [Transaction ID]'",
                      details: [
                        "Include your full name as per donation",
                        "Transaction ID / Receipt number",
                        "Date and amount of donation",
                        "Reason for refund request",
                        "Bank account details for refund (Account number, IFSC code, Account holder name)"
                      ]
                    },
                    {
                      step: "2",
                      title: "Provide Supporting Documents",
                      description: "Attach relevant documents to support your refund claim:",
                      details: [
                        "Screenshot of payment confirmation",
                        "Bank statement showing debit",
                        "Copy of donation receipt (if received)",
                        "Any other relevant proof"
                      ]
                    },
                    {
                      step: "3",
                      title: "Verification Process",
                      description: "Our team will review your request within 3-5 business days:",
                      details: [
                        "We will verify the transaction in our system",
                        "Check eligibility based on our policy",
                        "May contact you for additional information",
                        "You will receive an email update on the status"
                      ]
                    },
                    {
                      step: "4",
                      title: "Refund Processing",
                      description: "If approved, refund will be processed:",
                      details: [
                        "Refund initiated within 2 business days of approval",
                        "Amount credited to your account in 5-7 business days",
                        "Confirmation email sent with refund details",
                        "If 80G receipt was issued, it will be cancelled"
                      ]
                    }
                  ].map((item) => (
                    <div key={item.step} className="border-l-4 border-saffron-500 pl-6 py-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-saffron-100 rounded-full flex items-center justify-center text-saffron-700 font-bold text-sm">
                          {item.step}
                        </div>
                        <h3 className="font-semibold text-stone-800">{item.title}</h3>
                      </div>
                      <p className="text-stone-600 text-sm mb-2">{item.description}</p>
                      <ul className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="text-stone-500 text-sm flex items-start gap-2">
                            <span className="text-saffron-500 mt-1">→</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Cancellation Policy</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">One-Time Donations</h3>
                  <p className="text-stone-600 leading-relaxed">
                    One-time donations can be cancelled only if the request is made within 24 hours of the transaction
                    and before the funds have been allocated. After 24 hours, cancellation requests will be treated as
                    refund requests and subject to the refund eligibility criteria.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Recurring Donations (Monthly/Yearly)</h3>
                  <p className="text-stone-600 leading-relaxed mb-3">
                    You can cancel your recurring donation subscription at any time:
                  </p>
                  <ul className="space-y-2 ml-5">
                    <li className="flex items-start gap-2 text-stone-600">
                      <span className="text-saffron-600 mt-1">•</span>
                      <span>Log in to your donor account and go to &apos;My Donations&apos;</span>
                    </li>
                    <li className="flex items-start gap-2 text-stone-600">
                      <span className="text-saffron-600 mt-1">•</span>
                      <span>Click &apos;Cancel Subscription&apos; next to the recurring donation</span>
                    </li>
                    <li className="flex items-start gap-2 text-stone-600">
                      <span className="text-saffron-600 mt-1">•</span>
                      <span>Or email us at support@MokshaSewa.org with your donor ID</span>
                    </li>
                    <li className="flex items-start gap-2 text-stone-600">
                      <span className="text-saffron-600 mt-1">•</span>
                      <span>Cancellation will take effect from the next billing cycle</span>
                    </li>
                    <li className="flex items-start gap-2 text-stone-600">
                      <span className="text-saffron-600 mt-1">•</span>
                      <span>Already processed payments for the current cycle are non-refundable</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Campaign-Specific Donations</h3>
                  <p className="text-stone-600 leading-relaxed">
                    Donations made to specific campaigns (e.g., Adopt-a-City, Sacred River) cannot be cancelled once
                    the campaign has started. If a campaign is cancelled or does not reach its goal, donors will be
                    notified and given the option to redirect their donation to general funds or request a refund.
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Timeline */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Refund Processing Timeline</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-cream-50 rounded-lg">
                  <Clock className="w-6 h-6 text-saffron-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-2">Standard Processing Time</h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                      <li><strong>Request Review:</strong> 3-5 business days</li>
                      <li><strong>Approval/Rejection Decision:</strong> Within 7 business days</li>
                      <li><strong>Refund Initiation:</strong> 1-2 business days after approval</li>
                      <li><strong>Bank Credit:</strong> 5-7 business days (depends on your bank)</li>
                      <li><strong>Total Time:</strong> Up to 14 business days from request submission</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Refund timelines may vary based on payment method used:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-blue-700 ml-4">
                        <li>• UPI/Net Banking: 5-7 business days</li>
                        <li>• Credit Card: 7-10 business days</li>
                        <li>• Debit Card: 5-7 business days</li>
                        <li>• Wallet: 3-5 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Implications */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Tax Implications of Refunds</h2>

              <div className="space-y-4">
                <p className="text-stone-600 leading-relaxed">
                  If you have received an 80G tax exemption certificate for your donation and later receive a refund,
                  please note the following:
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <p className="text-amber-900 font-semibold">Important Tax Information</p>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li className="flex items-start gap-2">
                          <span>•</span>
                          <span>The 80G certificate will be cancelled and you will receive a cancellation notice</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>•</span>
                          <span>If you have already claimed tax benefits, you must inform your tax consultant</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>•</span>
                          <span>You may need to file a revised tax return to remove the claimed deduction</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>•</span>
                          <span>Moksha Sewa will report the cancellation to tax authorities as per regulations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span>•</span>
                          <span>We recommend consulting with a tax professional for specific guidance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-saffron-50 to-gold-50 rounded-2xl border border-saffron-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Contact Us for Refund Queries</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-saffron-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1">Email Support</h3>
                    <p className="text-sm text-stone-600 mb-2">For refund requests and queries</p>
                    <a href="mailto:info@mokshasewa.org" className="text-saffron-600 font-medium hover:underline">
                      info@mokshasewa.org
                    </a>
                    <p className="text-xs text-stone-500 mt-1">Response within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-saffron-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1">Phone Support</h3>
                    <p className="text-sm text-stone-600 mb-2">Speak to our support team</p>
                    <a href="tel:+911234567890" className="text-saffron-600 font-medium hover:underline">
                      9220147229
                    </a>
                    <p className="text-xs text-stone-500 mt-1">Mon-Sat, 9 AM - 6 PM IST</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-saffron-200">
                <p className="text-sm text-stone-600 leading-relaxed">
                  For general donation queries, please email <a href="mailto:support@MokshaSewa.org" className="text-saffron-600 underline">support@MokshaSewa.org</a> or
                  visit our <Link href="/contact" className="text-saffron-600 underline">Contact Page</Link>.
                </p>
              </div>
            </div>

            {/* Dispute Resolution */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">Dispute Resolution</h2>

              <div className="space-y-4">
                <p className="text-stone-600 leading-relaxed">
                  If you are not satisfied with our refund decision or process, you have the following options:
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-stone-300 pl-4">
                    <h3 className="font-semibold text-stone-800 mb-2">1. Escalation to Senior Management</h3>
                    <p className="text-sm text-stone-600">
                      You can escalate your case by emailing <span className="font-medium">grievance@MokshaSewa.org</span> with
                      your refund request details and reason for escalation. A senior manager will review your case within
                      5 business days.
                    </p>
                  </div>

                  <div className="border-l-4 border-stone-300 pl-4">
                    <h3 className="font-semibold text-stone-800 mb-2">2. Payment Gateway Dispute</h3>
                    <p className="text-sm text-stone-600">
                      If the issue is related to payment processing, you can raise a dispute with your bank or payment
                      provider. Please note that chargebacks may take 30-45 days to resolve.
                    </p>
                  </div>

                  <div className="border-l-4 border-stone-300 pl-4">
                    <h3 className="font-semibold text-stone-800 mb-2">3. Legal Recourse</h3>
                    <p className="text-sm text-stone-600">
                      All disputes are subject to the jurisdiction of courts in [City Name], India. We encourage
                      resolving disputes amicably through our internal process before pursuing legal action.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">Policy Updates & Amendments</h2>

              <p className="text-stone-600 leading-relaxed mb-4">
                Moksha Sewa reserves the right to modify this Refund & Cancellation Policy at any time. Changes will
                be effective immediately upon posting on our website. We will notify donors of significant changes via:
              </p>

              <ul className="space-y-2 ml-5 mb-4">
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Email notification to registered donors</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Prominent notice on our website homepage</span>
                </li>
                <li className="flex items-start gap-2 text-stone-600">
                  <span className="text-saffron-600 mt-1">•</span>
                  <span>Social media announcements</span>
                </li>
              </ul>

              <p className="text-stone-600 leading-relaxed">
                Continued use of our donation services after policy changes constitutes acceptance of the updated policy.
                We recommend reviewing this policy periodically.
              </p>
            </div>

            {/* Acknowledgment */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm p-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-800 mb-3">Donor Acknowledgment</h2>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    By making a donation to Moksha Sewa, you acknowledge that you have read, understood, and agree to
                    this Refund & Cancellation Policy. You understand that:
                  </p>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Donations are generally non-refundable except in eligible cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Refund requests must be made within the specified timeframe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Tax certificates will be cancelled if refunds are processed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>All refund decisions are at the discretion of Moksha Sewa management</span>
                    </li>
                  </ul>
                </div>
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
              Have Questions About Our Refund Policy?
            </h2>
            <p className="text-amber-200 mb-6">
              Our support team is here to help clarify any doubts or concerns you may have.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-amber-800 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/donate"
                className="px-6 py-3 bg-amber-700 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors border-2 border-amber-600"
              >
                Make a Donation
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
