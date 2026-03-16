"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { volunteerConfig } from "@/config/volunteer.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function VolunteerPage() {
  const { config, loading, error } = usePageConfig('volunteer', volunteerConfig);
  
  // Use fallback config if dynamic config is null
  const activeConfig = config || volunteerConfig;

  // Get icons
  const Heart = getIcon('Heart');
  const CheckCircle = getIcon('CheckCircle');
  const Users = getIcon('Users');
  const User = getIcon('User');

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

  // Handle loading and error states after all hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (error) {
    console.error('Failed to load Volunteer page config:', error);
    // Fallback to static config
  }

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

    const handleSubmit = async () => {
        // Validation
        if (!form.name || !form.email || !form.phone || !selectedTypes.length) {
            alert(activeConfig.validationMessages.fillRequiredFields);
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
            alert(`${activeConfig.validationMessages.submitFailed}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <button onClick={() => setSubmitted(false)} className="text-saffron-600 text-sm underline">
            {activeConfig.success.registerAnotherText}
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-12 md:py-16 lg:py-20">
        <Container>
          <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">{activeConfig.hero.badge}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4">
            {activeConfig.hero.title}
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            {activeConfig.hero.description}
          </p>
        </Container>
      </section>

      {/* Why volunteer */}
      <section className="py-12 bg-saffron-50 border-b border-saffron-100">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {activeConfig.whyVolunteer.map((item) => {
              const Icon = getIcon(item.icon);
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
                {activeConfig.labels.selectVolunteerTypes}
              </h2>
              <p className="text-stone-600 text-sm text-center mb-6">
                {activeConfig.labels.selectVolunteerTypesDesc}
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
                <h3 className="font-serif text-2xl font-bold mb-1">{activeConfig.formHeader.title}</h3>
                <p className="text-saffron-100 text-sm">{activeConfig.formHeader.subtitle}</p>
              </div>

              <div className="p-8">
                <div className="space-y-8">

                  {/* Registration Type */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200">
                      {activeConfig.labels.registrationType}
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
                        <p className="font-semibold text-stone-800 text-sm">{activeConfig.registrationTypes.individual.title}</p>
                        <p className="text-stone-500 text-xs mt-1">{activeConfig.registrationTypes.individual.description}</p>
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
                        <p className="font-semibold text-stone-800 text-sm">{activeConfig.registrationTypes.group.title}</p>
                        <p className="text-stone-500 text-xs mt-1">{activeConfig.registrationTypes.group.description}</p>
                      </button>
                    </div>
                  </div>

                  {/* Group Details (only if group selected) */}
                  {form.registrationType === "group" && (
                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                      <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-blue-300 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        {activeConfig.labels.groupName.replace("/Organization Name", " Information")}
                      </h4>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <InputField
                            label={activeConfig.labels.groupName}
                            placeholder={activeConfig.placeholders.groupName}
                            required
                            value={form.groupName}
                            onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                          />
                          <InputField
                            label={activeConfig.labels.groupSize}
                            type="number"
                            placeholder={activeConfig.placeholders.groupSize}
                            required
                            value={form.groupSize}
                            onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">
                            {activeConfig.labels.groupType} <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={form.groupType}
                            onChange={(e) => setForm({ ...form, groupType: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                          >
                            {activeConfig.selectOptions.groupTypes.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="pt-4 border-t border-blue-300">
                          <p className="text-sm font-semibold text-stone-700 mb-3">{activeConfig.labels.groupLeaderDetails}</p>
                          <div className="grid md:grid-cols-3 gap-4">
                            <InputField
                              label={activeConfig.labels.groupLeaderName}
                              placeholder={activeConfig.placeholders.groupLeaderName}
                              required
                              value={form.groupLeaderName}
                              onChange={(e) => setForm({ ...form, groupLeaderName: e.target.value })}
                            />
                            <InputField
                              label={activeConfig.labels.groupLeaderPhone}
                              type="tel"
                              placeholder={activeConfig.placeholders.groupLeaderPhone}
                              required
                              value={form.groupLeaderPhone}
                              onChange={(e) => setForm({ ...form, groupLeaderPhone: e.target.value })}
                            />
                            <InputField
                              label={activeConfig.labels.groupLeaderEmail}
                              type="email"
                              placeholder={activeConfig.placeholders.groupLeaderEmail}
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
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeConfig.sections[0].number}</span>
                      {form.registrationType === "group" ? `${activeConfig.sections[0].title} ${activeConfig.labels.asRepresentative}` : activeConfig.sections[0].title}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField
                        label={activeConfig.labels.fullName}
                        placeholder={activeConfig.placeholders.fullName}
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.emailAddress}
                        type="email"
                        placeholder={activeConfig.placeholders.email}
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.phoneNumber}
                        type="tel"
                        placeholder={activeConfig.placeholders.phone}
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.alternatePhone}
                        type="tel"
                        placeholder={activeConfig.placeholders.alternatePhone}
                        value={form.alternatePhone}
                        onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.dateOfBirth}
                        type="date"
                        required
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {activeConfig.labels.gender} <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.gender}
                          onChange={(e) => setForm({ ...form, gender: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                        >
                          {activeConfig.selectOptions.genders.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeConfig.sections[1].number}</span>
                      {activeConfig.sections[1].title}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {activeConfig.labels.completeAddress} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder={activeConfig.placeholders.completeAddress}
                          rows={2}
                          required
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <InputField
                          label={activeConfig.labels.city}
                          placeholder={activeConfig.placeholders.city}
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                        <div>
                          <label className="block text-sm font-semibold text-stone-700 mb-2">
                            {activeConfig.labels.state} <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                          >
                            <option value="">{activeConfig.selectOptions.stateSelectLabel}</option>
                            {indianStates.map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                        <InputField
                          label={activeConfig.labels.pinCode}
                          placeholder={activeConfig.placeholders.pinCode}
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
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeConfig.sections[2].number}</span>
                      {activeConfig.sections[2].title}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField
                        label={activeConfig.labels.currentOccupation}
                        placeholder={activeConfig.placeholders.occupation}
                        required
                        value={form.occupation}
                        onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.organizationInstitution}
                        placeholder={activeConfig.placeholders.organization}
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {activeConfig.labels.experienceLevel}
                        </label>
                        <select
                          value={form.experience}
                          onChange={(e) => setForm({ ...form, experience: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                        >
                          {experienceLevels.map((level) => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                          ))}
                        </select>
                      </div>
                      <InputField
                        label={activeConfig.labels.specialSkills}
                        placeholder={activeConfig.placeholders.skills}
                        value={form.skills}
                        onChange={(e) => setForm({ ...form, skills: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeConfig.sections[3].number}</span>
                      {activeConfig.sections[3].title}
                    </h4>
                    <p className="text-stone-600 text-sm mb-4">{activeConfig.labels.socialMediaNote}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField
                        label={activeConfig.labels.facebookProfile}
                        placeholder={activeConfig.placeholders.facebook}
                        value={form.facebookProfile}
                        onChange={(e) => setForm({ ...form, facebookProfile: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.instagramHandle}
                        placeholder={activeConfig.placeholders.instagram}
                        value={form.instagramHandle}
                        onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.twitterHandle}
                        placeholder={activeConfig.placeholders.twitter}
                        value={form.twitterHandle}
                        onChange={(e) => setForm({ ...form, twitterHandle: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.linkedinProfile}
                        placeholder={activeConfig.placeholders.linkedin}
                        value={form.linkedinProfile}
                        onChange={(e) => setForm({ ...form, linkedinProfile: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Volunteer Preferences */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeConfig.sections[4].number}</span>
                      {activeConfig.sections[4].title}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {activeConfig.labels.availability} <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.availability}
                          onChange={(e) => setForm({ ...form, availability: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 bg-white"
                        >
                          {availabilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <InputField
                          label={activeConfig.labels.preferredLocation}
                          placeholder={activeConfig.placeholders.preferredLocation}
                          value={form.preferredLocation}
                          onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
                        />
                        <InputField
                          label={activeConfig.labels.languagesKnown}
                          placeholder={activeConfig.placeholders.languagesKnown}
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
                          <span className="text-sm text-stone-700 font-medium">{activeConfig.labels.hasVehicle}</span>
                        </label>
                        {form.hasVehicle && (
                          <InputField
                            label={activeConfig.labels.vehicleType}
                            placeholder={activeConfig.placeholders.vehicleType}
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
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeConfig.sections[5].number}</span>
                      {activeConfig.sections[5].title}
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <InputField
                        label={activeConfig.labels.emergencyContactName}
                        placeholder={activeConfig.placeholders.emergencyName}
                        required
                        value={form.emergencyContactName}
                        onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.emergencyContactPhone}
                        type="tel"
                        placeholder={activeConfig.placeholders.emergencyPhone}
                        required
                        value={form.emergencyContactPhone}
                        onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
                      />
                      <InputField
                        label={activeConfig.labels.emergencyContactRelation}
                        placeholder={activeConfig.placeholders.emergencyRelation}
                        required
                        value={form.emergencyContactRelation}
                        onChange={(e) => setForm({ ...form, emergencyContactRelation: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h4 className="font-bold text-stone-800 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
                      <span className="w-7 h-7 bg-saffron-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeConfig.sections[6].number}</span>
                      {activeConfig.sections[6].title}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {activeConfig.labels.whyVolunteer} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder={activeConfig.placeholders.whyVolunteerPlaceholder}
                          rows={3}
                          required
                          value={form.whyVolunteer}
                          onChange={(e) => setForm({ ...form, whyVolunteer: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {activeConfig.labels.previousVolunteerWork}
                        </label>
                        <textarea
                          placeholder={activeConfig.placeholders.previousWorkPlaceholder}
                          rows={2}
                          value={form.previousVolunteerWork}
                          onChange={(e) => setForm({ ...form, previousVolunteerWork: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          {activeConfig.labels.medicalConditions}
                        </label>
                        <textarea
                          placeholder={activeConfig.placeholders.medicalConditionsPlaceholder}
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
                          {activeConfig.labels.agreeToTerms} <Link href={activeConfig.labels.termsLink} className="text-saffron-600 underline font-bold">{activeConfig.labels.termsAndConditions}</Link> {activeConfig.labels.andText} <Link href={activeConfig.labels.privacyLink} className="text-saffron-600 underline font-bold">{activeConfig.labels.privacyPolicy}</Link> <span className="text-red-500">*</span>
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
                          {activeConfig.labels.agreeToBackgroundCheck} <span className="text-red-500">*</span>
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
                      {activeConfig.labels.submitButton}
                    </Button>
                    
                    <p className="text-stone-500 text-xs text-center mt-4">
                      {activeConfig.labels.reviewNote}
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
