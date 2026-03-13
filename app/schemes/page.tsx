"use client";
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/Elements";
import { BookOpen, ShieldCheck, Mail, Phone, ChevronRight, Scale, Gavel, HelpCircle, X, User, FileText, MapPin, IndianRupee, Building2, Users } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SchemesPage() {
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
      alert('Please fill in all required fields');
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

  const centralSchemes = [
    {
      title: "National Family Benefit Scheme (NFBS)",
      authority: "National Social Assistance Programme",
      benefit: "₹20,000 lump sum",
      eligibility: "BPL family, Breadwinner death (age 18-64)",
      purpose: "Family को death के बाद financial help",
      status: "Active",
      icon: Users,
      color: "text-[#f4c430]"
    },
    {
      title: "Antyesti / Antim Sanskar Assistance",
      authority: "Central Government",
      benefit: "₹3,000 – ₹5,000 funeral expense",
      eligibility: "Poor / destitute families",
      purpose: "Implemented mostly through state governments",
      status: "Active",
      icon: BookOpen,
      color: "text-[#20b2aa]"
    }
  ];

  const stateSchemes = [
    {
      state: "Uttar Pradesh",
      schemes: [
        {
          title: "Raja Harishchandra Antyeshti Sahayata Yojana",
          benefit: "₹3,000 funeral expense",
          eligibility: "Poor families",
          icon: Building2,
          description: "UP government की यह योजना गरीब परिवारों को अंतिम संस्कार के लिए वित्तीय सहायता प्रदान करती है।"
        },
        {
          title: "Dattopant Thengadi Mratak Shramik Sahayata",
          benefit: "Financial help for construction workers",
          eligibility: "Construction workers के death पर",
          icon: Users,
          description: "निर्माण श्रमिकों की मृत्यु पर उनके परिवार को वित्तीय सहायता प्रदान की जाती है।"
        }
      ]
    },
    {
      state: "Rajasthan",
      schemes: [
        {
          title: "Antyesti Sahayata Yojana",
          benefit: "₹5,000 funeral expense",
          eligibility: "BPL families",
          icon: IndianRupee,
          description: "राजस्थान सरकार द्वारा BPL परिवारों को अंतिम संस्कार हेतु वित्तीय सहायता।"
        }
      ]
    },
    {
      state: "Madhya Pradesh",
      schemes: [
        {
          title: "Antyeshti Sahayata Yojana",
          benefit: "₹5,000",
          eligibility: "Poor families",
          icon: BookOpen,
          description: "मध्य प्रदेश में गरीब परिवारों के लिए अंतिम संस्कार सहायता योजना।"
        }
      ]
    },
    {
      state: "Bihar",
      schemes: [
        {
          title: "Kabir Antyeshti Anudan Yojana",
          benefit: "₹3,000",
          eligibility: "BPL families - Direct payment family को",
          icon: Users,
          description: "बिहार सरकार की यह योजना BPL परिवारों को सीधे भुगतान के रूप में सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Jharkhand",
      schemes: [
        {
          title: "Mukhyamantri Antyeshti Sahayata",
          benefit: "₹3,000 – ₹5,000",
          eligibility: "Poor families",
          icon: Building2,
          description: "झारखंड के मुख्यमंत्री अंतिम संस्कार सहायता योजना।"
        }
      ]
    },
    {
      state: "Chhattisgarh",
      schemes: [
        {
          title: "Antyeshti Sahayata Scheme",
          benefit: "₹2,000 – ₹5,000",
          eligibility: "BPL families",
          icon: IndianRupee,
          description: "छत्तीसगढ़ सरकार की अंतिम संस्कार सहायता योजना।"
        }
      ]
    },
    {
      state: "West Bengal",
      schemes: [
        {
          title: "Samobyathi Scheme",
          benefit: "₹2,000 funeral assistance",
          eligibility: "Poor families",
          icon: BookOpen,
          description: "पश्चिम बंगाल की समोब्यथी योजना गरीब परिवारों को अंतिम संस्कार सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Odisha",
      schemes: [
        {
          title: "Harischandra Sahayata Yojana",
          benefit: "₹2,000 cash + Free cremation facilities",
          eligibility: "Destitute families",
          icon: Users,
          description: "ओडिशा की हरिश्चंद्र सहायता योजना नकद राशि और मुफ्त दाह संस्कार की सुविधा प्रदान करती है।"
        }
      ]
    },
    {
      state: "Gujarat",
      schemes: [
        {
          title: "Manav Garima / Funeral Assistance",
          benefit: "Funeral cost support",
          eligibility: "Poor families",
          icon: Building2,
          description: "गुजरात की मानव गरिमा योजना गरीब परिवारों को अंतिम संस्कार की लागत में सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Maharashtra",
      schemes: [
        {
          title: "Sanjay Gandhi Niradhar Anudan Yojana",
          benefit: "Death assistance + funeral support",
          eligibility: "Destitute families",
          icon: IndianRupee,
          description: "महाराष्ट्र की संजय गांधी निराधार अनुदान योजना मृत्यु सहायता और अंतिम संस्कार सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Tamil Nadu",
      schemes: [
        {
          title: "Perunthalaivar Kamarajar Funeral Assistance Scheme",
          benefit: "₹15,000 funeral expense",
          eligibility: "Poor families",
          icon: BookOpen,
          description: "तमिलनाडु की पेरुंथलैवर कामराज अंतिम संस्कार सहायता योजना सबसे अधिक राशि प्रदान करती है।"
        }
      ]
    },
    {
      state: "Karnataka",
      schemes: [
        {
          title: "Sandhya Suraksha / Death Assistance",
          benefit: "Financial help",
          eligibility: "Poor families",
          icon: Users,
          description: "कर्नाटक की संध्या सुरक्षा योजना गरीब परिवारों को मृत्यु सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Delhi",
      schemes: [
        {
          title: "Municipal Cremation Support",
          benefit: "Electric / CNG crematorium free या subsidized",
          eligibility: "Poor families को free cremation facility",
          icon: Building2,
          description: "दिल्ली नगर निगम गरीब परिवारों को मुफ्त या सब्सिडी वाली दाह संस्कार सुविधा प्रदान करता है।"
        }
      ]
    }
  ];

  const otherSchemes = [
    {
      title: "Construction Worker Welfare Board",
      benefit: "₹5,000-₹10,000 funeral assistance",
      eligibility: "Registered construction workers",
      description: "निर्माण श्रमिक कल्याण बोर्ड के तहत पंजीकृत श्रमिकों को अंतिम संस्कार सहायता।"
    },
    {
      title: "SC/ST Welfare Department",
      benefit: "₹2,000-₹5,000 funeral assistance",
      eligibility: "SC/ST families",
      description: "अनुसूचित जाति/जनजाति कल्याण विभाग द्वारा अंतिम संस्कार सहायता।"
    },
    {
      title: "Panchayat Relief Fund",
      benefit: "Emergency death assistance",
      eligibility: "Village level support",
      description: "पंचायत राहत कोष से आपातकालीन मृत्यु सहायता प्रदान की जाती है।"
    }
  ];

  const assistanceTypes = [
    { type: "BPL funeral assistance", amount: "₹2,000 – ₹5,000" },
    { type: "Labour welfare funeral", amount: "₹5,000 – ₹10,000" },
    { type: "State special schemes", amount: "₹3,000 – ₹15,000" },
    { type: "National Family Benefit", amount: "₹20,000" }
  ];

  const helpSources = [
    "Panchayat",
    "Municipal Corporation", 
    "District Magistrate office",
    "Social Welfare Department"
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-stone-50 text-gray-900 py-12 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <Container>
          <div className="max-w-4xl text-center mx-auto">
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 mb-6">
              <p className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em] leading-none">GOVERNMENT RESOURCES</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-gray-900">FUNERAL ASSISTANCE <br /><span className="text-amber-700">SCHEMES</span></h1>
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              Complete guide to Central and State government schemes providing financial assistance for funeral expenses and family support
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
              Central Government Schemes
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'state'
                  ? 'bg-amber-800 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-stone-50'
              }`}
            >
              State-Wise Schemes
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
                Central Government Schemes (All India)
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
                          Apply for this scheme <ChevronRight size={16} />
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
                Other Government Funeral Assistance
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
                      Apply for assistance <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Typical Assistance Amounts */}
            <div className="bg-white rounded-2xl border border-blue-100 p-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-6">
                💰 Typical Government Funeral Assistance (India)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 font-black text-stone-900 uppercase tracking-wide">Scheme Type</th>
                      <th className="text-left py-3 font-black text-stone-900 uppercase tracking-wide">Amount</th>
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
                🗺️ State-Wise Funeral / Cremation Schemes
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
                                Apply for this scheme <ChevronRight size={16} />
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
              ✅ Where to Get Help
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Poor families को usually help milti hai through these government offices:
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
                  NEED HELP <br />
                  <span className="text-[#f4c430]">FOR APPLYING?</span>
                </h2>
                <p className="text-blue-100 font-medium text-lg leading-relaxed max-w-xl">
                  Dealing with government paperwork can be overwhelming during a crisis.
                  Our trained volunteers will help you navigate the entire process, 100% free.
                </p>
              </div>

              <div className="lg:w-2/5 w-full">
                <div className="space-y-10">
                  {/* Call Action */}
                  <a href="tel:+911800123456" className="flex items-center gap-6 group/link">
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover/link:border-[#f4c430] group-hover/link:bg-[#f4c430]/10 transition-all">
                      <Phone className="text-white group-hover/link:text-[#f4c430] transition-colors" size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-1">CALL US</p>
                      <p className="text-2xl font-black tracking-tighter text-white group-hover/link:text-[#f4c430] transition-colors leading-none">1800-123-456</p>
                    </div>
                  </a>

                  {/* Email Action */}
                  <a href="mailto:schemes@mokshaseva.org" className="flex items-center gap-6 group/link">
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover/link:border-[#f4c430] group-hover/link:bg-[#f4c430]/10 transition-all">
                      <Mail className="text-white group-hover/link:text-[#f4c430] transition-colors" size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-1">EMAIL SUPPORT</p>
                      <p className="text-xl font-black tracking-tighter text-white group-hover/link:text-[#f4c430] transition-colors leading-none">schemes@mokshaseva.org</p>
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
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-stone-900 mb-6 leading-none">REQUEST RECEIVED!</h2>
                <p className="text-stone-600 font-medium text-lg leading-relaxed mb-8">
                  Thank you for reaching out. Our schemes assistance team will contact you within 24 hours to help you with the application process.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={closeForm} className="bg-stone-900 text-white px-10 py-5 font-black uppercase tracking-widest">
                    CLOSE
                  </Button>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="bg-white border-2 border-stone-200 text-stone-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-[12px] hover:border-[#7ab800] transition-all"
                  >
                    SUBMIT ANOTHER REQUEST
                  </button>
                </div>
              </div>
            ) : (
              // Form State
              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-[#f4c430]/10 border border-[#f4c430]/20 mb-4">
                    <p className="text-[#f4c430] font-black text-[10px] uppercase tracking-[0.4em] leading-none">SCHEME ASSISTANCE</p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-stone-900 mb-4 leading-none">
                    REQUEST HELP FOR<br />
                    <span className="text-[#f4c430]">{selectedScheme}</span>
                  </h2>
                  <p className="text-stone-500 font-medium leading-relaxed">
                    Fill in your details and our team will guide you through the entire application process.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">FULL NAME *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">PHONE NUMBER *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">FULL ADDRESS *</label>
                    <textarea
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium resize-none"
                      placeholder="Complete address"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">CITY *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder="City name"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">STATE *</label>
                      <select
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                      >
                        <option value="">Select state</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">PINCODE *</label>
                      <input
                        type="text"
                        required
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium"
                        placeholder="123456"
                        pattern="[0-9]{6}"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-black text-[10px] uppercase tracking-widest mb-2">ADDITIONAL DETAILS (OPTIONAL)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:border-[#7ab800] focus:ring-4 focus:ring-[#7ab800]/10 outline-none transition-all font-medium resize-none"
                      placeholder="Any specific questions or urgent requirements..."
                    />
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                    <p className="text-amber-800 text-sm font-medium leading-relaxed">
                      <strong className="font-black">Note:</strong> Our team will contact you within 24 hours to verify your eligibility and guide you through the documentation process. All assistance is completely free.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#f4c430] hover:bg-[#eab308] text-black py-5 font-black uppercase tracking-widest shadow-xl"
                  >
                    SUBMIT REQUEST
                  </Button>

                  <p className="text-stone-400 text-[10px] text-center uppercase tracking-widest leading-relaxed">
                    Your information is confidential and will only be used for scheme assistance.
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
