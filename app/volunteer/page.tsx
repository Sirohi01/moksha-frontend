"use client";
import { useState } from "react";
import { Container, SectionHeader } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Heart, CheckCircle, Users, Clock, MapPin, Briefcase, GraduationCap, Calendar, FileText, Phone as PhoneIcon, Mail, Home, User, Shield } from "lucide-react";
import Link from "next/link";

const volunteerTypes = [
  { 
    value: "field_volunteer", 
    label: "Field Volunteer", 
    desc: "On-ground support for cremation services",
    icon: Users,
    commitment: "10-15 hours/month"
  },
  { 
    value: "transport_logistics", 
    label: "Transportation & Logistics", 
    desc: "Vehicle support and body transportation",
    icon: MapPin,
    commitment: "Flexible, on-call"
  },
  { 
    value: "documentation", 
    label: "Documentation Support", 
    desc: "Help with paperwork and legal formalities",
    icon: FileText,
    commitment: "5-10 hours/month"
  },
  { 
    value: "counseling", 
    label: "Grief Counseling", 
    desc: "Emotional support for families",
    icon: Heart,
    commitment: "8-12 hours/month"
  },
  { 
    value: "medical_support", 
    label: "Medical Support", 
    desc: "Healthcare professionals for medical assistance",
    icon: Shield,
    commitment: "On-call basis"
  },
  { 
    value: "fundraising", 
    label: "Fundraising & Donor Relations", 
    desc: "Help raise funds and manage donors",
    icon: Briefcase,
    commitment: "Flexible"
  },
  { 
    value: "awareness", 
    label: "Social Media & Awareness", 
    desc: "Content creation and online campaigns",
    icon: Users,
    commitment: "5-8 hours/month"
  },
  { 
    value: "tech_support", 
    label: "Tech & IT Support", 
    desc: "Website, app, and technical assistance",
    icon: GraduationCap,
    commitment: "Flexible, remote"
  },
  { 
    value: "event_coordinator", 
    label: "Event Coordinator", 
    desc: "Organize awareness events and campaigns",
    icon: Calendar,
    commitment: "Project-based"
  },
  { 
    value: "training", 
    label: "Training & Mentorship", 
    desc: "Train new volunteers and provide guidance",
    icon: GraduationCap,
    commitment: "8-10 hours/month"
  },
];

const availabilityOptions = [
  { value: "weekdays_morning", label: "Weekdays Morning (9 AM - 1 PM)" },
  { value: "weekdays_evening", label: "Weekdays Evening (5 PM - 9 PM)" },
  { value: "weekends", label: "Weekends (Sat-Sun)" },
  { value: "full_time", label: "Full Time (Mon-Fri)" },
  { value: "on_call", label: "On Call (Emergency basis)" },
  { value: "flexible", label: "Flexible (As per availability)" },
];

