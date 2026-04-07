"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormFields";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";
import { Heart, CheckCircle, ShieldCheck, Info, FileText, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { loadRazorpayScript, createRazorpayOrder, initiatePayment } from "@/lib/razorpay";
import { donateConfig } from "@/config/donate.config";
import { getIcon } from "@/config/icons.config";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    panNumber: "",
    donationType: "one-time", 
    donationPurpose: "general",
    tributeName: "",
    tributeMessage: "",
    isAnonymous: false,
    receiveUpdates: true,
    taxReceiptRequired: true,
    message: "",
    agreeToTerms: false,
    agreeToRefundPolicy: false,
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 100) {
      alert(donateConfig.validation.minAmount);
      return;
    }

    if (!isEmailVerified || !isMobileVerified) {
      alert("Please verify your email and mobile number via WhatsApp first");
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      alert(donateConfig.validation.requiredFields);
      return;
    }

    if (!form.agreeToTerms || !form.agreeToRefundPolicy) {
      alert(donateConfig.validation.agreeTerms);
      return;
    }

    setLoading(true);
    try {
      const donorData = {
        amount: finalAmount,
        currency: 'INR',
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        panNumber: form.panNumber || undefined,
        donationType: form.donationType.replace('-', '_'),
        purpose: form.donationPurpose.replace('-', '_'),
        dedicatedTo: form.tributeName || undefined,
        message: form.tributeMessage || form.message || undefined,
        isAnonymous: form.isAnonymous,
        needReceipt: form.taxReceiptRequired,
        paymentMethod: 'upi', 
        source: 'website'
      };

      const orderResult = await createRazorpayOrder(donorData);
      
      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to initiate payment');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXXXX',
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: "Moksha Sewa",
        description: `Donation: ${form.donationPurpose}`,
        order_id: orderResult.order.id,
        handler: async (response: any) => {
          try {
            setLoading(true);
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/donations/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationId: orderResult.donationId
              })
            });

            const verifyResult = await verifyRes.json();
            if (verifyResult.success) {
              setSubmitted(true);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed due to a network error.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#c2410c", 
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      await initiatePayment(options);

    } catch (error) {
      console.error('Donation error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-cream-50 py-16">
        <div className="text-center max-w-md mx-auto px-4 bg-white p-10 rounded-3xl shadow-xl border border-stone-100">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            Your generous donation of {finalAmount ? formatCurrency(finalAmount || 0) : "₹500"} has been received. 
            Thank you for helping us provide a dignified farewell to those in need.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
            <p className="text-amber-800 text-sm font-semibold flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Your 80G Tax Receipt has been emailed to you.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-colors shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative bg-stone-50 text-gray-900 py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 backdrop-blur-sm border border-amber-200 rounded-full px-6 py-2 mb-6">
              {(() => {
                const BadgeIcon = getIcon(donateConfig.hero.badge.icon);
                return <BadgeIcon className="w-4 h-4 text-amber-700 fill-amber-700" />;
              })()}
              <span className="text-amber-700 text-sm font-semibold tracking-wide uppercase">
                {donateConfig.hero.badge.text}
              </span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
              <span className="block">{donateConfig.hero.title.line1}</span>
              <span className="block text-amber-700">{donateConfig.hero.title.line2}</span>
              <span className="block">{donateConfig.hero.title.line3}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {donateConfig.hero.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              {donateConfig.hero.impactStats.map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200">
                  <div className="text-3xl font-bold text-amber-700 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Heart className="w-6 h-6 fill-current group-hover:animate-pulse" />
                {donateConfig.hero.ctaButtons.primary}
                <span className="text-sm opacity-80">{donateConfig.hero.startingAmount}</span>
              </button>
              
              <Link 
                href="/impact" 
                className="group text-gray-700 hover:text-amber-700 font-semibold px-6 py-4 rounded-full border-2 border-gray-300 hover:border-amber-300 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
              >
                <Info className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {donateConfig.hero.ctaButtons.secondary}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-6 bg-green-50 border-b border-green-100">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-green-800">
            {donateConfig.trustSignals.map((signal, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> {signal}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section id="donation-form" className="py-10 bg-stone-100">
        <Container size="xl">
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="bg-white rounded-lg border border-cream-200 shadow-md p-5">
              <div className="text-center mb-4">
                <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">
                  1. {donateConfig.amountSelection.title}
                </h2>
                <p className="text-stone-600 text-xs">{donateConfig.amountSelection.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {donateConfig.donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => { setSelectedAmount(tier.amount); setCustomAmount(""); }}
                    className={`group relative p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                      selectedAmount === tier.amount && !customAmount
                        ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg transform scale-105"
                        : "border-stone-200 bg-white hover:border-orange-400 hover:shadow-md hover:scale-102"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {selectedAmount === tier.amount && !customAmount && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">💝</div>
                      <p className="font-serif text-xl font-bold text-orange-600 mb-1">
                        {formatCurrency(tier.amount)}
                      </p>
                      <p className="font-semibold text-stone-800 text-sm mb-1">{tier.label}</p>
                      <p className="text-stone-500 text-xs leading-tight">{tier.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="max-w-md mx-auto mb-4">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 text-center">
                  {donateConfig.amountSelection.customAmountLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-base">₹</span>
                  <input
                    type="number"
                    placeholder={donateConfig.amountSelection.customAmountPlaceholder}
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="w-full pl-8 pr-3 py-2.5 border-2 border-stone-300 rounded-lg text-center text-base font-bold focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                    min="100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-cream-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-saffron-600 to-orange-600 text-white p-5 text-center">
                <h3 className="font-serif text-xl font-bold mb-1">2. {donateConfig.form.title}</h3>
                <p className="text-saffron-100 text-xs">{donateConfig.form.subtitle}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2 lowercase tracking-wider text-sm">
                          PERSONAL INFORMATION
                        </h4>
                        <div className="space-y-4">
                          <InputField
                            label={donateConfig.form.sections.personalInfo.fields.fullName.label}
                            placeholder={donateConfig.form.sections.personalInfo.fields.fullName.placeholder}
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                          <div className="space-y-4">
                            <InputField
                              label={donateConfig.form.sections.personalInfo.fields.email.label}
                              type="email"
                              placeholder={donateConfig.form.sections.personalInfo.fields.email.placeholder}
                              required
                              value={form.email}
                              onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                setIsEmailVerified(false);
                              }}
                              disabled={isEmailVerified}
                            />
                            {form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                              <EmailVerification email={form.email} onVerified={setIsEmailVerified} />
                            )}
                          </div>
                          <div className="space-y-4">
                            <InputField
                              label={donateConfig.form.sections.personalInfo.fields.phone.label}
                              type="tel"
                              placeholder={donateConfig.form.sections.personalInfo.fields.phone.placeholder}
                              required
                              value={form.phone}
                              onChange={(e) => {
                                setForm({ ...form, phone: e.target.value });
                                setIsMobileVerified(false);
                              }}
                              disabled={isMobileVerified}
                            />
                            {form.phone && form.phone.length >= 10 && (
                              <MobileVerification mobile={form.phone} onVerified={setIsMobileVerified} />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2 lowercase tracking-wider text-sm">
                          ADDRESS FOR 80G RECEIPT
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                              {donateConfig.form.sections.address.fields.address.label} *
                            </label>
                            <textarea
                              placeholder={donateConfig.form.sections.address.fields.address.placeholder}
                              rows={2}
                              required
                              value={form.address}
                              onChange={(e) => setForm({ ...form, address: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <InputField
                              label={donateConfig.form.sections.address.fields.city.label}
                              placeholder={donateConfig.form.sections.address.fields.city.placeholder}
                              required
                              value={form.city}
                              onChange={(e) => setForm({ ...form, city: e.target.value })}
                            />
                            <InputField
                              label={donateConfig.form.sections.address.fields.pincode.label}
                              placeholder={donateConfig.form.sections.address.fields.pincode.placeholder}
                              required
                              maxLength={6}
                              value={form.pincode}
                              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                              {donateConfig.form.sections.address.fields.state.label} *
                            </label>
                            <select
                              required
                              value={form.state}
                              onChange={(e) => setForm({ ...form, state: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                            >
                              <option value="">{donateConfig.form.sections.address.fields.state.placeholder}</option>
                              {donateConfig.states.map((state) => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                        <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2 lowercase tracking-wider text-sm">
                          DONATION PREFERENCES
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Frequency *</label>
                            <div className="grid grid-cols-2 gap-2">
                              {donateConfig.form.sections.preferences.frequency.types.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => setForm({ ...form, donationType: type.value })}
                                  className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all ${
                                    form.donationType === type.value
                                      ? "border-orange-600 bg-orange-600 text-white"
                                      : "border-stone-200 bg-white text-stone-600 hover:border-orange-400"
                                  }`}
                                >
                                  {type.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Purpose *</label>
                            <select
                              required
                              value={form.donationPurpose}
                              onChange={(e) => setForm({ ...form, donationPurpose: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white font-medium"
                            >
                              {donateConfig.form.sections.preferences.purpose.options.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2 lowercase tracking-wider text-sm">
                          TAX SAVING (80G)
                        </h4>
                        <div className="space-y-4">
                          <InputField
                            label={donateConfig.form.sections.taxDetails.fields.panNumber.label}
                            placeholder={donateConfig.form.sections.taxDetails.fields.panNumber.placeholder}
                            maxLength={10}
                            value={form.panNumber}
                            onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                          />
                          <p className="text-[10px] text-stone-500 leading-tight">
                            Providing your PAN Number is required by the Income Tax Department to issue a valid 80G tax exemption receipt.
                          </p>
                        </div>
                      </div>
                    </div>

                <div className="space-y-4 pt-6 mt-4 border-t-2 border-stone-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.isAnonymous}
                          onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                          className="w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                        />
                        <span className="text-sm text-stone-700 font-medium whitespace-nowrap">{donateConfig.form.preferences.anonymous}</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.taxReceiptRequired}
                          onChange={(e) => setForm({ ...form, taxReceiptRequired: e.target.checked })}
                          className="w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                        />
                        <span className="text-sm text-stone-700 font-medium whitespace-nowrap">{donateConfig.form.preferences.taxReceipt}</span>
                      </label>
                    </div>

                    <div className="space-y-2">
                       <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.agreeToTerms}
                          onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                          className="mt-0.5 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded"
                          required
                        />
                        <span className="text-xs text-stone-600">
                          I agree to the <Link href="/legal/terms" className="text-saffron-600 underline font-bold">Terms & Conditions</Link> *
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.agreeToRefundPolicy}
                          onChange={(e) => setForm({ ...form, agreeToRefundPolicy: e.target.checked })}
                          className="mt-0.5 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded"
                          required
                        />
                        <span className="text-xs text-stone-600">
                          I accept the <Link href="/donate/refund-policy" className="text-saffron-600 underline font-bold">Refund Policy</Link> *
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-lg py-5 bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 shadow-xl"
                    loading={loading}
                    disabled={loading || !isEmailVerified || !isMobileVerified || !finalAmount || !form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode}
                    onClick={handleDonate}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Heart className="w-6 h-6 fill-white" />
                      {loading ? "Initializing..." : `Donate ${formatCurrency(finalAmount || 0)} Now`}
                    </span>
                  </Button>
                  
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="flex items-center gap-1.5 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> SECURE SSL ENCRYPTION
                    </div>
                    <div className="w-px h-3 bg-stone-300" />
                    <div className="flex items-center gap-1.5 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                       80G TAX EXEMPTION
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
