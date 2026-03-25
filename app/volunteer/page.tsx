"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { volunteerConfig } from "@/config/volunteer.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

import { useCallback, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { FormSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function VolunteerPage() {
  const { config, loading, error: configError } = usePageConfig('volunteer', volunteerConfig);
  const { success: showSuccessToast, error: showErrorToast, warning: showWarningToast } = useToast();
  
  // Use fallback config if dynamic config is null
  const activeConfig = config || volunteerConfig;

  // Multi-step State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Get icons
  const Heart = getIcon('Heart');
  const CheckCircle = getIcon('CheckCircle');
  const Users = getIcon('Users');
  const User = getIcon('User');
  const ArrowRight = getIcon('ChevronRight');
  const ArrowLeft = getIcon('ChevronLeft');

  const volunteerTypes = activeConfig.volunteerTypes.map(type => ({
    ...type,
    icon: getIcon(type.icon)
  }));

  const availabilityOptions = activeConfig.selectOptions.availabilityOptions;
  const experienceLevels = activeConfig.selectOptions.experienceLevels;
  const indianStates = activeConfig.selectOptions.states;

  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [form, setForm] = useState({
    // Registration Type
    registrationType: "individual", // individual or group
    
    // Personal Details
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    gender: "",
    
    // Address
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Professional Details
    occupation: "",
    organization: "",
    experience: "",
    skills: "",
    
    // Social Media
    facebookProfile: "",
    instagramHandle: "",
    twitterHandle: "",
    linkedinProfile: "",
    
    // Volunteer Details
    availability: "",
    preferredLocation: "",
    hasVehicle: false,
    vehicleType: "",
    languagesKnown: "",
    
    // Group Details (if group registration)
    groupName: "",
    groupSize: "",
    groupType: "", // corporate, college, ngo, community
    groupLeaderName: "",
    groupLeaderPhone: "",
    groupLeaderEmail: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    
    // Additional
    whyVolunteer: "",
    previousVolunteerWork: "",
    medicalConditions: "",
    
    // Agreements
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const nextStep = () => {
    // Basic validation per step
    if (currentStep === 1 && selectedTypes.length === 0) {
      showWarningToast("Please select at least one mission type");
      return;
    }
    if (currentStep === 2) {
      if (!form.name || !form.email || !form.phone || !form.dateOfBirth || !form.gender) {
        showWarningToast("Please fill all required personal details");
        return;
      }
      if (!isEmailVerified) {
        showWarningToast("Please verify your email address to continue");
        return;
      }
      if (!isMobileVerified) {
        showWarningToast("Please verify your mobile number via WhatsApp");
        return;
      }
    }
    if (currentStep === 3) {
      if (!form.address || !form.city || !form.state || !form.pincode) {
        showWarningToast("Please provide your complete address");
        return;
      }
    }
    
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

    const handleSubmit = async () => {
        // Final Validation
        if (!form.whyVolunteer || !form.agreeToTerms) {
            showWarningToast("Please share why you want to join and accept the terms");
            return;
        }

        setLoadingSubmit(true);
        try {
            let volunteerData: any = {
                ...form,
                volunteerTypes: selectedTypes
            };

            // Remove empty group fields for individual registration
            if (form.registrationType === 'individual') {
                const { groupName, groupSize, groupType, groupLeaderName, groupLeaderPhone, groupLeaderEmail, ...individualData } = volunteerData;
                volunteerData = individualData;
            } else if (form.registrationType === 'group') {
                // Convert groupSize to number for group registration
                volunteerData.groupSize = parseInt(form.groupSize) || 0;
            }

            // Remove empty optional fields 
            const cleanedData: any = {};
            Object.keys(volunteerData).forEach(key => {
                const value = volunteerData[key as keyof typeof volunteerData];
                if (value !== '' && value !== null && value !== undefined) {
                    cleanedData[key] = value;
                }
            });
            volunteerData = cleanedData;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/volunteers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(volunteerData),
            });

            if (response.ok) {
                showSuccessToast(activeConfig.success.title);
                setSubmitted(true);
            } else {
                const error = await response.json().catch(() => ({ message: 'Network error' }));
                throw new Error(error.message || 'Failed to submit volunteer application');
            }
        } catch (error) {
            console.error('Volunteer form error:', error);
            showErrorToast(`${activeConfig.validationMessages.submitFailed}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoadingSubmit(false);
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
            {activeConfig.success.title}
          </h2>
          <p className="text-stone-600 mb-6">
            {activeConfig.success.description}
          </p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="text-saffron-600 text-sm underline"
            aria-label="Register another volunteer"
          >
            {activeConfig.success.registerAnotherText}
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-12 md:py-16 lg:py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <Container>
          <div className="relative z-10">
            <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">{activeConfig.hero.badge}</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4">
              {activeConfig.hero.title}
            </h1>
            <p className="text-stone-300 text-lg max-w-2xl">
              {activeConfig.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Progress Bar */}
      {!submitted && (
        <div className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
          <Container>
            <div className="py-4 md:py-6">
              <div className="flex justify-between items-center max-w-4xl mx-auto px-4">
                {[
                  { label: "Mission", icon: Heart },
                  { label: "Identity", icon: User },
                  { label: "Details", icon: Users },
                  { label: "Confirm", icon: CheckCircle }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 relative">
                    <div 
                      className={cn(
                        "w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all duration-500 z-10",
                        currentStep > idx + 1 ? "bg-saffron-600 border-saffron-600 text-white" : 
                        currentStep === idx + 1 ? "border-saffron-600 text-saffron-600 scale-110 shadow-lg" : 
                        "border-stone-200 text-stone-300 bg-white"
                      )}
                    >
                      {currentStep > idx + 1 ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={cn(
                      "text-[10px] md:text-xs font-bold uppercase tracking-tighter",
                      currentStep === idx + 1 ? "text-saffron-600" : "text-stone-400"
                    )}>
                      {step.label}
                    </span>
                    {/* Connector */}
                    {idx < 3 && (
                      <div className="absolute left-[2.5rem] top-5 w-[calc(100vw/4)] md:w-48 h-0.5 bg-stone-100 -z-0">
                        <div 
                          className="h-full bg-saffron-600 transition-all duration-700" 
                          style={{ width: currentStep > idx + 1 ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}

      <section className="py-12 md:py-16 bg-cream-50 min-h-screen">
        <Container>
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <FormSkeleton />
            ) : submitted ? (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle className="w-12 h-12 text-saffron-600" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">
                  {activeConfig.success.title}
                </h2>
                <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                  {activeConfig.success.description}
                </p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(1);
                  }} 
                  className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-xl"
                >
                  {activeConfig.success.registerAnotherText}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                <div className="flex-1 p-8 md:p-10">
                  {/* STEP 1: Volunteer Types */}
                  {currentStep === 1 && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                      <div className="mb-8">
                        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                          {activeConfig.labels.selectVolunteerTypes}
                        </h2>
                        <p className="text-stone-500">
                          {activeConfig.labels.selectVolunteerTypesDesc}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {volunteerTypes.map((type) => {
                          const Icon = type.icon;
                          const selected = selectedTypes.includes(type.value);
                          return (
                            <button
                              key={type.value}
                              onClick={() => toggleType(type.value)}
                              className={cn(
                                "p-5 rounded-2xl border-2 text-left transition-all group relative overflow-hidden",
                                selected
                                  ? "border-saffron-600 bg-saffron-50/50 shadow-md ring-1 ring-saffron-600"
                                  : "border-stone-100 bg-white hover:border-saffron-200 hover:shadow-sm"
                              )}
                            >
                              <div className="flex items-start gap-4 relative z-10">
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                  selected ? "bg-saffron-600" : "bg-stone-50 group-hover:bg-saffron-50"
                                )}>
                                  <Icon className={cn("w-6 h-6", selected ? "text-white" : "text-stone-600")} />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-stone-900 text-base mb-1">{type.label}</h3>
                                  <p className="text-stone-500 text-xs leading-relaxed mb-3">{type.desc}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-600"></span>
                                    <p className="text-saffron-700 text-[10px] font-bold uppercase tracking-wider">{type.commitment}</p>
                                  </div>
                                </div>
                                {selected && (
                                  <div className="bg-saffron-600 rounded-full p-1 border-2 border-white shadow-sm">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Identity & Registration */}
                  {currentStep === 2 && (
                    <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Personal Identity</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, registrationType: "individual" })}
                            className={cn(
                              "p-4 rounded-xl border-2 text-center transition-all",
                              form.registrationType === "individual" ? "border-saffron-600 bg-saffron-50 shadow-sm" : "border-stone-100"
                            )}
                          >
                            <User className={cn("w-6 h-6 mx-auto mb-2", form.registrationType === "individual" ? "text-saffron-600" : "text-stone-300")} />
                            <p className="font-bold text-stone-800 text-sm">Individual</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, registrationType: "group" })}
                            className={cn(
                              "p-4 rounded-xl border-2 text-center transition-all",
                              form.registrationType === "group" ? "border-saffron-600 bg-saffron-50 shadow-sm" : "border-stone-100"
                            )}
                          >
                            <Users className={cn("w-6 h-6 mx-auto mb-2", form.registrationType === "group" ? "text-saffron-600" : "text-stone-300")} />
                            <p className="font-bold text-stone-800 text-sm">Group/Org</p>
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <InputField
                            label="Full Name"
                            placeholder="e.g. Manish Sirohi"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                          <div className="space-y-3">
                            <InputField
                              label="Email Address"
                              type="email"
                              required
                              value={form.email}
                              onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                setIsEmailVerified(false);
                              }}
                              disabled={isEmailVerified}
                            />
                            {form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && !isEmailVerified && (
                              <EmailVerification email={form.email} onVerified={setIsEmailVerified} />
                            )}
                          </div>
                          <div className="space-y-3">
                            <InputField
                              label="WhatsApp Number"
                              type="tel"
                              required
                              value={form.phone}
                              onChange={(e) => {
                                setForm({ ...form, phone: e.target.value });
                                setIsMobileVerified(false);
                              }}
                              disabled={isMobileVerified}
                            />
                            {form.phone && form.phone.length >= 10 && !isMobileVerified && (
                              <MobileVerification mobile={form.phone} onVerified={setIsMobileVerified} />
                            )}
                          </div>
                          <InputField
                            label="Date of Birth"
                            type="date"
                            required
                            value={form.dateOfBirth}
                            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Details & Skills */}
                  {currentStep === 3 && (
                    <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6 font-serif">Reach & Expertise</h2>
                        
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-stone-700 mb-2">Residential Address</label>
                              <textarea
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full p-4 border-2 border-stone-100 rounded-xl focus:border-saffron-500 focus:outline-none min-h-[100px]"
                                placeholder="House No, Street, Area..."
                              />
                            </div>
                            <InputField label="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                            <InputField label="Pincode" maxLength={6} value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} />
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-stone-50">
                            <InputField label="Occupation" value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} />
                            <InputField label="Special Skills" placeholder="e.g. Photography, Driving, Yoga..." value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Mission Commitment */}
                  {currentStep === 4 && (
                    <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6 font-serif">Final Commitment</h2>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Why do you want to join Moksha Sewa Foundation?</label>
                            <textarea
                              value={form.whyVolunteer}
                              onChange={(e) => setForm({ ...form, whyVolunteer: e.target.value })}
                              className="w-full p-4 border-2 border-stone-100 rounded-xl focus:border-saffron-500 focus:outline-none min-h-[120px]"
                              placeholder="Share your passion or story..."
                            />
                          </div>

                          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                             <div className="space-y-4">
                               <label className="flex items-center gap-3 cursor-pointer group">
                                 <input 
                                   type="checkbox" 
                                   checked={form.agreeToTerms}
                                   onChange={e => setForm({...form, agreeToTerms: e.target.checked})}
                                   className="w-5 h-5 rounded border-stone-300 text-saffron-600 focus:ring-saffron-500"
                                 />
                                 <span className="text-sm text-stone-600 font-medium">I agree to the terms of service and code of conduct.</span>
                               </label>
                               <label className="flex items-center gap-3 cursor-pointer group">
                                 <input 
                                   type="checkbox" 
                                   checked={form.agreeToBackgroundCheck}
                                   onChange={e => setForm({...form, agreeToBackgroundCheck: e.target.checked})}
                                   className="w-5 h-5 rounded border-stone-300 text-saffron-600 focus:ring-saffron-500"
                                 />
                                 <span className="text-sm text-stone-600 font-medium">I consent to a basic background verification.</span>
                               </label>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="bg-stone-50/80 backdrop-blur-sm p-6 md:p-8 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1 || loadingSubmit}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                      currentStep === 1 ? "opacity-0 invisible" : "text-stone-600 hover:bg-white hover:shadow-md"
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      className="px-10 py-3 shadow-xl bg-[#000080] hover:bg-black text-white hover:scale-105 transition-all text-sm font-black uppercase tracking-widest border-b-4 border-amber-900"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      loading={loadingSubmit}
                      className="px-12 py-4 shadow-2xl bg-saffron-600 hover:bg-saffron-700 text-white hover:scale-105 transition-all text-lg font-black uppercase tracking-widest border-b-4 border-amber-900"
                    >
                      Submit Application
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