const experienceLevels = [
  { value: "no_experience", label: "No Prior Experience" },
  { value: "some_experience", label: "Some Experience (1-2 years)" },
  { value: "experienced", label: "Experienced (3-5 years)" },
  { value: "expert", label: "Expert (5+ years)" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

    const handleSubmit = async () => {
        // Validation
        if (!form.name || !form.email || !form.phone || !selectedTypes.length) {
            alert('Please fill in all required fields and select at least one volunteer type');
            return;
        }

        setLoading(true);
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

            // Remove empty optional fields to avoid validation issues
            const cleanedData: any = {};
            Object.keys(volunteerData).forEach(key => {
                const value = volunteerData[key as keyof typeof volunteerData];
                if (value !== '' && value !== null && value !== undefined) {
                    cleanedData[key] = value;
                }
            });
            volunteerData = cleanedData;

            console.log('Submitting volunteer data:', volunteerData);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/volunteers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(volunteerData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Volunteer application submitted successfully:', result);
                setSubmitted(true);
                // Reset form
                setForm({
                    registrationType: "individual",
                    name: "", email: "", phone: "", alternatePhone: "", dateOfBirth: "", gender: "",
                    address: "", city: "", state: "", pincode: "",
                    occupation: "", organization: "", experience: "", skills: "",
                    facebookProfile: "", instagramHandle: "", twitterHandle: "", linkedinProfile: "",
                    availability: "", preferredLocation: "", hasVehicle: false, vehicleType: "", languagesKnown: "",
                    groupName: "", groupSize: "", groupType: "", groupLeaderName: "", groupLeaderPhone: "", groupLeaderEmail: "",
                    emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelation: "",
                    whyVolunteer: "", previousVolunteerWork: "", medicalConditions: "",
                    agreeToTerms: false, agreeToBackgroundCheck: false,
                });
                setSelectedTypes([]);
            } else {
                const error = await response.json().catch(() => ({ message: 'Network error' }));
                throw new Error(error.message || 'Failed to submit volunteer application');
            }
        } catch (error) {
            console.error('Volunteer form error:', error);
            alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            Welcome to the Moksha Seva Family!
          </h2>
          <p className="text-stone-600 mb-6">
            Thank you for registering as a volunteer. Our coordination team will reach out to you
            within 2–3 business days.
          </p>
          <button onClick={() => setSubmitted(false)} className="text-saffron-600 text-sm underline">
            Register another volunteer
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-12 md:py-16 lg:py-20">
        <Container>
          <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">✦ Join Us ✦</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4">
            Become a Volunteer
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Join 412 volunteers across 38 cities. No special qualifications needed — only
            compassion and a few hours a month.
          </p>
        </Container>
      </section>

      {/* Why volunteer */}
      <section className="py-12 bg-saffron-50 border-b border-saffron-100">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Heart, title: "Make a Difference", desc: "Directly help ensure dignified last rites for those who have none." },
              { icon: Users, title: "Join a Community", desc: "Be part of a compassionate, purpose-driven volunteer network." },
              { icon: Clock, title: "Flexible Commitment", desc: "Even a few hours a month creates real impact." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <Icon className="w-8 h-8 text-saffron-600 mx-auto mb-3" />
                  <h3 className="font-serif font-semibold text-stone-800 mb-1">{item.title}</h3>
                  <p className="text-stone-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 bg-cream-50">
        <Container size="xl">
          <div className="max-w-6xl mx-auto">
            
            {/* Volunteer Types Selection */}
            <div className="bg-white rounded-xl border border-cream-200 shadow-md p-6 mb-6">
              <h2 className="font-serif text-2xl font-bold text-stone-800 mb-2 text-center">
                Select Volunteer Type(s)
              </h2>
              <p className="text-stone-600 text-sm text-center mb-6">
                Choose one or more areas where you&apos;d like to contribute
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {volunteerTypes.map((type) => {
                  const Icon = type.icon;
                  const selected = selectedTypes.includes(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => toggleType(type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selected
                          ? "border-saffron-600 bg-saffron-50 shadow-md"
                          : "border-stone-200 bg-white hover:border-saffron-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selected ? "bg-saffron-600" : "bg-stone-100"
                        }`}>
                          <Icon className={`w-5 h-5 ${selected ? "text-white" : "text-stone-600"}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-stone-800 text-sm mb-1">{type.label}</h3>
                          <p className="text-stone-600 text-xs mb-2">{type.desc}</p>
                          <p className="text-saffron-600 text-xs font-medium">{type.commitment}</p>
                        </div>
                        {selected && (
                          <CheckCircle className="w-5 h-5 text-saffron-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-xl border border-cream-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-saffron-600 to-orange-600 text-white p-6 text-center">
                <h3 className="font-serif text-2xl font-bold mb-1">Volunteer Registration Form</h3>
                <p className="text-saffron-100 text-sm">Complete all sections • Fields marked with * are required</p>
              </div>

              <div className="p-8">
                <div className="space-y-8">

                  {/* Registration Type */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200">
                      Registration Type
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, registrationType: "individual" })}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          form.registrationType === "individual"
                            ? "border-saffron-600 bg-saffron-50 shadow-md"
                            : "border-stone-200 bg-white hover:border-saffron-400"
                        }`}
                      >
                        <User className={`w-8 h-8 mx-auto mb-2 ${form.registrationType === "individual" ? "text-saffron-600" : "text-stone-400"}`} />
                        <p className="font-semibold text-stone-800 text-sm">Individual Volunteer</p>
                        <p className="text-stone-500 text-xs mt-1">Register as a single volunteer</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, registrationType: "group" })}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          form.registrationType === "group"
                            ? "border-saffron-600 bg-saffron-50 shadow-md"
                            : "border-stone-200 bg-white hover:border-saffron-400"
                        }`}
                      >
                        <Users className={`w-8 h-8 mx-auto mb-2 ${form.registrationType === "group" ? "text-saffron-600" : "text-stone-400"}`} />
                        <p className="font-semibold text-stone-800 text-sm">Group Volunteer</p>
                        <p className="text-stone-500 text-xs mt-1">Register as a group/organization</p>
                      </button>
                    </div>
                  </div>

                  {/* Group Details (only if group selected) */}
                  {form.registrationType === "group" && (
                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                      <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-blue-300 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        Group Information
                      </h4>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <InputField
                            label="Group/Organization Name"
                            placeholder="e.g., ABC College, XYZ Company"
                            required
                            value={form.groupName}
                            onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                          />
                          <InputField
                            label="Number of Members"
                            type="number"
                            placeholder="e.g., 10"
                            required
                            value={form.groupSize}
                            onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">
                            Group Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={form.groupType}
                            onChange={(e) => setForm({ ...form, groupType: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                          >
                            <option value="">Select Group Type</option>
                            <option value="corporate">Corporate/Company</option>
                            <option value="college">College/University</option>
                            <option value="school">School</option>
                            <option value="ngo">NGO/Non-Profit</option>
                            <option value="community">Community Group</option>
                            <option value="religious">Religious Organization</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="pt-4 border-t border-blue-300">
                          <p className="text-sm font-semibold text-stone-700 mb-3">Group Leader/Coordinator Details</p>
                          <div className="grid md:grid-cols-3 gap-4">
                            <InputField
                              label="Leader Name"
                              placeholder="Full name"
                              required
                              value={form.groupLeaderName}
                              onChange={(e) => setForm({ ...form, groupLeaderName: e.target.value })}
                            />
                            <InputField
                              label="Leader Phone"
                              type="tel"
                              placeholder="+91 98765 43210"
                              required
                              value={form.groupLeaderPhone}
                              onChange={(e) => setForm({ ...form, groupLeaderPhone: e.target.value })}
                            />
                            <InputField
                              label="Leader Email"
                              type="email"
                              placeholder="leader@email.com"
                              required
                              value={form.groupLeaderEmail}
                              onChange={(e) => setForm({ ...form, groupLeaderEmail: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Details */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      {form.registrationType === "group" ? "Your Personal Information (as representative)" : "Personal Information"}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField
                        label="Full Name"
                        placeholder="As per government ID"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      <InputField
                        label="Email Address"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      <InputField
                        label="Phone Number"
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
                      <InputField
                        label="Date of Birth"
                        type="date"
                        required
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.gender}
                          onChange={(e) => setForm({ ...form, gender: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      Address Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Complete Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="House/Flat No., Building, Street, Locality"
                          rows={2}
                          required
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <InputField
                          label="City"
                          placeholder="Mumbai"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                          >
                            <option value="">Select State</option>
                            {indianStates.map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                        <InputField
                          label="PIN Code"
                          placeholder="400001"
                          required
                          maxLength={6}
                          value={form.pincode}
                          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      Professional Background
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField
                        label="Current Occupation"
                        placeholder="e.g., Teacher, Engineer, Student"
                        required
                        value={form.occupation}
                        onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                      />
                      <InputField
                        label="Organization/Institution"
                        placeholder="Company or school name"
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Experience Level
                        </label>
                        <select
                          value={form.experience}
                          onChange={(e) => setForm({ ...form, experience: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                        >
                          <option value="">Select Experience</option>
                          {experienceLevels.map((level) => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                      <InputField
                        label="Special Skills"
                        placeholder="e.g., First Aid, Counseling, Driving"
                        value={form.skills}
                        onChange={(e) => setForm({ ...form, skills: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      Social Media Profiles (Optional)
                    </h4>
                    <p className="text-stone-600 text-sm mb-4">Help us connect with you and share volunteer opportunities</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField
                        label="Facebook Profile"
                        placeholder="https://facebook.com/yourprofile"
                        value={form.facebookProfile}
                        onChange={(e) => setForm({ ...form, facebookProfile: e.target.value })}
                      />
                      <InputField
                        label="Instagram Handle"
                        placeholder="@yourusername"
                        value={form.instagramHandle}
                        onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                      />
                      <InputField
                        label="Twitter/X Handle"
                        placeholder="@yourusername"
                        value={form.twitterHandle}
                        onChange={(e) => setForm({ ...form, twitterHandle: e.target.value })}
                      />
                      <InputField
                        label="LinkedIn Profile"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={form.linkedinProfile}
                        onChange={(e) => setForm({ ...form, linkedinProfile: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Volunteer Preferences */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                      Volunteer Preferences
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Availability <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.availability}
                          onChange={(e) => setForm({ ...form, availability: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                        >
                          <option value="">Select Availability</option>
                          {availabilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <InputField
                          label="Preferred Location"
                          placeholder="Area or locality"
                          value={form.preferredLocation}
                          onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
                        />
                        <InputField
                          label="Languages Known"
                          placeholder="e.g., Hindi, English, Marathi"
                          value={form.languagesKnown}
                          onChange={(e) => setForm({ ...form, languagesKnown: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.hasVehicle}
                            onChange={(e) => setForm({ ...form, hasVehicle: e.target.checked })}
                            className="w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                          />
                          <span className="text-sm text-stone-700 font-medium">I have my own vehicle</span>
                        </label>
                        {form.hasVehicle && (
                          <InputField
                            label="Vehicle Type"
                            placeholder="e.g., Car, Bike, Van"
                            value={form.vehicleType}
                            onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                      Emergency Contact
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <InputField
                        label="Contact Name"
                        placeholder="Full name"
                        required
                        value={form.emergencyContactName}
                        onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
                      />
                      <InputField
                        label="Contact Phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        value={form.emergencyContactPhone}
                        onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
                      />
                      <InputField
                        label="Relationship"
                        placeholder="e.g., Father, Spouse"
                        required
                        value={form.emergencyContactRelation}
                        onChange={(e) => setForm({ ...form, emergencyContactRelation: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
                      Additional Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Why do you want to volunteer with us? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Share your motivation..."
                          rows={3}
                          required
                          value={form.whyVolunteer}
                          onChange={(e) => setForm({ ...form, whyVolunteer: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Previous Volunteer Experience (if any)
                        </label>
                        <textarea
                          placeholder="Describe your previous volunteer work..."
                          rows={2}
                          value={form.previousVolunteerWork}
                          onChange={(e) => setForm({ ...form, previousVolunteerWork: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Any Medical Conditions we should know about?
                        </label>
                        <textarea
                          placeholder="Optional - helps us ensure your safety"
                          rows={2}
                          value={form.medicalConditions}
                          onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms & Agreements */}
                  <div className="space-y-4 pt-4 border-t-2 border-stone-200">
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.agreeToTerms}
                          onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                          className="mt-1 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                          required
                        />
                        <span className="text-sm text-stone-700 font-medium">
                          I agree to the <Link href="/legal/terms" className="text-saffron-600 underline font-bold">Terms & Conditions</Link> and <Link href="/privacy" className="text-saffron-600 underline font-bold">Privacy Policy</Link> <span className="text-red-500">*</span>
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.agreeToBackgroundCheck}
                          onChange={(e) => setForm({ ...form, agreeToBackgroundCheck: e.target.checked })}
                          className="mt-1 w-5 h-5 text-saffron-600 border-2 border-stone-300 rounded focus:ring-saffron-500"
                          required
                        />
                        <span className="text-sm text-stone-700 font-medium">
                          I consent to a background verification check for volunteer safety <span className="text-red-500">*</span>
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
                      onClick={handleSubmit}
                      disabled={
                        selectedTypes.length === 0 ||
                        !form.name ||
                        !form.email ||
                        !form.phone ||
                        !form.dateOfBirth ||
                        !form.gender ||
                        !form.address ||
                        !form.city ||
                        !form.state ||
                        !form.pincode ||
                        !form.occupation ||
                        !form.availability ||
                        !form.emergencyContactName ||
                        !form.emergencyContactPhone ||
                        !form.emergencyContactRelation ||
                        !form.whyVolunteer ||
                        !form.agreeToTerms ||
                        !form.agreeToBackgroundCheck ||
                        (form.registrationType === "group" && (!form.groupName || !form.groupSize || !form.groupType || !form.groupLeaderName || !form.groupLeaderPhone || !form.groupLeaderEmail))
                      }
                    >
                      <Heart className="w-5 h-5 mr-2 fill-white" />
                      Register as Volunteer
                    </Button>
                    
                    <p className="text-stone-500 text-xs text-center mt-4">
                      Our team will review your application and contact you within 3-5 business days
                    </p>
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
