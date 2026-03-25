"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { FileText, CheckCircle, Upload, User, Home, Banknote, RefreshCw } from "lucide-react";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

export default function SchemesApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [form, setForm] = useState({
    // Personal Details
    applicantName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    
    // Contact Details
    email: "",
    phone: "",
    alternatePhone: "",
    
    // Address Details
    address: "",
    city: "",
    state: "",
    pincode: "",
    district: "",
    
    // Identity Details
    aadhaarNumber: "",
    panNumber: "",
    voterIdNumber: "",
    rationCardNumber: "",
    
    // Family Details
    familySize: "",
    dependents: "",
    monthlyIncome: "",
    incomeSource: "",
    
    // Scheme Details
    schemeAppliedFor: "",
    previousApplications: false,
    previousApplicationDetails: "",
    urgencyLevel: "",
    
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    
    // Additional Information
    disability: false,
    disabilityDetails: "",
    medicalConditions: "",
    additionalInfo: "",
    
    // Consent
    agreeToTerms: false,
    agreeToVerification: false,
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setDocuments([...documents, ...fileArray]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.applicantName || !form.email || !form.phone || !form.schemeAppliedFor || !form.address || !form.city || !form.state || !form.pincode || !form.agreeToTerms) {
      alert('Please fill in all required fields and agree to terms');
      return;
    }

    if (!isEmailVerified) {
      alert("Please verify your email address first");
      return;
    }

    if (!isMobileVerified) {
      alert("Please verify your mobile number via WhatsApp first");
      return;
    }

    setLoading(true);
    try {
      // Prepare form data to match backend model
      const schemeData = {
        name: form.applicantName, // Backend expects 'name'
        email: form.email,
        phone: form.phone,
        aadhaarNumber: form.aadhaarNumber,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        schemeName: form.schemeAppliedFor, // Backend expects 'schemeName'
        schemeType: 'central', // Default to central for now
        incomeCategory: 'other', // Default value
        familySize: parseInt(form.familySize) || 1,
        monthlyIncome: parseFloat(form.monthlyIncome) || 0,
        agreeToTerms: form.agreeToTerms
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/schemes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schemeData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Scheme application submitted successfully:', result);
        setSubmitted(true);
        // Reset form
        setForm({
          applicantName: "", fatherName: "", motherName: "", dateOfBirth: "", gender: "", maritalStatus: "",
          email: "", phone: "", alternatePhone: "",
          address: "", city: "", state: "", pincode: "", district: "",
          aadhaarNumber: "", panNumber: "", voterIdNumber: "", rationCardNumber: "",
          familySize: "", dependents: "", monthlyIncome: "", incomeSource: "",
          schemeAppliedFor: "", previousApplications: false, previousApplicationDetails: "", urgencyLevel: "",
          bankName: "", accountNumber: "", ifscCode: "", branchName: "",
          disability: false, disabilityDetails: "", medicalConditions: "", additionalInfo: "",
          agreeToTerms: false, agreeToVerification: false,
        });
        setDocuments([]);
      } else {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Scheme application error:', error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">Application Submitted!</h2>
          <p className="text-stone-600 mb-2">
            Your government scheme application has been received.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Application ID: <span className="font-mono font-bold text-saffron-600">GS-2024-{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <p className="text-stone-600 text-sm mb-6">
            Our team will review your application and contact you within 5-7 business days.
          </p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="text-saffron-600 text-sm underline"
            aria-label="Submit another scheme application"
          >
            Submit another application
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-16">
        <Container>
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border-2 border-blue-500/50 flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <span className="text-blue-300 text-xs font-semibold tracking-wider uppercase">Government Schemes</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                Apply for Government Scheme
              </h1>
              <p className="text-blue-50 text-base">
                Apply for various government welfare schemes through our assistance program.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Application Form */}
      <section className="py-12 bg-cream-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="info" title="Document Requirements" className="mb-6">
            Please have your Aadhaar, PAN, and income documents ready for upload.
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-stone-800">Government Scheme Application</h2>
              <p className="text-stone-500 text-xs mt-1">Fill in all required information accurately</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Personal Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Applicant Name *"
                      placeholder="Full name as per Aadhaar"
                      required
                      value={form.applicantName}
                      onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                    />
                    <div className="space-y-4">
                    <InputField
                      label="Email Address *"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        setIsEmailVerified(false);
                      }}
                      disabled={isEmailVerified}
                    />
                    
                    {form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                      <EmailVerification 
                        email={form.email} 
                        onVerified={setIsEmailVerified} 
                      />
                    )}
                  </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-4">
                      <InputField
                        label="Phone Number *"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          setIsMobileVerified(false);
                        }}
                        disabled={isMobileVerified}
                      />
                      
                      {form.phone && form.phone.length >= 10 && (
                        <MobileVerification 
                          mobile={form.phone} 
                          onVerified={setIsMobileVerified} 
                        />
                      )}
                    </div>
                    <InputField
                      label="Aadhaar Number"
                      placeholder="1234 5678 9012"
                      value={form.aadhaarNumber}
                      onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="Address *"
                      placeholder="Complete address"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                    <InputField
                      label="City *"
                      placeholder="City name"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        State *
                      </label>
                      <select
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select state</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="Pincode *"
                      placeholder="123456"
                      required
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    />
                    <InputField
                      label="Family Size"
                      type="number"
                      placeholder="4"
                      value={form.familySize}
                      onChange={(e) => setForm({ ...form, familySize: e.target.value })}
                    />
                    <InputField
                      label="Monthly Income"
                      type="number"
                      placeholder="25000"
                      value={form.monthlyIncome}
                      onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Scheme Applied For *
                      </label>
                      <select
                        value={form.schemeAppliedFor}
                        onChange={(e) => setForm({ ...form, schemeAppliedFor: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select scheme</option>
                        <option value="PM-KISAN">PM-KISAN</option>
                        <option value="Ayushman Bharat">Ayushman Bharat</option>
                        <option value="Pradhan Mantri Awas Yojana">Pradhan Mantri Awas Yojana</option>
                        <option value="Pradhan Mantri Ujjwala Yojana">Pradhan Mantri Ujjwala Yojana</option>
                        <option value="Pradhan Mantri Jan Dhan Yojana">Pradhan Mantri Jan Dhan Yojana</option>
                        <option value="Sukanya Samriddhi Yojana">Sukanya Samriddhi Yojana</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.agreeToTerms}
                          onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-stone-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-stone-700">I agree to terms and conditions *</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-stone-200 mt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-lg py-4 font-bold shadow-xl border-b-4 border-amber-900"
                  loading={loading}
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !isEmailVerified ||
                    !isMobileVerified ||
                    !form.applicantName ||
                    !form.email ||
                    !form.phone ||
                    !form.schemeAppliedFor ||
                    !form.address ||
                    !form.city ||
                    !form.state ||
                    !form.pincode ||
                    !form.agreeToTerms
                  }
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <RefreshCw className="w-5 h-5 animate-spin" />
                       SUBMITTING...
                    </span>
                  ) : "Submit Application"}
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  Your application will be processed within 5-7 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}