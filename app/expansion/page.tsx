"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { MapPin, CheckCircle } from "lucide-react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

export default function ExpansionRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Requester Details
    requesterName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    designation: "",
    organization: "",
    
    // Location Details
    requestedCity: "",
    requestedState: "",
    requestedDistrict: "",
    population: "",
    currentServices: "",
    
    // Need Assessment
    urgencyLevel: "",
    estimatedCases: "",
    existingInfrastructure: "",
    localSupport: "",
    
    // Justification
    whyNeeded: "",
    communitySupport: "",
    localChallenges: "",
    proposedSolution: "",
    
    // Resources
    volunteerCommitment: "",
    fundingSupport: "",
    governmentSupport: "",
    partnerOrganizations: "",
    
    // Contact Information
    localContactName: "",
    localContactPhone: "",
    localContactEmail: "",
    
    // Additional Information
    additionalInfo: "",
    timeframe: "",
    
    // Consent
    agreeToTerms: false,
    agreeToFollowUp: false,
  });

  const handleSubmit = async () => {
    // Validation
    if (!form.requesterName || !form.email || !form.phone || !form.requestedCity || !form.whyNeeded) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const expansionData = {
        ...form,
        status: 'new'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/expansion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expansionData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setForm({
          requesterName: "", email: "", phone: "", alternatePhone: "", designation: "", organization: "",
          requestedCity: "", requestedState: "", requestedDistrict: "", population: "", currentServices: "",
          urgencyLevel: "", estimatedCases: "", existingInfrastructure: "", localSupport: "",
          whyNeeded: "", communitySupport: "", localChallenges: "", proposedSolution: "",
          volunteerCommitment: "", fundingSupport: "", governmentSupport: "", partnerOrganizations: "",
          localContactName: "", localContactPhone: "", localContactEmail: "",
          additionalInfo: "", timeframe: "",
          agreeToTerms: false, agreeToFollowUp: false,
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Expansion request error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">Request Submitted!</h2>
          <p className="text-stone-600 mb-2">
            Thank you for your expansion request.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Request ID: <span className="font-mono font-bold text-saffron-600">EXP-2024-{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <p className="text-stone-600 text-sm mb-6">
            Our team will review your request and contact you within 5-7 business days.
          </p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="text-saffron-600 text-sm underline"
            aria-label="Submit another expansion request"
          >
            Submit another request
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 to-emerald-900 text-white py-16">
        <Container>
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center border-2 border-green-500/50 flex-shrink-0">
              <MapPin className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <span className="text-green-300 text-xs font-semibold tracking-wider uppercase">Service Expansion</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                Request Moksha Seva in Your City
              </h1>
              <p className="text-green-50 text-base">
                Help us bring dignified last rites services to your community. Submit a detailed expansion request.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Request Form */}
      <section className="py-12 bg-cream-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="info" title="Expansion Requirements" className="mb-6">
            We evaluate expansion requests based on community need, local support, and available resources.
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-stone-800">Service Expansion Request</h2>
              <p className="text-stone-500 text-xs mt-1">Help us understand the need in your community</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Requester Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Requester Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Your Name *"
                      placeholder="Full name"
                      required
                      value={form.requesterName}
                      onChange={(e) => setForm({ ...form, requesterName: e.target.value })}
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
                      label="Organization/Designation"
                      placeholder="Your role or organization"
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Requested Location
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="City *"
                      placeholder="City name"
                      required
                      value={form.requestedCity}
                      onChange={(e) => setForm({ ...form, requestedCity: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        State *
                      </label>
                      <select
                        value={form.requestedState}
                        onChange={(e) => setForm({ ...form, requestedState: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select state</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="District"
                      placeholder="District name"
                      value={form.requestedDistrict}
                      onChange={(e) => setForm({ ...form, requestedDistrict: e.target.value })}
                    />
                  </div>
                  <InputField
                    label="Population (approximate)"
                    placeholder="e.g., 5 lakhs"
                    value={form.population}
                    onChange={(e) => setForm({ ...form, population: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 3: Need Assessment */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Need Assessment</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Why is Moksha Seva needed in this location? *
                    </label>
                    <textarea
                      placeholder="Describe the current situation and need for dignified last rites services"
                      rows={4}
                      required
                      value={form.whyNeeded}
                      onChange={(e) => setForm({ ...form, whyNeeded: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Urgency Level
                      </label>
                      <select
                        value={form.urgencyLevel}
                        onChange={(e) => setForm({ ...form, urgencyLevel: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select urgency</option>
                        <option value="immediate">Immediate (within 1 month)</option>
                        <option value="high">High (within 3 months)</option>
                        <option value="medium">Medium (within 6 months)</option>
                        <option value="low">Low (within 1 year)</option>
                      </select>
                    </div>
                    <InputField
                      label="Estimated Cases per Month"
                      placeholder="e.g., 10-15 cases"
                      value={form.estimatedCases}
                      onChange={(e) => setForm({ ...form, estimatedCases: e.target.value })}
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
                  disabled={!form.requesterName || !form.email || !form.phone || !form.requestedCity || !form.whyNeeded}
                >
                  Submit Expansion Request
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  We will review your request and contact you within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}