"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { Heart, CheckCircle, Shield, User, Mail, Phone, FileText } from "lucide-react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

export default function LegacyGivingRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Personal Details
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    
    // Address
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Legacy Interest
    legacyType: "",
    estimatedAmount: "",
    timeframe: "",
    specificInterest: "",
    
    // Family Details
    hasFamily: "",
    familyAware: "",
    spouseName: "",
    childrenDetails: "",
    
    // Financial Details
    currentAge: "",
    retirementPlanned: "",
    existingWill: "",
    financialAdvisor: "",
    advisorContact: "",
    
    // Preferences
    recognitionPreference: "",
    anonymousGiving: false,
    informationRequested: [] as string[],
    
    // Additional Information
    motivation: "",
    questions: "",
    preferredContact: "",
    bestTimeToCall: "",
    
    // Consent
    agreeToContact: false,
    agreeToPrivacy: false,
  });

  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.email || !form.phone || !form.legacyType) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const legacyData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        pincode: form.pincode || undefined,
        legacyType: form.legacyType,
        estimatedValue: form.estimatedAmount || undefined, // Backend expects 'estimatedValue'
        timeframe: form.timeframe || undefined,
        specificPurpose: form.specificInterest || undefined, // Backend expects 'specificPurpose'
        additionalInfo: form.motivation || undefined, // Backend expects 'additionalInfo'
        preferredContact: form.preferredContact || 'email',
        bestTimeToContact: form.bestTimeToCall || undefined,
        status: 'new'
      };

      console.log('Submitting legacy data:', legacyData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/legacy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(legacyData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Legacy request submitted successfully:', result);
        setSubmitted(true);
        // Reset form
        setForm({
          name: "", email: "", phone: "", alternatePhone: "", dateOfBirth: "",
          address: "", city: "", state: "", pincode: "",
          legacyType: "", estimatedAmount: "", timeframe: "", specificInterest: "",
          hasFamily: "", familyAware: "", spouseName: "", childrenDetails: "",
          currentAge: "", retirementPlanned: "", existingWill: "", financialAdvisor: "", advisorContact: "",
          recognitionPreference: "", anonymousGiving: false, informationRequested: [] as string[],
          motivation: "", questions: "", preferredContact: "", bestTimeToCall: "",
          agreeToContact: false, agreeToPrivacy: false,
        });
      } else {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Legacy giving request error:', error);
      alert(`Failed to submit request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setForm({ ...form, informationRequested: [...form.informationRequested, value] });
    } else {
      setForm({ ...form, informationRequested: form.informationRequested.filter(item => item !== value) });
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">Request Received!</h2>
          <p className="text-stone-600 mb-2">
            Thank you for your interest in legacy giving with Moksha Seva.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Reference: <span className="font-mono font-bold text-saffron-600">LG-2024-{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <p className="text-stone-600 text-sm mb-6">
            Our legacy giving specialist will contact you within 3-5 business days with personalized information.
          </p>
          <button onClick={() => setSubmitted(false)} className="text-saffron-600 text-sm underline">
            Submit another request
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white py-16">
        <Container>
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center border-2 border-emerald-500/50 flex-shrink-0">
              <Heart className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">Legacy Planning</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                Legacy Giving Information Request
              </h1>
              <p className="text-emerald-50 text-base">
                Request personalized information about creating a lasting legacy with Moksha Seva.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Request Form */}
      <section className="py-12 bg-cream-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="info" title="Confidential & No Obligation" className="mb-6">
            All information is kept strictly confidential. This is an information request only with no obligation to commit.
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-stone-800">Legacy Information Request</h2>
              <p className="text-stone-500 text-xs mt-1">Help us provide you with the most relevant information</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Personal Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Full Name *"
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <InputField
                      label="Email Address *"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Phone Number *"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <InputField
                      label="Alternate Phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.alternatePhone}
                      onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Date of Birth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    />
                    <InputField
                      label="Current Age"
                      placeholder="e.g., 55"
                      value={form.currentAge}
                      onChange={(e) => setForm({ ...form, currentAge: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              {/* Section 2: Legacy Interest */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Legacy Interest</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Type of Legacy Gift *
                    </label>
                    <select
                      value={form.legacyType}
                      onChange={(e) => setForm({ ...form, legacyType: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select legacy type</option>
                      <option value="will_bequest">Bequest in Will</option>
                      <option value="life_insurance">Life Insurance Beneficiary</option>
                      <option value="retirement_plan">Retirement Plan Beneficiary</option>
                      <option value="charitable_trust">Charitable Trust</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Estimated Amount (Optional)"
                      placeholder="e.g., ₹5,00,000"
                      value={form.estimatedAmount}
                      onChange={(e) => setForm({ ...form, estimatedAmount: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Timeframe
                      </label>
                      <select
                        value={form.timeframe}
                        onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Select timeframe</option>
                        <option value="immediate">Immediate</option>
                        <option value="1_2_years">1-2 Years</option>
                        <option value="3_5_years">3-5 Years</option>
                        <option value="5_plus_years">5+ Years</option>
                        <option value="uncertain">Uncertain</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section 3: Address Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Address Information</h3>
                </div>
                <div className="space-y-3">
                  <InputField
                    label="Address"
                    placeholder="Complete address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="City"
                      placeholder="City name"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        State
                      </label>
                      <select
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Select state</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="Pincode"
                      placeholder="123456"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Contact Preferences */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Contact Preferences</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Preferred Contact Method
                      </label>
                      <select
                        value={form.preferredContact}
                        onChange={(e) => setForm({ ...form, preferredContact: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Select method</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="mail">Mail</option>
                        <option value="in_person">In Person</option>
                      </select>
                    </div>
                    <InputField
                      label="Best Time to Call"
                      placeholder="e.g., Weekdays 10 AM - 2 PM"
                      value={form.bestTimeToCall}
                      onChange={(e) => setForm({ ...form, bestTimeToCall: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      value={form.motivation}
                      onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Any specific questions or additional information you'd like to share..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-stone-200 mt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.phone || !form.legacyType}
                >
                  Request Information
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  This is a no-obligation information request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}