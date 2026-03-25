"use client";
import { useState } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import { Alert } from "@/components/ui/Elements";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";
import { reportConfig } from "@/config/report.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function ReportPage() {
  // Use dynamic config with fallback to static config
  const { config: dynamicConfig, loading: configLoading } = usePageConfig('report', reportConfig);
  
  // Use dynamic config if available, otherwise fallback to static
  const config = dynamicConfig || reportConfig;
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
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const handleSubmit = async () => {
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
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all text fields
      formData.append('reporterName', form.reporterName);
      formData.append('reporterPhone', form.reporterPhone);
      if (form.reporterEmail) formData.append('reporterEmail', form.reporterEmail);
      if (form.reporterAddress) formData.append('reporterAddress', form.reporterAddress);
      if (form.reporterRelation) formData.append('reporterRelation', form.reporterRelation);
      
      // Location Info
      formData.append('exactLocation', form.exactLocation);
      if (form.landmark) formData.append('landmark', form.landmark);
      formData.append('area', form.area);
      formData.append('city', form.city);
      formData.append('state', form.state);
      if (form.pincode) formData.append('pincode', form.pincode);
      formData.append('locationType', form.locationType);
      if (form.gpsCoordinates) formData.append('gpsCoordinates', form.gpsCoordinates);
      
      // Time Details
      formData.append('dateFound', form.dateFound);
      formData.append('timeFound', form.timeFound);
      if (form.approximateDeathTime) formData.append('approximateDeathTime', form.approximateDeathTime);
      
      // Body Details
      formData.append('gender', form.gender);
      if (form.approximateAge) formData.append('approximateAge', form.approximateAge);
      if (form.height) formData.append('height', form.height);
      if (form.weight) formData.append('weight', form.weight);
      if (form.complexion) formData.append('complexion', form.complexion);
      if (form.hairColor) formData.append('hairColor', form.hairColor);
      if (form.eyeColor) formData.append('eyeColor', form.eyeColor);
      if (form.tattoos) formData.append('tattoos', form.tattoos);
      if (form.scars) formData.append('scars', form.scars);
      if (form.birthmarks) formData.append('birthmarks', form.birthmarks);
      if (form.jewelry) formData.append('jewelry', form.jewelry);
      if (form.clothing) formData.append('clothing', form.clothing);
      if (form.personalBelongings) formData.append('personalBelongings', form.personalBelongings);
      formData.append('bodyCondition', form.bodyCondition);
      if (form.visibleInjuries) formData.append('visibleInjuries', form.visibleInjuries);
      if (form.causeOfDeathSuspected) formData.append('causeOfDeathSuspected', form.causeOfDeathSuspected);
      if (form.suspectedIdentity) formData.append('suspectedIdentity', form.suspectedIdentity);
      
      // Authority Details
      formData.append('policeInformed', form.policeInformed.toString());
      if (form.policeStationName) formData.append('policeStationName', form.policeStationName);
      if (form.firNumber) formData.append('firNumber', form.firNumber);
      if (form.hospitalName) formData.append('hospitalName', form.hospitalName);
      formData.append('postMortemDone', form.postMortemDone.toString());
      
      // Additional Info
      formData.append('identityDocumentsFound', form.identityDocumentsFound.toString());
      if (form.documentDetails) formData.append('documentDetails', form.documentDetails);
      formData.append('familyContacted', form.familyContacted.toString());
      if (form.additionalNotes) formData.append('additionalNotes', form.additionalNotes);
      
      // Witness Info
      if (form.witnessName) formData.append('witnessName', form.witnessName);
      if (form.witnessPhone) formData.append('witnessPhone', form.witnessPhone);
      if (form.witnessAddress) formData.append('witnessAddress', form.witnessAddress);
      
      // Document Info (text only, no files for now)
      if (form.bplCardNumber) formData.append('bplCardNumber', form.bplCardNumber);
      if (form.aadhaarNumber) formData.append('aadhaarNumber', form.aadhaarNumber);
      if (form.nocDetails) formData.append('nocDetails', form.nocDetails);
      if (form.panNumber) formData.append('panNumber', form.panNumber);
      
      // File uploads commented out for now
      // if (form.bplCardPhoto) formData.append('bplCardPhoto', form.bplCardPhoto);
      // if (form.aadhaarPhoto) formData.append('aadhaarPhoto', form.aadhaarPhoto);
      // if (form.nocPhoto) formData.append('nocPhoto', form.nocPhoto);
      // if (form.panPhoto) formData.append('panPhoto', form.panPhoto);
      
      // System fields
      formData.append('reportType', 'unclaimed_body');
      formData.append('priority', 'high');
      formData.append('description', `${form.additionalNotes}\n\nFamily Contacted: ${form.familyContacted ? 'Yes' : 'No'}`);
      
      // Consent
      formData.append('agreeToTerms', form.agreeToTerms.toString());
      formData.append('consentToShare', form.consentToShare.toString());

      // Submit to backend API with FormData (no Content-Type header needed)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/reports`, {
        method: 'POST',
        body: formData, // Use FormData instead of JSON
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
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">{config.success.title}</h2>
          <p className="text-stone-600 mb-2">
            {config.success.description}
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Case Reference: <span className="font-mono font-bold text-saffron-600">{config.success.referencePrefix}{Math.floor(Math.random() * 900) + 100}</span>
          </p>
          <div className="space-y-3">
            <p className="text-stone-600 text-sm">{config.success.urgentAssistanceText}</p>
            <a href={`tel:${config.success.phoneNumber}`} className="block">
              <Button variant="primary" size="lg" className="w-full">
                {(() => {
                  const PhoneIcon = getIcon('Phone');
                  return <PhoneIcon className="w-4 h-4 mr-2" />;
                })()} {config.success.phoneLabel}
              </Button>
            </a>
            <button
              onClick={() => setSubmitted(false)}
              className="text-saffron-600 text-sm underline"
            >
              {config.success.submitAnotherText}
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
              <span className="text-teal-300 text-xs font-semibold tracking-wider uppercase">{config.hero.badge}</span>
              <h1 className="font-serif text-3xl font-bold mt-1 mb-2">
                {config.hero.title}
              </h1>
              <p className="text-teal-50 text-base">
                {config.hero.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 bg-cream-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <Alert variant="warning" title={config.importantNotice.title} className="mb-6">
            {config.importantNotice.message}
          </Alert>

          <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-6 md:p-8">
            <div className="pb-4 border-b border-stone-200 mb-5">
              <h2 className="font-serif text-lg font-bold text-stone-800">{config.formHeader.title}</h2>
              <p className="text-stone-500 text-xs mt-1">{config.formHeader.subtitle}</p>
            </div>

            <div className="space-y-4">
              {/* Section 1: Reporter Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    {(() => {
                      const UserIcon = getIcon('User');
                      return <UserIcon className="w-3.5 h-3.5" />;
                    })()}
                    {config.sections[0].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={config.labels.reporterName}
                      placeholder={config.placeholders.reporterName}
                      value={form.reporterName}
                      onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
                    />
                    <div className="space-y-4">
                      <InputField
                        label={config.labels.reporterPhone}
                        type="tel"
                        placeholder={config.placeholders.reporterPhone}
                        required
                        value={form.reporterPhone}
                        onChange={(e) => {
                          setForm({ ...form, reporterPhone: e.target.value });
                          setIsMobileVerified(false);
                        }}
                        disabled={isMobileVerified}
                      />
                      
                      {form.reporterPhone && form.reporterPhone.length >= 10 && (
                        <MobileVerification 
                          mobile={form.reporterPhone} 
                          onVerified={setIsMobileVerified} 
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-4">
                    <InputField
                      label={config.labels.reporterEmail}
                      placeholder={config.placeholders.reporterEmail}
                      type="email"
                      required
                      value={form.reporterEmail}
                      onChange={(e) => {
                        setForm({ ...form, reporterEmail: e.target.value });
                        setIsEmailVerified(false);
                      }}
                      disabled={isEmailVerified}
                    />
                    
                    {form.reporterEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reporterEmail) && (
                      <EmailVerification 
                        email={form.reporterEmail} 
                        onVerified={setIsEmailVerified} 
                      />
                    )}
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {config.labels.reporterRelation}
                      </label>
                      <select
                        value={form.reporterRelation}
                        onChange={(e) => setForm({ ...form, reporterRelation: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      >
                        {config.selectOptions.reporterRelation.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <InputField
                    label={config.labels.reporterAddress}
                    placeholder={config.placeholders.reporterAddress}
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
                    {(() => {
                      const MapPinIcon = getIcon('MapPin');
                      return <MapPinIcon className="w-3.5 h-3.5" />;
                    })()}
                    {config.sections[1].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <InputField
                    label={config.labels.exactLocation}
                    placeholder={config.placeholders.exactLocation}
                    required
                    value={form.exactLocation}
                    onChange={(e) => setForm({ ...form, exactLocation: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={config.labels.landmark}
                      placeholder={config.placeholders.landmark}
                      value={form.landmark}
                      onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    />
                    <InputField
                      label={config.labels.area}
                      placeholder={config.placeholders.area}
                      required
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label={config.labels.city}
                      placeholder={config.placeholders.city}
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {config.labels.state}
                      </label>
                      <select
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        <option value="">{config.selectPlaceholders.state}</option>
                        {config.selectOptions.states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label={config.labels.pincode}
                      placeholder={config.placeholders.pincode}
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {config.labels.locationType}
                      </label>
                      <select
                        value={form.locationType}
                        onChange={(e) => setForm({ ...form, locationType: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        {config.selectOptions.locationType.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label={config.labels.gpsCoordinates}
                      placeholder={config.placeholders.gpsCoordinates}
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
                    {(() => {
                      const ClockIcon = getIcon('Clock');
                      return <ClockIcon className="w-3.5 h-3.5" />;
                    })()}
                    {config.sections[2].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={config.labels.dateFound}
                      type="date"
                      required
                      value={form.dateFound}
                      onChange={(e) => setForm({ ...form, dateFound: e.target.value })}
                    />
                    <InputField
                      label={config.labels.timeFound}
                      type="time"
                      required
                      value={form.timeFound}
                      onChange={(e) => setForm({ ...form, timeFound: e.target.value })}
                    />
                  </div>
                  <InputField
                    label={config.labels.approximateDeathTime}
                    placeholder={config.placeholders.approximateDeathTime}
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
                    {(() => {
                      const FileTextIcon = getIcon('FileText');
                      return <FileTextIcon className="w-3.5 h-3.5" />;
                    })()}
                    {config.sections[3].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {config.labels.gender}
                      </label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                        required
                      >
                        {config.selectOptions.gender.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label={config.labels.approximateAge}
                      placeholder={config.placeholders.approximateAge}
                      value={form.approximateAge}
                      onChange={(e) => setForm({ ...form, approximateAge: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={config.labels.height}
                      placeholder={config.placeholders.height}
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                    />
                    <InputField
                      label={config.labels.weight}
                      placeholder={config.placeholders.weight}
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InputField
                      label={config.labels.complexion}
                      placeholder={config.placeholders.complexion}
                      value={form.complexion}
                      onChange={(e) => setForm({ ...form, complexion: e.target.value })}
                    />
                    <InputField
                      label={config.labels.hairColor}
                      placeholder={config.placeholders.hairColor}
                      value={form.hairColor}
                      onChange={(e) => setForm({ ...form, hairColor: e.target.value })}
                    />
                    <InputField
                      label={config.labels.eyeColor}
                      placeholder={config.placeholders.eyeColor}
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
                    {(() => {
                      const CameraIcon = getIcon('Camera');
                      return <CameraIcon className="w-3.5 h-3.5" />;
                    })()}
                    {config.sections[4].title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={config.labels.tattoos}
                      placeholder={config.placeholders.tattoos}
                      value={form.tattoos}
                      onChange={(e) => setForm({ ...form, tattoos: e.target.value })}
                    />
                    <InputField
                      label={config.labels.scars}
                      placeholder={config.placeholders.scars}
                      value={form.scars}
                      onChange={(e) => setForm({ ...form, scars: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={config.labels.birthmarks}
                      placeholder={config.placeholders.birthmarks}
                      value={form.birthmarks}
                      onChange={(e) => setForm({ ...form, birthmarks: e.target.value })}
                    />
                    <InputField
                      label={config.labels.jewelry}
                      placeholder={config.placeholders.jewelry}
                      value={form.jewelry}
                      onChange={(e) => setForm({ ...form, jewelry: e.target.value })}
                    />
                  </div>
                  <InputField
                    label={config.labels.clothing}
                    placeholder={config.placeholders.clothing}
                    value={form.clothing}
                    onChange={(e) => setForm({ ...form, clothing: e.target.value })}
                  />
                  <InputField
                    label={config.labels.personalBelongings}
                    placeholder={config.placeholders.personalBelongings}
                    value={form.personalBelongings}
                    onChange={(e) => setForm({ ...form, personalBelongings: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 6: Physical Condition */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                  <h3 className="font-semibold text-stone-800 text-sm">{config.sectionTitles.physicalCondition}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      {config.labels.bodyCondition}
                    </label>
                    <select
                      value={form.bodyCondition}
                      onChange={(e) => setForm({ ...form, bodyCondition: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      required
                    >
                      {config.selectOptions.bodyCondition.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <InputField
                    label={config.labels.visibleInjuries}
                    placeholder={config.placeholders.visibleInjuries}
                    value={form.visibleInjuries}
                    onChange={(e) => setForm({ ...form, visibleInjuries: e.target.value })}
                  />
                  <InputField
                    label={config.labels.causeOfDeathSuspected}
                    placeholder={config.placeholders.causeOfDeathSuspected}
                    value={form.causeOfDeathSuspected}
                    onChange={(e) => setForm({ ...form, causeOfDeathSuspected: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 7: Authority Details */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">7</span>
                  <h3 className="font-semibold text-stone-800 text-sm">{config.sectionTitles.authorityDetails}</h3>
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
                      {config.labels.policeInformed}
                    </label>
                  </div>
                  {form.policeInformed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                      <InputField
                        label={config.labels.policeStationName}
                        placeholder={config.placeholders.policeStationName}
                        value={form.policeStationName}
                        onChange={(e) => setForm({ ...form, policeStationName: e.target.value })}
                      />
                      <InputField
                        label={config.labels.firNumber}
                        placeholder={config.placeholders.firNumber}
                        value={form.firNumber}
                        onChange={(e) => setForm({ ...form, firNumber: e.target.value })}
                      />
                    </div>
                  )}
                  <InputField
                    label={config.labels.hospitalName}
                    placeholder={config.placeholders.hospitalName}
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
                      {config.labels.postMortemDone}
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 8: Additional Information */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">8</span>
                  <h3 className="font-semibold text-stone-800 text-sm">{config.sectionTitles.additionalInformation}</h3>
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
                      {config.labels.identityDocumentsFound}
                    </label>
                  </div>
                  {form.identityDocumentsFound && (
                    <div className="pl-6">
                      <InputField
                        label={config.labels.documentDetails}
                        placeholder={config.placeholders.documentDetails}
                        value={form.documentDetails}
                        onChange={(e) => setForm({ ...form, documentDetails: e.target.value })}
                      />
                    </div>
                  )}
                  <InputField
                    label={config.labels.suspectedIdentity}
                    placeholder={config.placeholders.suspectedIdentity}
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
                      {config.labels.familyContacted}
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      {config.labels.additionalNotes}
                    </label>
                    <textarea
                      value={form.additionalNotes}
                      onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                      placeholder={config.placeholders.additionalNotes}
                    />
                  </div>
                </div>
              </div>

              {/* Section 9: Witness Information */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">9</span>
                  <h3 className="font-semibold text-stone-800 text-sm">{config.sectionTitles.witnessInformation}</h3>
                </div>
                <div className="space-y-3">
                  <InputField
                    label={config.labels.witnessName}
                    placeholder={config.placeholders.witnessName}
                    value={form.witnessName}
                    onChange={(e) => setForm({ ...form, witnessName: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label={config.labels.witnessPhone}
                      type="tel"
                      placeholder={config.placeholders.witnessPhone}
                      value={form.witnessPhone}
                      onChange={(e) => setForm({ ...form, witnessPhone: e.target.value })}
                    />
                    <InputField
                      label={config.labels.witnessAddress}
                      placeholder={config.placeholders.witnessAddress}
                      value={form.witnessAddress}
                      onChange={(e) => setForm({ ...form, witnessAddress: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Section 10: Document Details (Optional) */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">10</span>
                  <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                    {(() => {
                      const FileTextIcon = getIcon('FileText');
                      return <FileTextIcon className="w-3.5 h-3.5" />;
                    })()}
                    {config.sections[9].title}
                  </h3>
                </div>
                <p className="text-stone-500 text-xs mb-3">{config.documentSections.description}</p>
                
                <div className="space-y-4">
                  {/* BPL Card */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">{config.documentSections.bplCard}</h4>
                    <div className="space-y-2">
                      <InputField
                        label={config.labels.bplCardNumber}
                        placeholder={config.placeholders.bplCardNumber}
                        value={form.bplCardNumber}
                        onChange={(e) => setForm({ ...form, bplCardNumber: e.target.value })}
                      />
                      {/* Photo upload removed */}
                    </div>
                  </div>

                  {/* Aadhaar Card */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">{config.documentSections.aadhaarCard}</h4>
                    <div className="space-y-2">
                      <InputField
                        label={config.labels.aadhaarNumber}
                        placeholder={config.placeholders.aadhaarNumber}
                        value={form.aadhaarNumber}
                        onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                      />
                      {/* Photo upload removed */}
                    </div>
                  </div>

                  {/* NOC from Family/Government/Pradhan Certificate */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">{config.documentSections.nocCertificate}</h4>
                    <div className="space-y-2">
                      <InputField
                        label={config.labels.nocDetails}
                        placeholder={config.placeholders.nocDetails}
                        value={form.nocDetails}
                        onChange={(e) => setForm({ ...form, nocDetails: e.target.value })}
                      />
                      {/* Photo upload removed */}
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">{config.documentSections.panCard}</h4>
                    <div className="space-y-2">
                      <InputField
                        label={config.labels.panNumber}
                        placeholder={config.placeholders.panNumber}
                        value={form.panNumber}
                        onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                      />
                      {/* Photo upload removed */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 11: Consent */}
              <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 bg-saffron-600 text-white rounded-full flex items-center justify-center text-xs font-bold">11</span>
                  <h3 className="font-semibold text-stone-800 text-sm">{config.sectionTitles.consentAgreement}</h3>
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
                      {config.labels.agreeToTerms}
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
                      {config.labels.consentToShare}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-stone-200 mt-2">
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  variant="primary"
                  className="w-full text-lg py-4 font-bold shadow-xl border-b-4 border-amber-900"
                  disabled={loading || !isEmailVerified || !isMobileVerified || !form.reporterName || !form.reporterEmail || !form.reporterPhone || !form.exactLocation || !form.city || !form.state || !form.agreeToTerms}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                       <RefreshCw className="w-5 h-5 animate-spin" />
                       SUBMITTING...
                    </span>
                  ) : (
                    config.labels?.submitButton || "SUBMIT CASE REPORT"
                  )}
                </Button>
                <p className="text-stone-500 text-xs text-center mt-2">
                  {config.labels.confidentialityText}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency number */}
          <div className="mt-6 bg-gradient-to-r from-saffron-600 to-saffron-700 text-white rounded-xl p-5 text-center shadow-lg">
            <p className="font-medium text-sm mb-1">{config.emergency.title}</p>
            <a href={`tel:${config.emergency.phoneNumber}`} className="font-serif text-2xl font-bold hover:text-saffron-100 transition-colors inline-block">
              {config.emergency.phoneNumber}
            </a>
            <p className="text-saffron-100 text-xs mt-1">{config.emergency.phoneLabel}</p>
          </div>
        </div>
      </section>
    </>
  );
}
