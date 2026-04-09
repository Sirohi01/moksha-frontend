"use client";
import React, { useState } from "react";
import { Container } from "@/components/ui/Elements";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormFields";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";
import { Heart, CheckCircle, ShieldCheck, Info, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { createRazorpayOrder, initiatePayment } from "@/lib/razorpay";
import { donateConfig } from "@/config/donate.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function DonatePage() {
  const { config: dynamicConfig } = usePageConfig('donate', donateConfig);
  const activeConfig = dynamicConfig || donateConfig;

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
      alert(activeConfig.validation?.minAmount || "Minimum donation amount is ₹100");
      return;
    }

    if (!isEmailVerified || !isMobileVerified) {
      alert("Please verify your email and mobile number via WhatsApp first");
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      alert(activeConfig.validation?.requiredFields || "Please fill all required fields");
      return;
    }

    if (!form.agreeToTerms || !form.agreeToRefundPolicy) {
      alert(activeConfig.validation?.agreeTerms || "Please agree to our terms and refund policy");
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
            {activeConfig.success?.title || "Thank You"}
          </h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            {(activeConfig.success?.message || "").replace('{amount}', finalAmount ? formatCurrency(finalAmount) : (activeConfig.success?.fallbackAmount || "₹500"))}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
            <p className="text-amber-800 text-sm font-semibold flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> {activeConfig.success?.receiptNote || "Donation Success"}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-colors shadow-lg"
          >
            {activeConfig.success?.homeButton || "Back to Home"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen">
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
                const BadgeIcon = getIcon(activeConfig.hero?.badge?.icon || 'ShieldCheck');
                return <BadgeIcon className="w-4 h-4 text-amber-700 fill-amber-700" />;
              })()}
              <span className="text-amber-700 text-sm font-semibold tracking-wide uppercase">
                {activeConfig.hero?.badge?.text || "Sacred Contribution"}
              </span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
              <span className="block">{activeConfig.hero?.title?.line1 || "Honor Their"}</span>
              <span className="block text-amber-700">{activeConfig.hero?.title?.line2 || "Final Journey"}</span>
              <span className="block">{activeConfig.hero?.title?.line3 || "with Dignity"}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {activeConfig.hero?.subtitle || "Your support ensures that every soul finds peace and every family finds solace in their most difficult hour."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              {(activeConfig.hero?.impactStats || []).map((stat: any, i: number) => (
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
                {activeConfig.hero?.ctaButtons?.primary || "Donate Now"}
                <span className="text-sm opacity-80">{activeConfig.hero?.startingAmount}</span>
              </button>
              
              <Link 
                href="/impact" 
                className="group text-gray-700 hover:text-amber-700 font-semibold px-6 py-4 rounded-full border-2 border-gray-300 hover:border-amber-300 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
              >
                <Info className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {activeConfig.hero?.ctaButtons?.secondary || "Our Impact"}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-6 bg-green-50 border-b border-green-100">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-green-800">
            {(activeConfig.trustSignals || []).map((signal: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5 uppercase text-[10px] font-black tracking-widest">
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
                <h2 className="font-serif text-xl font-bold text-stone-800 mb-1 uppercase tracking-tighter">
                  1. {activeConfig.amountSelection?.title || "Donation Amount"}
                </h2>
                <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest italic">{activeConfig.amountSelection?.subtitle || "Choose your contribution"}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(activeConfig.donationTiers || []).map((tier: any) => (
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
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="text-2xl mb-2">💝</div>
                      <p className="font-serif text-xl font-bold text-orange-600 mb-1">
                        {formatCurrency(tier.amount)}
                      </p>
                      <p className="font-black text-stone-800 text-[10px] uppercase tracking-widest mb-1">{tier.label}</p>
                      <p className="text-stone-500 text-[9px] font-medium leading-tight h-8 flex items-center justify-center">{tier.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="max-w-md mx-auto mb-4">
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 text-center italic">
                  {activeConfig.amountSelection?.customAmountLabel || "Custom Amount"}
                </label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 font-black text-lg group-focus-within:text-orange-500 transition-colors">₹</span>
                  <input
                    type="number"
                    placeholder={activeConfig.amountSelection?.customAmountPlaceholder || "Enter amount"}
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="w-full h-14 pl-12 pr-6 bg-stone-50 border-2 border-stone-100 rounded-2xl text-center text-xl font-black focus:outline-none focus:border-orange-500/50 shadow-inner transition-all"
                    min="100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-cream-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 text-center">
                <h3 className="font-serif text-xl font-bold mb-1 uppercase tracking-widest">2. {activeConfig.form?.title || "Donor Details"}</h3>
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest italic">{activeConfig.form?.subtitle || "Donor Information"}</p>
              </div>
              
              <div className="p-10">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div>
                      <h4 className="font-black text-stone-900 mb-6 pb-2 border-b border-stone-100 text-[11px] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
                        {activeConfig.form?.sections?.personalInfo?.title || "Personal Info"}
                      </h4>
                      <div className="space-y-6">
                        <InputField
                          label={activeConfig.form?.sections?.personalInfo?.fields?.fullName?.label || "Full Name"}
                          placeholder={activeConfig.form?.sections?.personalInfo?.fields?.fullName?.placeholder || "As per PAN"}
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <div className="space-y-2">
                          <InputField
                            label={activeConfig.form?.sections?.personalInfo?.fields?.email?.label || "Email Address"}
                            type="email"
                            placeholder={activeConfig.form?.sections?.personalInfo?.fields?.email?.placeholder || "your@email.com"}
                            required
                            value={form.email}
                            onChange={(e) => {
                              setForm({ ...form, email: e.target.value });
                              setIsEmailVerified(false);
                            }}
                            disabled={isEmailVerified}
                          />
                          {form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                            <div className="px-2">
                                <EmailVerification email={form.email} onVerified={setIsEmailVerified} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <InputField
                            label={activeConfig.form?.sections?.personalInfo?.fields?.phone?.label || "Phone Number"}
                            type="tel"
                            placeholder={activeConfig.form?.sections?.personalInfo?.fields?.phone?.placeholder || "9876543210"}
                            required
                            value={form.phone}
                            onChange={(e) => {
                              setForm({ ...form, phone: e.target.value });
                              setIsMobileVerified(false);
                            }}
                            disabled={isMobileVerified}
                          />
                          {form.phone && form.phone.length >= 10 && (
                            <div className="px-2">
                                <MobileVerification mobile={form.phone} onVerified={setIsMobileVerified} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-black text-stone-900 mb-6 pb-2 border-b border-stone-100 text-[11px] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
                        {activeConfig.form?.sections?.taxDetails?.title || "Tax Details"}
                      </h4>
                      <div className="space-y-6">
                        <InputField
                          label={activeConfig.form?.sections?.taxDetails?.fields?.panNumber?.label || "PAN Number"}
                          placeholder={activeConfig.form?.sections?.taxDetails?.fields?.panNumber?.placeholder || "ABCDE1234F"}
                          maxLength={10}
                          value={form.panNumber}
                          onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                        />
                         <p className="text-[10px] text-stone-400 font-bold italic">{activeConfig.form?.sections?.taxDetails?.fields?.note || ""}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <h4 className="font-black text-stone-900 mb-6 pb-2 border-b border-stone-100 text-[11px] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
                        {activeConfig.form?.sections?.address?.title || "Address"}
                      </h4>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[11px] font-black text-stone-900 uppercase tracking-widest mb-3">
                            {activeConfig.form?.sections?.address?.fields?.address?.label || "Mailing Address"} *
                          </label>
                          <textarea
                            placeholder={activeConfig.form?.sections?.address?.fields?.address?.placeholder || "Full Address"}
                            rows={2}
                            required
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="w-full px-6 py-4 text-sm font-bold border-2 border-stone-100 bg-stone-50/50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30 transition-all outline-none resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <InputField
                            label={activeConfig.form?.sections?.address?.fields?.city?.label || "City"}
                            placeholder={activeConfig.form?.sections?.address?.fields?.city?.placeholder || "City"}
                            required
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                          />
                          <InputField
                            label={activeConfig.form?.sections?.address?.fields?.pincode?.label || "Pincode"}
                            placeholder={activeConfig.form?.sections?.address?.fields?.pincode?.placeholder || "Pincode"}
                            required
                            maxLength={6}
                            value={form.pincode}
                            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-stone-900 uppercase tracking-widest mb-3">
                            {activeConfig.form?.sections?.address?.fields?.state?.label || "State"} *
                          </label>
                          <select
                            required
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                            className="w-full h-14 px-6 text-sm font-black border-2 border-stone-100 bg-stone-50/50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="">{activeConfig.form?.sections?.address?.fields?.state?.placeholder || "Select State"}</option>
                            {(activeConfig.states || []).map((state: string) => (
                              <option key={state} value={state}>{state.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-black text-stone-900 mb-6 pb-2 border-b border-stone-100 text-[11px] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-4 bg-orange-600 rounded-full" />
                        {activeConfig.form?.sections?.preferences?.title || "Donation Purpose"}
                      </h4>
                      <div className="space-y-8">
                        <div>
                          <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 italic">
                            {activeConfig.form?.sections?.preferences?.frequency?.label || "Frequency"}
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(activeConfig.form?.sections?.preferences?.frequency?.types || []).map((type: any) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => setForm({ ...form, donationType: type.value })}
                                className={`h-11 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                  form.donationType === type.value
                                    ? "border-orange-600 bg-orange-600 text-white shadow-lg"
                                    : "border-stone-50 bg-stone-50/50 text-stone-400 hover:border-orange-200"
                                }`}
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 italic">
                            {activeConfig.form?.sections?.preferences?.purpose?.label || "Purpose"}
                          </label>
                          <select
                            required
                            value={form.donationPurpose}
                            onChange={(e) => setForm({ ...form, donationPurpose: e.target.value })}
                            className="w-full h-14 px-6 text-sm font-black border-2 border-stone-100 bg-stone-50/50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30 transition-all outline-none appearance-none cursor-pointer"
                          >
                            {(activeConfig.form?.sections?.preferences?.purpose?.options || []).map((option: any) => (
                              <option key={option.value} value={option.value}>{option.label.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-stone-100">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-5">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="p-1">
                            <input
                            type="checkbox"
                            checked={form.isAnonymous}
                            onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                            className="w-5 h-5 text-orange-600 border-2 border-stone-200 rounded-lg focus:ring-orange-500 transition-all"
                            />
                        </div>
                        <span className="text-[11px] text-stone-600 font-bold uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                            {activeConfig.form?.preferences?.anonymous || "Anonymous"}
                        </span>
                      </label>
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="p-1">
                            <input
                            type="checkbox"
                            checked={form.taxReceiptRequired}
                            onChange={(e) => setForm({ ...form, taxReceiptRequired: e.target.checked })}
                            className="w-5 h-5 text-orange-600 border-2 border-stone-200 rounded-lg focus:ring-orange-500 transition-all"
                            />
                        </div>
                        <span className="text-[11px] text-stone-600 font-bold uppercase tracking-wider group-hover:text-stone-900 transition-colors">
                            {activeConfig.form?.preferences?.taxReceipt || "Tax Receipt"}
                        </span>
                      </label>
                    </div>

                    <div className="space-y-5">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="p-1">
                            <input
                            type="checkbox"
                            checked={form.agreeToTerms}
                            onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                            className="w-4 h-4 text-orange-600 border-2 border-stone-200 rounded focus:ring-orange-500"
                            required
                            />
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium leading-relaxed">
                          {activeConfig.form?.preferences?.terms?.text || "I agree to"} <Link href={activeConfig.form?.preferences?.terms?.link || "/legal/terms"} className="text-orange-600 underline font-black decoration-2 underline-offset-4">{activeConfig.form?.preferences?.terms?.linkText || "Terms & Conditions"}</Link> *
                        </span>
                      </label>
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="p-1">
                            <input
                            type="checkbox"
                            checked={form.agreeToRefundPolicy}
                            onChange={(e) => setForm({ ...form, agreeToRefundPolicy: e.target.checked })}
                            className="w-4 h-4 text-orange-600 border-2 border-stone-200 rounded focus:ring-orange-500"
                            required
                            />
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium leading-relaxed">
                        {activeConfig.form?.preferences?.refund?.text || "I accept"} <Link href={activeConfig.form?.preferences?.refund?.link || "/donate/refund-policy"} className="text-orange-600 underline font-black decoration-2 underline-offset-4">{activeConfig.form?.preferences?.refund?.linkText || "Refund Policy"}</Link> *
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-24 rounded-[2rem] text-xl font-black uppercase tracking-[0.3em] bg-orange-600 hover:bg-orange-700 shadow-2xl shadow-orange-500/30 transform hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-6"
                    loading={loading}
                    disabled={loading || !isEmailVerified || !isMobileVerified || !finalAmount || !form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode}
                    onClick={handleDonate}
                  >
                    <Heart className="w-8 h-8 fill-white animate-pulse" />
                    {loading ? "INITIALIZING..." : (activeConfig.form?.buttonText || "DONATE {amount}").replace('{amount}', formatCurrency(finalAmount || 0))}
                  </Button>
                  
                  <div className="flex flex-wrap items-center justify-center gap-10 mt-12 bg-stone-50/50 py-6 rounded-3xl border border-stone-100">
                    <div className="flex items-center gap-3 text-stone-400 text-[9px] font-black uppercase tracking-[0.2em] italic">
                      <ShieldCheck className="w-5 h-5 text-stone-300" /> {activeConfig.form?.secureLabel || "SECURE"}
                    </div>
                    <div className="hidden sm:block w-1.5 h-1.5 bg-stone-200 rounded-full" />
                    <div className="flex items-center gap-3 text-stone-400 text-[9px] font-black uppercase tracking-[0.2em] italic">
                      <CheckCircle className="w-5 h-5 text-stone-300" /> {activeConfig.form?.taxLabel || "80G"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

