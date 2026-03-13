"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { Users, CheckCircle, Upload, FileText, User, Mail, Briefcase, GraduationCap } from "lucide-react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

export default function BoardApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Personal Details (backend expected fields)
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
    
    // Professional Details (backend expected fields)
    currentPosition: "",
    organization: "",
    industry: "",
    experience: "", // backend expects 'experience' not 'totalExperience'
    qualifications: "", // backend expects 'qualifications' not 'expertise'
    
    // Education
    highestQualification: "",
    institution: "",
    graduationYear: "",
    additionalCertifications: "",
    
    // Board Experience
    previousBoardExperience: false,
    boardDetails: "",
    leadershipRoles: "",
    
    // Moksha Seva Interest (backend expected fields)
    positionInterested: "",
    motivationStatement: "", // backend expects 'motivationStatement' not 'whyJoin'
    contribution: "",
    timeCommitment: "",
    
    // References
    reference1Name: "",
    reference1Position: "",
    reference1Contact: "",
    reference2Name: "",
    reference2Position: "",
    reference2Contact: "",
    
    // Documents
    resume: null as File | null,
    coverLetter: null as File | null,
    
    // Agreements
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  });

  const handleFileUpload = (field: string, file: File | null) => {
    setForm({ ...form, [field]: file });
  };
  const handleSubmit = async () => {
    // Validation
    if (!form.name || !form.email || !form.phone || !form.positionInterested || !form.motivationStatement) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'resume' && key !== 'coverLetter') {
          formData.append(key, value.toString());
        }
      });

      // Add files
      if (form.resume) formData.append('resume', form.resume);
      if (form.coverLetter) formData.append('coverLetter', form.coverLetter);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/board`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setForm({
          name: "", email: "", phone: "", alternatePhone: "", dateOfBirth: "", gender: "",
          address: "", city: "", state: "", pincode: "",
          currentPosition: "", organization: "", industry: "", experience: "", qualifications: "",
          highestQualification: "", institution: "", graduationYear: "", additionalCertifications: "",
          previousBoardExperience: false, boardDetails: "", leadershipRoles: "",
          positionInterested: "", motivationStatement: "", contribution: "", timeCommitment: "",
          reference1Name: "", reference1Position: "", reference1Contact: "",
          reference2Name: "", reference2Position: "", reference2Contact: "",
          resume: null, coverLetter: null,
          agreeToTerms: false, agreeToBackgroundCheck: false,
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Board application error:', error);
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
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">Application Submitted!</h2>
          <p className="text-stone-600 mb-2">
            Thank you for your interest in joining our Board of Advisors.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Application ID: <span className="font-mono font-bold text-saffron-600">BA-2024-{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <p className="text-stone-600 text-sm mb-6">
            Our team will review your application and contact you within 7-10 business days.
          </p>
          <button onClick={() => setSubmitted(false)} className="text-saffron-600 text-sm underline">
            Submit another application
          </button>
        </div>
      </section>
    );
  }
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-16">
        <Container>
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="w-12 h-12 bg-saffron-600/20 rounded-xl flex items-center justify-center border-2 border-saffron-500/50 flex-shrink-0">
              <Users className="w-6 h-6 text-saffron-300" />
            </div>
            <div>
              <span className="text-saffron-300 text-xs font-semibold tracking-wider uppercase">Join Our Leadership</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                Board of Advisors Application
              </h1>
              <p className="text-stone-300 text-base">
                Join our mission to provide dignified last rites. We seek experts in law, medicine, spirituality, and social work.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Application Form */}
      <section className="py-12 bg-cream-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="info" title="Board Member Requirements" className="mb-6">
            We seek committed individuals with expertise in relevant fields who can dedicate 4-6 hours monthly to board activities.
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-stone-800">Board Application Form</h2>
              <p className="text-stone-500 text-xs mt-1">Please provide detailed information about your background and interest</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Personal Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Full Name *"
                      placeholder="As per official documents"
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
                      label="Date of Birth *"
                      type="date"
                      required
                      value={form.dateOfBirth}
                      onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Section 2: Address */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Address Details</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Complete Address *
                    </label>
                    <textarea
                      placeholder="House/Flat No., Building, Street, Locality"
                      rows={2}
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="City *"
                      placeholder="Mumbai"
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
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select state</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="PIN Code *"
                      placeholder="400001"
                      required
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Professional Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    Professional Background
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Current Position *"
                      placeholder="e.g., Senior Partner, Chief Medical Officer"
                      required
                      value={form.currentPosition}
                      onChange={(e) => setForm({ ...form, currentPosition: e.target.value })}
                    />
                    <InputField
                      label="Organization *"
                      placeholder="Company/Institution name"
                      required
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Industry/Sector *"
                      placeholder="e.g., Legal, Healthcare, Social Work"
                      required
                      value={form.industry}
                      onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    />
                    <InputField
                      label="Total Experience (years) *"
                      placeholder="e.g., 15"
                      required
                      type="number"
                      min="0"
                      max="50"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Qualifications & Expertise *
                    </label>
                    <textarea
                      placeholder="Describe your key qualifications, certifications, and areas of expertise (minimum 10 characters)"
                      rows={3}
                      required
                      value={form.qualifications}
                      onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              {/* Section 4: Education */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Educational Background
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Highest Qualification *"
                      placeholder="e.g., MBA, MD, LLB, PhD"
                      required
                      value={form.highestQualification}
                      onChange={(e) => setForm({ ...form, highestQualification: e.target.value })}
                    />
                    <InputField
                      label="Institution *"
                      placeholder="University/College name"
                      required
                      value={form.institution}
                      onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Graduation Year *"
                      placeholder="e.g., 2005"
                      required
                      value={form.graduationYear}
                      onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                    />
                    <InputField
                      label="Additional Certifications"
                      placeholder="Professional certifications, if any"
                      value={form.additionalCertifications}
                      onChange={(e) => setForm({ ...form, additionalCertifications: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Board Experience */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Board & Leadership Experience</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="previousBoardExperience"
                      checked={form.previousBoardExperience}
                      onChange={(e) => setForm({ ...form, previousBoardExperience: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500"
                    />
                    <label htmlFor="previousBoardExperience" className="text-sm text-stone-700">
                      I have previous board/advisory experience
                    </label>
                  </div>
                  {form.previousBoardExperience && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Board Experience Details
                      </label>
                      <textarea
                        placeholder="Describe your previous board positions, organizations, and tenure"
                        rows={3}
                        value={form.boardDetails}
                        onChange={(e) => setForm({ ...form, boardDetails: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Leadership Roles & Achievements
                    </label>
                    <textarea
                      placeholder="Describe your leadership roles and key achievements"
                      rows={3}
                      value={form.leadershipRoles}
                      onChange={(e) => setForm({ ...form, leadershipRoles: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Interest in Moksha Seva */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Interest in Moksha Seva</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Position Interested In *
                    </label>
                    <select
                      value={form.positionInterested}
                      onChange={(e) => setForm({ ...form, positionInterested: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select position</option>
                      <option value="board_member">Board Member</option>
                      <option value="advisory_member">Advisory Member</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="secretary">Secretary</option>
                      <option value="any">Any Position</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Why do you want to join Moksha Seva? *
                    </label>
                    <textarea
                      placeholder="Share your motivation and alignment with our mission (50-2000 characters)"
                      rows={4}
                      required
                      minLength={50}
                      maxLength={2000}
                      value={form.motivationStatement}
                      onChange={(e) => setForm({ ...form, motivationStatement: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      {form.motivationStatement.length}/2000 characters (minimum 50 required)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      How can you contribute to our mission? *
                    </label>
                    <textarea
                      placeholder="Describe specific ways you can contribute to Moksha Seva"
                      rows={4}
                      required
                      value={form.contribution}
                      onChange={(e) => setForm({ ...form, contribution: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Time Commitment *
                    </label>
                    <select
                      value={form.timeCommitment}
                      onChange={(e) => setForm({ ...form, timeCommitment: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select time commitment</option>
                      <option value="5_hours_month">5 hours per month</option>
                      <option value="10_hours_month">10 hours per month</option>
                      <option value="15_hours_month">15 hours per month</option>
                      <option value="20_plus_hours_month">20+ hours per month</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Section 7: References */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">7</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Professional References</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-stone-700 text-sm mb-2">Reference 1 *</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InputField
                        label="Name"
                        placeholder="Full name"
                        required
                        value={form.reference1Name}
                        onChange={(e) => setForm({ ...form, reference1Name: e.target.value })}
                      />
                      <InputField
                        label="Position"
                        placeholder="Designation"
                        required
                        value={form.reference1Position}
                        onChange={(e) => setForm({ ...form, reference1Position: e.target.value })}
                      />
                      <InputField
                        label="Contact"
                        placeholder="Phone/Email"
                        required
                        value={form.reference1Contact}
                        onChange={(e) => setForm({ ...form, reference1Contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-700 text-sm mb-2">Reference 2</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InputField
                        label="Name"
                        placeholder="Full name"
                        value={form.reference2Name}
                        onChange={(e) => setForm({ ...form, reference2Name: e.target.value })}
                      />
                      <InputField
                        label="Position"
                        placeholder="Designation"
                        value={form.reference2Position}
                        onChange={(e) => setForm({ ...form, reference2Position: e.target.value })}
                      />
                      <InputField
                        label="Contact"
                        placeholder="Phone/Email"
                        value={form.reference2Contact}
                        onChange={(e) => setForm({ ...form, reference2Contact: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 8: Document Upload */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">8</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    Document Upload
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Resume/CV *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-stone-500 mt-1">PDF, DOC, DOCX, or image format (max 5MB)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Cover Letter
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('coverLetter', e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    />
                    <p className="text-xs text-stone-500 mt-1">Optional - PDF, DOC, DOCX, or image format (max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Section 9: Agreements */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">9</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Terms & Agreements</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={form.agreeToTerms}
                      onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500 mt-0.5"
                      required
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-stone-700">
                      I agree to the terms and conditions of board membership and understand the responsibilities involved *
                    </label>
                  </div>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeToBackgroundCheck"
                      checked={form.agreeToBackgroundCheck}
                      onChange={(e) => setForm({ ...form, agreeToBackgroundCheck: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500 mt-0.5"
                      required
                    />
                    <label htmlFor="agreeToBackgroundCheck" className="text-sm text-stone-700">
                      I consent to background verification and reference checks as part of the selection process *
                    </label>
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
                  disabled={
                    !form.name ||
                    !form.email ||
                    !form.phone ||
                    !form.positionInterested ||
                    !form.motivationStatement ||
                    !form.contribution ||
                    !form.agreeToTerms ||
                    !form.agreeToBackgroundCheck
                  }
                >
                  Submit Application
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  Your application will be reviewed within 7-10 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}