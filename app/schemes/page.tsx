"use client";
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/Elements";
import { X, HelpCircle, ChevronRight, Phone, Mail, Building2, MapPin, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { schemesConfig } from "@/config/schemes.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function SchemesPage() {
  const { config, loading: configLoading, error: configError } = usePageConfig('schemes', schemesConfig);
  const activeConfig = config || schemesConfig;
  
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'central' | 'state'>('central');
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    schemeName: "",
    message: ""
  });

  // Cleanup scroll lock on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedScheme) {
        closeForm();
      }
    };

    if (selectedScheme) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedScheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      alert(activeConfig.form.validation.fillRequiredFields);
      return;
    }

    try {
      // Prepare form data to match backend model
      const schemeData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        schemeName: form.schemeName,
        schemeType: 'central', // Default to central
        incomeCategory: 'other', // Default value
        familySize: 1, // Default value
        monthlyIncome: 0, // Default value
        agreeToTerms: true // Implied consent by submitting
      };

      console.log('Submitting scheme request:', schemeData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/schemes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schemeData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Scheme request submitted successfully:', result);
        setSubmitted(true);
      } else {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Scheme request error:', error);
      alert(`Failed to submit request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const openForm = (schemeTitle: string) => {
    setSelectedScheme(schemeTitle);
    setForm({ ...form, schemeName: schemeTitle });
    setSubmitted(false);
    // Disable background scroll
    document.body.style.overflow = 'hidden';
  };

  const closeForm = () => {
    setSelectedScheme(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      schemeName: "",
      message: ""
    });
    setSubmitted(false);
    // Re-enable background scroll
    document.body.style.overflow = 'unset';
  };

  const centralSchemes = activeConfig.centralSchemes.map(scheme => ({
    ...scheme,
    icon: getIcon(scheme.icon)
  }));

  const stateSchemes = activeConfig.stateSchemes.map(stateData => ({
    ...stateData,
    schemes: stateData.schemes.map(scheme => ({
      ...scheme,
      icon: getIcon(scheme.icon)
    }))
  }));

  const otherSchemes = activeConfig.otherSchemes.map(scheme => ({
    ...scheme,
    icon: getIcon(scheme.icon)
  }));

  const assistanceTypes = activeConfig.assistanceTypes;
  const helpSources = activeConfig.helpSources;

  return (
    <main className="min-h-screen bg-white">
      {/* Loading State */}
      {configLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
        </div>
      )}

      {/* Error State */}
      {configError && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load page configuration</p>
            <p className="text-gray-600">Using default configuration</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-stone-50 text-gray-900 py-12 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <Container>
          <div className="max-w-4xl text-center mx-auto">
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 mb-6">
              <p className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em] leading-none">{activeConfig.hero.badge}</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-gray-900">{activeConfig.hero.title} <br /><span className="text-amber-700">{activeConfig.hero.subtitle}</span></h1>
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              {activeConfig.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-stone-100 border-b border-stone-200">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('central')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'central'
                  ? 'bg-amber-700 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-stone-50'
              }`}
            >
              {activeConfig.tabs.central}
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'state'
                  ? 'bg-amber-800 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-stone-50'
              }`}
            >
              {activeConfig.tabs.state}
            </button>
          </div>
        </Container>
      </section>

      {/* Central Government Schemes */}
      {activeTab === 'central' && (
        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
                {activeConfig.sections.centralTitle}
              </h2>
              <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
            </div>

            <div className="grid gap-8 mb-16">
              {centralSchemes.map((scheme, i) => {
                const Icon = scheme.icon;
                return (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all group">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-1/4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-[#f4c430]/10 to-[#20b2aa]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-8 h-8 ${scheme.color}`} />
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          {scheme.status}
                        </div>
                      </div>
                      
                      <div className="lg:w-3/4">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-stone-900">{scheme.title}</h3>
                        <p className="text-[#20b2aa] font-medium text-sm mb-4 uppercase tracking-wide">{scheme.authority}</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <p className="text-stone-400 font-medium text-xs uppercase tracking-wide mb-2">Benefit Amount</p>
                            <p className="text-[#f4c430] font-black text-lg">{scheme.benefit}</p>
                          </div>
                          <div>
                            <p className="text-stone-400 font-medium text-xs uppercase tracking-wide mb-2">Eligibility</p>
                            <p className="text-stone-700 font-medium">{scheme.eligibility}</p>
                          </div>
                        </div>
                        
                        <p className="text-stone-600 leading-relaxed mb-4">{scheme.purpose}</p>
                        
                        <button 
                          onClick={() => openForm(scheme.title)}
                          className="flex items-center gap-2 text-[#20b2aa] hover:text-[#1a9b94] font-medium transition-colors"
                        >
                          {activeConfig.buttons.applyForScheme} <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Other Government Assistance */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-6">
                {activeConfig.sections.otherAssistanceTitle}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {otherSchemes.map((scheme, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all group">
                    <h4 className="font-black text-stone-900 mb-2">{scheme.title}</h4>
                    <p className="text-[#f4c430] font-medium text-sm mb-2">{scheme.benefit}</p>
                    <p className="text-stone-600 text-sm mb-3">{scheme.eligibility}</p>
                    {scheme.description && (
                      <p className="text-stone-500 text-xs leading-relaxed mb-4">{scheme.description}</p>
                    )}
                    <button 
                      onClick={() => openForm(scheme.title)}
                      className="flex items-center gap-2 text-[#20b2aa] hover:text-[#1a9b94] font-medium transition-colors text-sm"
                    >
                      {activeConfig.buttons.applyForAssistance} <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Typical Assistance Amounts */}
            <div className="bg-white rounded-2xl border border-blue-100 p-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-6">
                {activeConfig.sections.assistanceAmountsTitle}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 font-black text-stone-900 uppercase tracking-wide">{activeConfig.tableHeaders.schemeType}</th>
                      <th className="text-left py-3 font-black text-stone-900 uppercase tracking-wide">{activeConfig.tableHeaders.amount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assistanceTypes.map((type, i) => (
                      <tr key={i} className="border-b border-stone-100">
                        <td className="py-3 text-stone-700">{type.type}</td>
                        <td className="py-3 text-[#f4c430] font-medium">{type.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* State-Wise Schemes */}
      {activeTab === 'state' && (
        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-stone-900 mb-4">
                {activeConfig.sections.stateTitle}
              </h2>
              <div className="w-20 h-1 bg-[#20b2aa] mx-auto"></div>
            </div>

            <div className="grid gap-8">
              {stateSchemes.map((stateData, i) => (
                <div key={i} className="bg-white rounded-2xl border border-teal-100 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#20b2aa] to-[#1e3a8a] text-white p-6">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6" />
                      <h3 className="text-2xl font-black uppercase tracking-tighter">{stateData.state}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid gap-4">
                      {stateData.schemes.map((scheme, j) => {
                        const Icon = scheme.icon;
                        return (
                          <div key={j} className="bg-white p-6 rounded-xl border border-teal-100 hover:shadow-lg transition-all group">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-10 h-10 rounded-lg bg-[#20b2aa]/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-[#20b2aa]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-black text-stone-900 mb-1">{scheme.title}</h4>
                                <p className="text-[#f4c430] font-medium text-sm mb-1">{scheme.benefit}</p>
                                <p className="text-stone-600 text-sm mb-2">{scheme.eligibility}</p>
                                {scheme.description && (
                                  <p className="text-stone-500 text-xs leading-relaxed">{scheme.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                              <button 
                                onClick={() => openForm(scheme.title)}
                                className="flex items-center gap-2 text-[#20b2aa] hover:text-[#1a9b94] font-medium transition-colors text-sm"
                              >
                                {activeConfig.buttons.applyForScheme} <ChevronRight size={16} />
                              </button>
                              <div className="text-xs text-stone-400 font-medium">
                                {stateData.state}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Help Sources */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-stone-900 mb-4">
              {activeConfig.sections.helpSourcesTitle}
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              {activeConfig.sections.helpSourcesDescription}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpSources.map((source, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-blue-100 text-center hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#20b2aa]/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-[#20b2aa]" />
                </div>
                <h3 className="font-black text-stone-900 uppercase tracking-wide text-sm">{source}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Help Section */}
      <section className="py-24 bg-gradient-to-r from-[#20b2aa] to-[#1e3a8a] text-white">
        <Container>
          <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-sm rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f4c430]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
              <div className="lg:w-3/5">
                <div className="w-14 h-14 rounded-2xl bg-[#f4c430] flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(244,196,48,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <HelpCircle size={28} className="text-black" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                  {activeConfig.help.title} <br />
                  <span className="text-[#f4c430]">{activeConfig.help.subtitle}</span>
                </h2>
                <p className="text-blue-100 font-medium text-lg leading-relaxed max-w-xl">
                  {activeConfig.help.description}
                </p>
              </div>

              <div className="lg:w-2/5 w-full">
                <div className="space-y-10">
                  {/* Call Action */}
                  <a href={`tel:+91${activeConfig.help.phone.replace(/\D/g, '')}`} className="flex items-center gap-6 group/link">
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover/link:border-[#f4c430] group-hover/link:bg-[#f4c430]/10 transition-all">
                      <Phone className="text-white group-hover/link:text-[#f4c430] transition-colors" size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-1">{activeConfig.help.callLabel}</p>
                      <p className="text-2xl font-black tracking-tighter text-white group-hover/link:text-[#f4c430] transition-colors leading-none">{activeConfig.help.phone}</p>
                    </div>
                  </a>

                  {/* Email Action */}
                  <a href={`mailto:${activeConfig.help.email}`} className="flex items-center gap-6 group/link">
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover/link:border-[#f4c430] group-hover/link:bg-[#f4c430]/10 transition-all">
                      <Mail className="text-white group-hover/link:text-[#f4c430] transition-colors" size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-1">{activeConfig.help.emailLabel}</p>
                      <p className="text-xl font-black tracking-tighter text-white group-hover/link:text-[#f4c430] transition-colors leading-none">{activeConfig.help.email}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Form Modal */}
      {selectedScheme && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" 
          onClick={closeForm}
          style={{ touchAction: 'none' }} // Prevent mobile scroll
        >
          <div 
            className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[85vh] shadow-2xl relative flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Fixed at top */}
            <button
              onClick={closeForm}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-all z-20 shadow-lg"
            >
              <X size={20} className="text-stone-600" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {submitted ? (
              // Success State
              <div className="p-12 md:p-16 text-center">
                <div className="w-24 h-24 rounded-full bg-[#f4c430] flex items-center justify-center mx-auto mb-8">
                  <ShieldCheck className="text-black" size={48} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-stone-900 mb-6 leading-none">{activeConfig.form.success.title}</h2>
                <p className="text-stone-600 font-medium text-lg leading-relaxed mb-8">
                  {activeConfig.form.success.description}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={closeForm} className="bg-stone-900 text-white px-10 py-5 font-black uppercase tracking-widest">
                    {activeConfig.form.success.closeButton}
                  </Button>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="bg-white border-2 border-stone-200 text-stone-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-[12px] hover:border-[#7ab800] transition-all"
                  >
                    {activeConfig.form.success.submitAnotherButton}
                  </button>
                </div>
              </div>
            ) : (
              // Form State
              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-[#f4c430]/10 border border-[#f4c430]/20 mb-4">
                    <p className="text-[#f4c430] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{activeConfig.form.formHeader.badge}</p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-stone-900 mb-4 leading-none">
                    {activeConfig.form.formHeader.title}<br />
                    <span className="text-[#f4c430]">{selectedScheme}</span>
                  </h2>
                  <p className="text-stone-500 font-medium leading-relaxed">
                    {activeConfig.form.formHeader.description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.fullName} *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                      placeholder={activeConfig.form.placeholders.fullName}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.emailAddress} *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder={activeConfig.form.placeholders.email}
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.phoneNumber} *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder={activeConfig.form.placeholders.phone}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.fullAddress} *</label>
                    <textarea
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium resize-none"
                      placeholder={activeConfig.form.placeholders.address}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.city} *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder={activeConfig.form.placeholders.city}
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.state} *</label>
                      <select
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                      >
                        <option value="">{activeConfig.form.labels.selectState}</option>
                        {activeConfig.states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.pincode} *</label>
                      <input
                        type="text"
                        required
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder={activeConfig.form.placeholders.pincode}
                        pattern="[0-9]{6}"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">{activeConfig.form.labels.additionalDetails}</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium resize-none"
                      placeholder={activeConfig.form.placeholders.message}
                    />
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                    <p className="text-amber-800 text-sm font-medium leading-relaxed">
                      <strong className="font-black">{activeConfig.form.note.split(':')[0]}:</strong> {activeConfig.form.note.split(': ')[1]}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#f4c430] hover:bg-[#eab308] text-black py-5 font-black uppercase tracking-widest shadow-xl"
                  >
                    {activeConfig.form.submitButton}
                  </Button>

                  <p className="text-stone-400 text-[10px] text-center uppercase tracking-widest leading-relaxed">
                    {activeConfig.form.confidentialityNote}
                  </p>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 1.5rem 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a29e;
        }
      `}</style>
    </main>
  );
}
