"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import Button from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormFields";
import { Heart, CheckCircle, ShieldCheck, Info, FileText } from "lucide-react";
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
    // Personal Details
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    
    // Address Details
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: donateConfig.form.defaultCountry,
    
    // PAN & Tax Details
    panNumber: "",
    aadharNumber: "",
    
    // Donation Details
    donationType: "one-time", // one-time, monthly, yearly
    donationPurpose: "general", // general, specific-campaign, memorial, tribute
    campaignName: "",
    
    // Memorial/Tribute Details
    tributeName: "",
    tributeRelation: "",
    tributeMessage: "",
    
    // Payment Details
    paymentMethod: "upi", // upi, card, netbanking, wallet
    upiId: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    walletType: "", // paytm, phonepe, googlepay
    walletNumber: "",
    
    // Additional Information
    isAnonymous: false,
    receiveUpdates: true,
    taxReceiptRequired: true,
    message: "",
    
    // Terms
    agreeToTerms: false,
    agreeToRefundPolicy: false,
  });

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleDonate = async () => {
    // Validation
    if (!finalAmount || finalAmount < 100) {
      alert(donateConfig.validation.minAmount);
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state) {
      alert(donateConfig.validation.requiredFields);
      return;
    }

    if (!form.agreeToTerms || !form.agreeToRefundPolicy) {
      alert(donateConfig.validation.agreeTerms);
      return;
    }

    // Validate payment method specific fields
    if (form.paymentMethod === 'upi' && !form.upiId) {
      alert(donateConfig.validation.upiRequired);
      return;
    }

    if (form.paymentMethod === 'card' && (!form.cardNumber || !form.cardName || !form.cardExpiry || !form.cardCvv)) {
      alert(donateConfig.validation.cardRequired);
      return;
    }

    if (form.paymentMethod === 'netbanking' && !form.bankName) {
      alert(donateConfig.validation.bankRequired);
      return;
    }

    if (form.paymentMethod === 'wallet' && (!form.walletType || !form.walletNumber)) {
      alert(donateConfig.validation.walletRequired);
      return;
    }

    setLoading(true);
    try {
      // First create donation record in backend
      const donationData = {
        amount: finalAmount,
        currency: 'INR',
        donationType: form.donationType,
        donationPurpose: form.donationPurpose,
        
        // Personal Details
        donorName: form.name,
        email: form.email,
        phone: form.phone,
        alternatePhone: form.alternatePhone || undefined,
        
        // Address
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
        
        // Tax Details
        panNumber: form.panNumber || undefined,
        aadharNumber: form.aadharNumber || undefined,
        
        // Tribute Details
        tributeName: form.tributeName || undefined,
        tributeRelation: form.tributeRelation || undefined,
        tributeMessage: form.tributeMessage || undefined,
        
        // Payment Details
        paymentMethod: form.paymentMethod,
        
        // Preferences
        isAnonymous: form.isAnonymous,
        receiveUpdates: form.receiveUpdates,
        taxReceiptRequired: form.taxReceiptRequired,
        message: form.message || undefined,
        
        status: 'pending'
      };

      // Create donation record first
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create donation record');
      }

      const donationResult = await response.json();
      console.log('Donation record created:', donationResult);

      // Now initiate Razorpay payment
      try {
        // Create Razorpay order
        const orderData = await createRazorpayOrder(finalAmount * 100); // Convert to paise
        
        // Prepare Razorpay options
        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with actual key
          amount: finalAmount * 100, // Amount in paise
          currency: 'INR',
          name: 'Moksha Seva',
          description: `Donation - ${form.donationPurpose}`,
          order_id: orderData.id,
          handler: async (response: any) => {
            // Payment successful
            console.log('Payment successful:', response);
            
            // Update donation status to completed
            try {
              await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/donations/${donationResult.data.donationId}/payment`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  status: 'completed'
                }),
              });
              
              setSubmitted(true);
            } catch (updateError) {
              console.error('Failed to update payment status:', updateError);
              alert('Payment successful but failed to update status. Please contact support.');
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: '#d97706', // Saffron color
          },
          modal: {
            ondismiss: () => {
              console.log('Payment cancelled by user');
              setLoading(false);
            },
          },
        };

        // Initiate Razorpay payment
        await initiatePayment(razorpayOptions);
        
      } catch (paymentError) {
        console.error('Razorpay payment error:', paymentError);
        alert('Failed to initiate payment. Please try again or contact support.');
      }

    } catch (error) {
      console.error('Donation error:', error);
      alert(`Failed to process donation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-saffron-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">
            {donateConfig.success.title}
          </h2>
          <p className="text-stone-600 mb-2">
            {donateConfig.success.message.replace('{amount}', finalAmount ? formatCurrency(finalAmount) : donateConfig.success.fallbackAmount)}
          </p>
          <p className="text-stone-500 text-sm mb-6">
            {donateConfig.success.receiptNote}
          </p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="text-saffron-600 text-sm underline"
            aria-label="Make another donation"
          >
            {donateConfig.success.anotherDonationButton}
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative bg-stone-50 text-gray-900 py-12 md:py-20 lg:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-100 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-stone-200 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-200 rounded-full blur-xl animate-pulse delay-500"></div>
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-100 backdrop-blur-sm border border-amber-200 rounded-full px-6 py-2 mb-6">
              {(() => {
                const BadgeIcon = getIcon(donateConfig.hero.badge.icon);
                return <BadgeIcon className="w-4 h-4 text-amber-700 fill-amber-700" />;
              })()}
              <span className="text-amber-700 text-sm font-semibold tracking-wide uppercase">
                {donateConfig.hero.badge.text}
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
              <span className="block">{donateConfig.hero.title.line1}</span>
              <span className="block text-amber-700">
                {donateConfig.hero.title.line2}
              </span>
              <span className="block">{donateConfig.hero.title.line3}</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {donateConfig.hero.subtitle}
            </p>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              {donateConfig.hero.impactStats.map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200">
                  <div className="text-3xl font-bold text-amber-700 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
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
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <p className="text-gray-500 text-sm mb-4 font-medium">{donateConfig.hero.trustMessage}</p>
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                {donateConfig.hero.trustIndicators.map((indicator, i) => {
                  const IndicatorIcon = getIcon(indicator.icon);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <IndicatorIcon className="w-4 h-4 text-green-600" />
                      <span>{indicator.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust signals */}
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
            
            {/* Amount Selection Section */}
            <div className="bg-white rounded-lg border border-cream-200 shadow-md p-5">
              <div className="text-center mb-4">
                <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">
                  {donateConfig.amountSelection.title}
                </h2>
                <p className="text-stone-600 text-xs">{donateConfig.amountSelection.subtitle}</p>
              </div>

              {/* Preset Amounts */}
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
                      <div className="mt-2 text-xs text-orange-600 font-medium">
                        {tier.impact}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
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

              {/* Impact Display */}
              {finalAmount && (
                <div className="max-w-md mx-auto bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-green-900 font-bold text-xs mb-0.5">{donateConfig.amountSelection.impactTitle}</p>
                      <p className="text-green-800 text-xs leading-snug">
                        {formatCurrency(finalAmount)} will help:{" "}
                        <span className="font-semibold">
                          {donateConfig.donationTiers.find((t) => t.amount === finalAmount)?.impact ||
                            `${Math.floor(finalAmount / 500)} cremation service${Math.floor(finalAmount / 500) > 1 ? 's' : ''}`}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
              <h3 className="font-bold text-stone-800 text-sm mb-3 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                {donateConfig.trustBadges.title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {donateConfig.trustBadges.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-md">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {badge.icon}
                    </span>
                    <span className="text-stone-700 text-xs font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donation Form */}
            <div className="bg-white rounded-lg border border-cream-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-saffron-600 to-orange-600 text-white p-5 text-center">
                <h3 className="font-serif text-xl font-bold mb-1">{donateConfig.form.title}</h3>
                <p className="text-saffron-100 text-xs">{donateConfig.form.subtitle}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                
                    {/* Personal Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                          <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{donateConfig.form.sections.personalInfo.stepNumber}</span>
                          {donateConfig.form.sections.personalInfo.title}
                        </h4>
                        <div className="space-y-4">
                          <InputField
                            label={donateConfig.form.sections.personalInfo.fields.fullName.label}
                            placeholder={donateConfig.form.sections.personalInfo.fields.fullName.placeholder}
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                          <InputField
                            label={donateConfig.form.sections.personalInfo.fields.email.label}
                            type="email"
                            placeholder={donateConfig.form.sections.personalInfo.fields.email.placeholder}
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                          <InputField
                            label={donateConfig.form.sections.personalInfo.fields.phone.label}
                            type="tel"
                            placeholder={donateConfig.form.sections.personalInfo.fields.phone.placeholder}
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Address Details */}
                      <div>
                        <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                          <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{donateConfig.form.sections.address.stepNumber}</span>
                          {donateConfig.form.sections.address.title}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">
                              {donateConfig.form.sections.address.fields.address.label} <span className="text-red-500">*</span>
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
                              {donateConfig.form.sections.address.fields.state.label} <span className="text-red-500">*</span>
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

                    {/* Tax Details */}
                    <div>
                      <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                        <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{donateConfig.form.sections.taxDetails.stepNumber}</span>
                        {donateConfig.form.sections.taxDetails.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label={donateConfig.form.sections.taxDetails.fields.panNumber.label}
                          placeholder={donateConfig.form.sections.taxDetails.fields.panNumber.placeholder}
                          maxLength={10}
                          value={form.panNumber}
                          onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                        />
                        <InputField
                          label={donateConfig.form.sections.taxDetails.fields.aadharNumber.label}
                          placeholder={donateConfig.form.sections.taxDetails.fields.aadharNumber.placeholder}
                          maxLength={12}
                          value={form.aadharNumber}
                          onChange={(e) => setForm({ ...form, aadharNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Donation Preferences */}
                    <div>
                      <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                        <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{donateConfig.form.sections.preferences.stepNumber}</span>
                        {donateConfig.form.sections.preferences.title}
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">
                            {donateConfig.form.sections.preferences.frequency.label} <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {donateConfig.form.sections.preferences.frequency.types.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => setForm({ ...form, donationType: type.value })}
                                className={`px-4 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-300 text-center ${
                                  form.donationType === type.value
                                    ? "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                                    : "border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:shadow-md hover:scale-102"
                                }`}
                              >
                                <div className="font-bold">{type.label}</div>
                                <div className="text-xs opacity-80 mt-1">{type.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">
                            {donateConfig.form.sections.preferences.purpose.label} <span className="text-red-500">*</span>
                          </label>
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

                        {(form.donationPurpose === "memorial" || form.donationPurpose === "tribute") && (
                          <div className="space-y-3 bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                            <InputField
                              label={form.donationPurpose === "memorial" ? donateConfig.form.sections.preferences.tribute.memorialLabel : donateConfig.form.sections.preferences.tribute.honorLabel}
                              placeholder={donateConfig.form.sections.preferences.tribute.nameLabel}
                              value={form.tributeName}
                              onChange={(e) => setForm({ ...form, tributeName: e.target.value })}
                            />
                            <div>
                              <label className="block text-sm font-semibold text-stone-700 mb-2">{donateConfig.form.tribute.messageLabel}</label>
                              <textarea
                                placeholder={donateConfig.form.sections.preferences.tribute.messagePlaceholder}
                                rows={2}
                                value={form.tributeMessage}
                                onChange={(e) => setForm({ ...form, tributeMessage: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                    <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{donateConfig.form.sections.payment.stepNumber}</span>
                    {donateConfig.form.sections.payment.title}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {donateConfig.form.sections.payment.methods.map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: method.value })}
                        className={`px-3 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-300 text-center ${
                          form.paymentMethod === method.value
                            ? "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                            : "border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:shadow-md hover:scale-102"
                        }`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="font-bold">{method.label}</div>
                        <div className="text-xs opacity-80 mt-1">{method.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* UPI Details */}
                  {form.paymentMethod === "upi" && (
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 space-y-3">
                      <InputField
                        label={donateConfig.form.sections.payment.upi.label}
                        placeholder={donateConfig.form.sections.payment.upi.placeholder}
                        required
                        value={form.upiId}
                        onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                      />
                      <p className="text-xs text-blue-700 font-medium">{donateConfig.form.sections.payment.upi.helpText}</p>
                    </div>
                  )}

                  {/* Card Details */}
                  {form.paymentMethod === "card" && (
                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 space-y-3">
                      <InputField
                        label={donateConfig.form.sections.payment.card.cardNumber.label}
                        placeholder={donateConfig.form.sections.payment.card.cardNumber.placeholder}
                        required
                        maxLength={19}
                        value={form.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                          setForm({ ...form, cardNumber: formatted });
                        }}
                      />
                      <InputField
                        label={donateConfig.form.sections.payment.card.cardName.label}
                        placeholder={donateConfig.form.sections.payment.card.cardName.placeholder}
                        required
                        value={form.cardName}
                        onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField
                          label={donateConfig.form.sections.payment.card.expiry.label}
                          placeholder={donateConfig.form.sections.payment.card.expiry.placeholder}
                          required
                          maxLength={5}
                          value={form.cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setForm({ ...form, cardExpiry: value });
                          }}
                        />
                        <InputField
                          label={donateConfig.form.sections.payment.card.cvv.label}
                          placeholder={donateConfig.form.sections.payment.card.cvv.placeholder}
                          required
                          maxLength={3}
                          type="password"
                          value={form.cardCvv}
                          onChange={(e) => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, '') })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Net Banking Details */}
                  {form.paymentMethod === "netbanking" && (
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {donateConfig.form.sections.payment.netbanking.label} <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.bankName}
                          onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white font-medium"
                        >
                          <option value="">{donateConfig.form.sections.payment.netbanking.placeholder}</option>
                          {donateConfig.form.sections.payment.netbanking.banks.map((bank) => (
                            <option key={bank.value} value={bank.value}>{bank.label}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-green-700 font-medium">{donateConfig.form.sections.payment.netbanking.helpText}</p>
                    </div>
                  )}

                  {/* Wallet Details */}
                  {form.paymentMethod === "wallet" && (
                    <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200 space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {donateConfig.form.sections.payment.wallet.label} <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {donateConfig.form.sections.payment.wallet.wallets.map((wallet) => (
                            <button
                              key={wallet.value}
                              type="button"
                              onClick={() => setForm({ ...form, walletType: wallet.value })}
                              className={`px-3 py-2 rounded-lg border-2 text-xs font-semibold transition-all ${
                                form.walletType === wallet.value
                                  ? "border-orange-600 bg-orange-600 text-white"
                                  : "border-stone-300 bg-white text-stone-700 hover:border-orange-400"
                              }`}
                            >
                              {wallet.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <InputField
                        label={donateConfig.form.sections.payment.wallet.mobileLabel}
                        placeholder={donateConfig.form.sections.payment.wallet.mobilePlaceholder}
                        required
                        value={form.walletNumber}
                        onChange={(e) => setForm({ ...form, walletNumber: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* Additional Preferences & Terms */}
                <div className="space-y-4 pt-4 border-t-2 border-stone-200">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.isAnonymous}
                        onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                        className="mt-1 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                      />
                      <span className="text-sm text-stone-700 font-medium group-hover:text-stone-900">{donateConfig.form.preferences.anonymous}</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.receiveUpdates}
                        onChange={(e) => setForm({ ...form, receiveUpdates: e.target.checked })}
                        className="mt-1 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                      />
                      <span className="text-sm text-stone-700 font-medium group-hover:text-stone-900">{donateConfig.form.preferences.updates}</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.taxReceiptRequired}
                        onChange={(e) => setForm({ ...form, taxReceiptRequired: e.target.checked })}
                        className="mt-1 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                      />
                      <span className="text-sm text-stone-700 font-medium group-hover:text-stone-900">{donateConfig.form.preferences.taxReceipt}</span>
                    </label>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-stone-200">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.agreeToTerms}
                        onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                        className="mt-1 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                        required
                      />
                      <span className="text-sm text-stone-700 font-medium">
                        {donateConfig.form.terms.termsLabel.split('Terms & Conditions')[0]}
                        <Link href="/legal/terms" className="text-saffron-600 underline font-bold hover:text-saffron-700">Terms & Conditions</Link> <span className="text-red-500">*</span>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.agreeToRefundPolicy}
                        onChange={(e) => setForm({ ...form, agreeToRefundPolicy: e.target.checked })}
                        className="mt-1 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                        required
                      />
                      <span className="text-sm text-stone-700 font-medium">
                        {donateConfig.form.terms.refundLabel.split('Refund Policy')[0]}
                        <Link href="/donate/refund-policy" className="text-saffron-600 underline font-bold hover:text-saffron-700">Refund Policy</Link> <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-lg py-4 bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
                    loading={loading}
                    onClick={handleDonate}
                    disabled={
                      !finalAmount || 
                      !form.name || 
                      !form.email || 
                      !form.phone ||
                      !form.address ||
                      !form.city ||
                      !form.state ||
                      !form.pincode ||
                      !form.agreeToTerms ||
                      !form.agreeToRefundPolicy
                    }
                  >
                    <Heart className="w-5 h-5 mr-2 fill-white" />
                    {donateConfig.form.submitButton} {finalAmount ? formatCurrency(finalAmount) : "Now"}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-stone-500 text-xs mt-4">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{donateConfig.form.securityNote}</span>
                  </div>

                  <Link 
                    href="/donate/refund-policy"
                    className="flex items-center justify-center gap-1 text-saffron-600 text-xs hover:underline mt-3 font-medium"
                  >
                    <FileText className="w-3 h-3" />
                    {donateConfig.form.policyLink}
                  </Link>
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
