"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { AlertTriangle, Upload, Phone, CheckCircle, MapPin, User, FileText, Camera, Clock } from "lucide-react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Reporter Details
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    reporterAddress: "",
    reporterRelation: "", // witness, relative, police, hospital, other
    
    // Location Details
    exactLocation: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    locationType: "", // road, hospital, home, public_place, river, railway
    gpsCoordinates: "",
    
    // Time Details
    dateFound: "",
    timeFound: "",
    approximateDeathTime: "",
    
    // Body Details
    gender: "",
    approximateAge: "",
    height: "",
    weight: "",
    complexion: "",
    hairColor: "",
    eyeColor: "",
    
    // Identification Marks
    tattoos: "",
    scars: "",
    birthmarks: "",
    jewelry: "",
    clothing: "",
    personalBelongings: "",
    
    // Physical Condition
    bodyCondition: "", // recent, decomposed, skeletal
    visibleInjuries: "",
    causeOfDeathSuspected: "",
    
    // Authority Details
    policeInformed: false,
    policeStationName: "",
    firNumber: "",
    hospitalName: "",
    postMortemDone: false,
    
    // Additional Information
    identityDocumentsFound: false,
    documentDetails: "",
    suspectedIdentity: "",
    familyContacted: false,
    additionalNotes: "",
    
    // Witness Information
    witnessName: "",
    witnessPhone: "",
    witnessAddress: "",
    
    // Document Uploads (Optional)
    bplCardNumber: "",
    bplCardPhoto: null as File | null,
    aadhaarNumber: "",
    aadhaarPhoto: null as File | null,
    nocDetails: "",
    nocPhoto: null as File | null,
    panNumber: "",
    panPhoto: null as File | null,
    
    // Consent
    agreeToTerms: false,
    consentToShare: false,
  });

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Prepare form data for API - flatten the structure to match backend validation
      const reportData = {
        // Reporter Info (flattened)
        reporterName: form.reporterName,
        reporterPhone: form.reporterPhone,
        reporterEmail: form.reporterEmail || undefined,
        reporterAddress: form.reporterAddress,
        reporterRelation: form.reporterRelation,
        
        // Location Info (flattened)
        exactLocation: form.exactLocation,
        landmark: form.landmark,
        area: form.area,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        locationType: form.locationType,
        gpsCoordinates: form.gpsCoordinates,
        
        // Time Details (flattened)
        dateFound: form.dateFound,
        timeFound: form.timeFound,
        approximateDeathTime: form.approximateDeathTime,
        
        // Body Details (flattened)
        gender: form.gender,
        approximateAge: form.approximateAge,
        height: form.height,
        weight: form.weight,
        complexion: form.complexion,
        hairColor: form.hairColor,
        eyeColor: form.eyeColor,
        tattoos: form.tattoos,
        scars: form.scars,
        birthmarks: form.birthmarks,
        jewelry: form.jewelry,
        clothing: form.clothing,
        personalBelongings: form.personalBelongings,
        bodyCondition: form.bodyCondition,
        visibleInjuries: form.visibleInjuries,
        causeOfDeathSuspected: form.causeOfDeathSuspected,
        suspectedIdentity: form.suspectedIdentity,
        
        // Authority Details (flattened)
        policeInformed: form.policeInformed,
        policeStationName: form.policeStationName,
        firNumber: form.firNumber,
        hospitalName: form.hospitalName,
        postMortemDone: form.postMortemDone,
        
        // Additional Info (flattened)
        identityDocumentsFound: form.identityDocumentsFound,
        documentDetails: form.documentDetails,
        familyContacted: form.familyContacted,
        additionalNotes: form.additionalNotes,
        
        // Witness Info (flattened)
        witnessName: form.witnessName,
        witnessPhone: form.witnessPhone,
        witnessAddress: form.witnessAddress,
        
        // Document Info (flattened)
        bplCardNumber: form.bplCardNumber,
        aadhaarNumber: form.aadhaarNumber,
        nocDetails: form.nocDetails,
        panNumber: form.panNumber,
        
        // System fields
        reportType: 'unclaimed_body',
        priority: 'high', // Changed from urgencyLevel to priority to match model
        // status: 'pending', // Remove this since model has default 'pending'
        description: `${form.additionalNotes}\n\nFamily Contacted: ${form.familyContacted ? 'Yes' : 'No'}`,
        
        // Consent (flattened)
        agreeToTerms: form.agreeToTerms,
        consentToShare: form.consentToShare
      };

      // Submit to backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        console.error('Report submission failed:', errorData);
        throw new Error(errorData.message || 'Failed to submit report');
      }

      const result = await response.json();
      console.log('Report submitted successfully:', result);
      
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert(`Failed to submit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">Report Submitted</h2>
          <p className="text-stone-600 mb-2">
            Your report has been received. Our team will contact you within 24 hours.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Case Reference: <span className="font-mono font-bold text-saffron-600">MS-2024-{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <div className="space-y-3">
            <p className="text-stone-600 text-sm">For urgent assistance, call:</p>
            <a href="tel:+911800123456" className="block">
              <Button variant="primary" size="lg" className="w-full">
                <Phone className="w-4 h-4 mr-2" /> 1800-123-456 (24/7)
              </Button>
            </a>
            <button
              onClick={() => setSubmitted(false)}
              className="text-saffron-600 text-sm underline"
            >
              Submit another report
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white py-16">
        <Container>
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="w-12 h-12 bg-teal-600/20 rounded-xl flex items-center justify-center border-2 border-teal-500/50 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <span className="text-teal-300 text-xs font-semibold tracking-wider uppercase">Emergency Report</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                Report an Unclaimed Body
              </h1>
              <p className="text-teal-50 text-base">
                If you have found an unclaimed or unidentified body, please fill this form immediately. Our team responds within 24 hours.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 bg-cream-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="warning" title="Important Notice" className="mb-6">
            Please also inform your nearest police station. Moksha Seva works in coordination with law enforcement. Do not move or disturb the body.
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-stone-800">Case Report Form</h2>
              <p className="text-stone-500 text-xs mt-1">Please provide as much detail as possible to help us respond quickly</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Reporter Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Reporter Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Your Name"
                      placeholder="Full name"
                      value={form.reporterName}
                      onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
                    />
                    <InputField
                      label="Contact Number *"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={form.reporterPhone}
                      onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      value={form.reporterEmail}
                      onChange={(e) => setForm({ ...form, reporterEmail: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Relation to Case
                      </label>
                      <select
                        value={form.reporterRelation}
                        onChange={(e) => setForm({ ...form, reporterRelation: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      >
                        <option value="">Select relation</option>
                        <option value="witness">Witness</option>
                        <option value="relative">Relative</option>
                        <option value="police">Police Personnel</option>
                        <option value="hospital">Hospital Staff</option>
                        <option value="passerby">Passerby</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <InputField
                    label="Your Address"
                    placeholder="Complete address"
                    value={form.reporterAddress}
                    onChange={(e) => setForm({ ...form, reporterAddress: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 2: Location Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Location Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <InputField
                    label="Exact Location *"
                    placeholder="Street address, building name, etc."
                    required
                    value={form.exactLocation}
                    onChange={(e) => setForm({ ...form, exactLocation: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Landmark"
                      placeholder="Nearby landmark"
                      value={form.landmark}
                      onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    />
                    <InputField
                      label="Area/Locality *"
                      placeholder="Area name"
                      required
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="City *"
                      placeholder="City"
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
                      label="Pincode"
                      placeholder="000000"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Location Type *
                      </label>
                      <select
                        value={form.locationType}
                        onChange={(e) => setForm({ ...form, locationType: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="road">Road/Highway</option>
                        <option value="hospital">Hospital</option>
                        <option value="home">Residential Area</option>
                        <option value="public_place">Public Place</option>
                        <option value="river">River/Water Body</option>
                        <option value="railway">Railway Track/Station</option>
                        <option value="forest">Forest/Rural Area</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <InputField
                      label="GPS Coordinates (if available)"
                      placeholder="Lat, Long"
                      value={form.gpsCoordinates}
                      onChange={(e) => setForm({ ...form, gpsCoordinates: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Time Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Time Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Date Found *"
                      type="date"
                      required
                      value={form.dateFound}
                      onChange={(e) => setForm({ ...form, dateFound: e.target.value })}
                    />
                    <InputField
                      label="Time Found *"
                      type="time"
                      required
                      value={form.timeFound}
                      onChange={(e) => setForm({ ...form, timeFound: e.target.value })}
                    />
                  </div>
                  <InputField
                    label="Approximate Time of Death (if known)"
                    placeholder="e.g., 2-3 hours ago, yesterday evening"
                    value={form.approximateDeathTime}
                    onChange={(e) => setForm({ ...form, approximateDeathTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 4: Body Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Body Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <option value="unknown">Unable to Determine</option>
                      </select>
                    </div>
                    <InputField
                      label="Approximate Age"
                      placeholder="e.g., 30-35 years"
                      value={form.approximateAge}
                      onChange={(e) => setForm({ ...form, approximateAge: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Height (approx.)"
                      placeholder="e.g., 5'6'' or 168 cm"
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                    />
                    <InputField
                      label="Weight (approx.)"
                      placeholder="e.g., 65 kg"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label="Complexion"
                      placeholder="Fair, Wheatish, Dark"
                      value={form.complexion}
                      onChange={(e) => setForm({ ...form, complexion: e.target.value })}
                    />
                    <InputField
                      label="Hair Color"
                      placeholder="Black, Brown, Grey"
                      value={form.hairColor}
                      onChange={(e) => setForm({ ...form, hairColor: e.target.value })}
                    />
                    <InputField
                      label="Eye Color"
                      placeholder="Brown, Black, etc."
                      value={form.eyeColor}
                      onChange={(e) => setForm({ ...form, eyeColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Identification Marks */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" />
                    Identification Marks
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Tattoos"
                      placeholder="Describe any tattoos"
                      value={form.tattoos}
                      onChange={(e) => setForm({ ...form, tattoos: e.target.value })}
                    />
                    <InputField
                      label="Scars"
                      placeholder="Describe any scars"
                      value={form.scars}
                      onChange={(e) => setForm({ ...form, scars: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Birthmarks"
                      placeholder="Describe any birthmarks"
                      value={form.birthmarks}
                      onChange={(e) => setForm({ ...form, birthmarks: e.target.value })}
                    />
                    <InputField
                      label="Jewelry"
                      placeholder="Rings, chains, watches, etc."
                      value={form.jewelry}
                      onChange={(e) => setForm({ ...form, jewelry: e.target.value })}
                    />
                  </div>
                  <InputField
                    label="Clothing Description"
                    placeholder="Describe clothing in detail"
                    value={form.clothing}
                    onChange={(e) => setForm({ ...form, clothing: e.target.value })}
                  />
                  <InputField
                    label="Personal Belongings"
                    placeholder="Wallet, phone, documents, bags, etc."
                    value={form.personalBelongings}
                    onChange={(e) => setForm({ ...form, personalBelongings: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 6: Physical Condition */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Physical Condition</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Body Condition *
                    </label>
                    <select
                      value={form.bodyCondition}
                      onChange={(e) => setForm({ ...form, bodyCondition: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="recent">Recent (less than 24 hours)</option>
                      <option value="decomposed">Decomposed (1-7 days)</option>
                      <option value="advanced">Advanced Decomposition (7+ days)</option>
                      <option value="skeletal">Skeletal Remains</option>
                      <option value="unknown">Unable to Determine</option>
                    </select>
                  </div>
                  <InputField
                    label="Visible Injuries"
                    placeholder="Describe any visible injuries or wounds"
                    value={form.visibleInjuries}
                    onChange={(e) => setForm({ ...form, visibleInjuries: e.target.value })}
                  />
                  <InputField
                    label="Suspected Cause of Death"
                    placeholder="If you have any suspicion (accident, natural, etc.)"
                    value={form.causeOfDeathSuspected}
                    onChange={(e) => setForm({ ...form, causeOfDeathSuspected: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 7: Authority Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">7</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Authority Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="policeInformed"
                      checked={form.policeInformed}
                      onChange={(e) => setForm({ ...form, policeInformed: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500"
                    />
                    <label htmlFor="policeInformed" className="text-sm text-stone-700">
                      Police has been informed
                    </label>
                  </div>
                  {form.policeInformed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                      <InputField
                        label="Police Station Name"
                        placeholder="Station name"
                        value={form.policeStationName}
                        onChange={(e) => setForm({ ...form, policeStationName: e.target.value })}
                      />
                      <InputField
                        label="FIR Number (if filed)"
                        placeholder="FIR number"
                        value={form.firNumber}
                        onChange={(e) => setForm({ ...form, firNumber: e.target.value })}
                      />
                    </div>
                  )}
                  <InputField
                    label="Hospital Name (if body is at hospital)"
                    placeholder="Hospital name"
                    value={form.hospitalName}
                    onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="postMortemDone"
                      checked={form.postMortemDone}
                      onChange={(e) => setForm({ ...form, postMortemDone: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500"
                    />
                    <label htmlFor="postMortemDone" className="text-sm text-stone-700">
                      Post-mortem has been conducted
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 8: Additional Information */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">8</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Additional Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="identityDocumentsFound"
                      checked={form.identityDocumentsFound}
                      onChange={(e) => setForm({ ...form, identityDocumentsFound: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500"
                    />
                    <label htmlFor="identityDocumentsFound" className="text-sm text-stone-700">
                      Identity documents found with body
                    </label>
                  </div>
                  {form.identityDocumentsFound && (
                    <div className="pl-6">
                      <InputField
                        label="Document Details"
                        placeholder="Aadhaar, PAN, Driving License, etc."
                        value={form.documentDetails}
                        onChange={(e) => setForm({ ...form, documentDetails: e.target.value })}
                      />
                    </div>
                  )}
                  <InputField
                    label="Suspected Identity"
                    placeholder="If you suspect who the person might be"
                    value={form.suspectedIdentity}
                    onChange={(e) => setForm({ ...form, suspectedIdentity: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="familyContacted"
                      checked={form.familyContacted}
                      onChange={(e) => setForm({ ...form, familyContacted: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500"
                    />
                    <label htmlFor="familyContacted" className="text-sm text-stone-700">
                      Family members have been contacted
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={form.additionalNotes}
                      onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      placeholder="Any other relevant information..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 9: Witness Information */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">9</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Witness Information (Optional)</h3>
                </div>
                <div className="space-y-3">
                  <InputField
                    label="Witness Name"
                    placeholder="Name of another witness"
                    value={form.witnessName}
                    onChange={(e) => setForm({ ...form, witnessName: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Witness Phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.witnessPhone}
                      onChange={(e) => setForm({ ...form, witnessPhone: e.target.value })}
                    />
                    <InputField
                      label="Witness Address"
                      placeholder="Address"
                      value={form.witnessAddress}
                      onChange={(e) => setForm({ ...form, witnessAddress: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 10: Document Uploads (Optional) */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">10</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Document Details (Optional)
                  </h3>
                </div>
                <p className="text-stone-500 text-xs mb-3">If available, please provide details and upload photos of the following documents</p>
                
                <div className="space-y-4">
                  {/* BPL Card */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">BPL Card (Below Poverty Line)</h4>
                    <div className="space-y-2">
                      <InputField
                        label="BPL Card Number"
                        placeholder="Enter BPL card number"
                        value={form.bplCardNumber}
                        onChange={(e) => setForm({ ...form, bplCardNumber: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Upload BPL Card Photo
                        </label>
                        <div className="border-2 border-dashed border-stone-300 rounded-lg p-3 text-center hover:border-saffron-400 transition-colors cursor-pointer bg-stone-50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, bplCardPhoto: e.target.files?.[0] || null })}
                            className="hidden"
                            id="bplCardPhoto"
                          />
                          <label htmlFor="bplCardPhoto" className="cursor-pointer">
                            <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                            <p className="text-stone-500 text-xs">
                              {form.bplCardPhoto ? form.bplCardPhoto.name : "Click to upload BPL card"}
                            </p>
                            <p className="text-stone-400 text-xs mt-0.5">JPG, PNG up to 5MB</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Aadhaar Card */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">Aadhaar Card</h4>
                    <div className="space-y-2">
                      <InputField
                        label="Aadhaar Number"
                        placeholder="Enter Aadhaar number"
                        value={form.aadhaarNumber}
                        onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Upload Aadhaar Card Photo
                        </label>
                        <div className="border-2 border-dashed border-stone-300 rounded-lg p-3 text-center hover:border-saffron-400 transition-colors cursor-pointer bg-stone-50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, aadhaarPhoto: e.target.files?.[0] || null })}
                            className="hidden"
                            id="aadhaarPhoto"
                          />
                          <label htmlFor="aadhaarPhoto" className="cursor-pointer">
                            <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                            <p className="text-stone-500 text-xs">
                              {form.aadhaarPhoto ? form.aadhaarPhoto.name : "Click to upload Aadhaar card"}
                            </p>
                            <p className="text-stone-400 text-xs mt-0.5">JPG, PNG up to 5MB</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NOC from Family/Government/Pradhan Certificate */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">NOC from Family / Government Certificate / Pradhan Certificate</h4>
                    <div className="space-y-2">
                      <InputField
                        label="Certificate Details"
                        placeholder="Enter certificate type and details"
                        value={form.nocDetails}
                        onChange={(e) => setForm({ ...form, nocDetails: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Upload Certificate Photo
                        </label>
                        <div className="border-2 border-dashed border-stone-300 rounded-lg p-3 text-center hover:border-saffron-400 transition-colors cursor-pointer bg-stone-50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, nocPhoto: e.target.files?.[0] || null })}
                            className="hidden"
                            id="nocPhoto"
                          />
                          <label htmlFor="nocPhoto" className="cursor-pointer">
                            <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                            <p className="text-stone-500 text-xs">
                              {form.nocPhoto ? form.nocPhoto.name : "Click to upload certificate"}
                            </p>
                            <p className="text-stone-400 text-xs mt-0.5">JPG, PNG up to 5MB</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">PAN Card</h4>
                    <div className="space-y-2">
                      <InputField
                        label="PAN Number"
                        placeholder="Enter PAN number"
                        value={form.panNumber}
                        onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Upload PAN Card Photo
                        </label>
                        <div className="border-2 border-dashed border-stone-300 rounded-lg p-3 text-center hover:border-saffron-400 transition-colors cursor-pointer bg-stone-50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, panPhoto: e.target.files?.[0] || null })}
                            className="hidden"
                            id="panPhoto"
                          />
                          <label htmlFor="panPhoto" className="cursor-pointer">
                            <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                            <p className="text-stone-500 text-xs">
                              {form.panPhoto ? form.panPhoto.name : "Click to upload PAN card"}
                            </p>
                            <p className="text-stone-400 text-xs mt-0.5">JPG, PNG up to 5MB</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 11: Photo Upload */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">11</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Upload Photos (Optional)</h3>
                </div>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-5 text-center hover:border-saffron-400 transition-colors cursor-pointer bg-white">
                  <Upload className="w-7 h-7 text-stone-400 mx-auto mb-1.5" />
                  <p className="text-stone-500 text-xs">Click to upload or drag and drop</p>
                  <p className="text-stone-400 text-xs mt-0.5">JPG, PNG up to 10MB (Multiple files allowed)</p>
                </div>
              </div>

              {/* Section 12: Consent */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">12</span>
                  <h3 className="font-semibold text-stone-800 text-sm">Consent & Agreement</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={form.agreeToTerms}
                      onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500 mt-0.5"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-stone-700">
                      I confirm that the information provided is accurate to the best of my knowledge *
                    </label>
                  </div>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="consentToShare"
                      checked={form.consentToShare}
                      onChange={(e) => setForm({ ...form, consentToShare: e.target.checked })}
                      className="w-4 h-4 text-saffron-600 border-stone-300 rounded focus:ring-saffron-500 mt-0.5"
                    />
                    <label htmlFor="consentToShare" className="text-sm text-stone-700">
                      I consent to share this information with authorities and Moksha Seva team *
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
                    !form.reporterPhone ||
                    !form.exactLocation ||
                    !form.area ||
                    !form.city ||
                    !form.state ||
                    !form.locationType ||
                    !form.dateFound ||
                    !form.timeFound ||
                    !form.gender ||
                    !form.bodyCondition ||
                    !form.agreeToTerms ||
                    !form.consentToShare
                  }
                >
                  Submit Emergency Report
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  Your information is confidential and used only for case resolution.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency number */}
          <div className="mt-6 bg-gradient-to-r from-saffron-600 to-saffron-700 text-white rounded-xl p-5 text-center shadow-lg">
            <p className="font-medium text-sm mb-1">For immediate assistance:</p>
            <a href="tel:+911800123456" className="font-serif text-2xl font-bold hover:text-saffron-100 transition-colors inline-block">
              1800-123-456
            </a>
            <p className="text-saffron-100 text-xs mt-1">Toll Free · 24/7 · All India</p>
          </div>
        </div>
      </section>
    </>
  );
}
