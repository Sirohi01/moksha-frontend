"use client";
import { useState, useRef, useEffect } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField, TextareaField, SelectField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";
import NextImage from "next/image";
import { cn, getAlt } from "@/lib/utils";
import { volunteerConfig as localVolunteerConfig } from "@/config/volunteer.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { useToast } from "@/context/ToastContext";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { 
  CheckCircle, 
  Camera, 
  Upload, 
  User, 
  Users, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Fingerprint, 
  Info,
  ExternalLink,
  Eye,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Briefcase,
  Activity,
  Globe,
  Mail,
  Clock,
} from "lucide-react";

export default function VolunteerPage() {
  const { config, loading } = usePageConfig('volunteer', localVolunteerConfig);
  const { success: showSuccessToast, error: showErrorToast, warning: showWarningToast } = useToast();
  const activeConfig = config || localVolunteerConfig;

  // Icons and Types from Backend
  const volunteerTypes = (activeConfig.volunteerTypes || []).map(type => ({
    ...type,
    icon: getIcon(type.icon)
  }));

  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  
  const [form, setForm] = useState({
    registrationType: "individual",
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    occupation: "",
    organization: "",
    experience: "no_experience",
    skills: "",
    facebookProfile: "",
    instagramHandle: "",
    twitterHandle: "",
    linkedinProfile: "",
    availability: "",
    preferredLocation: "",
    hasVehicle: false,
    vehicleType: "",
    languagesKnown: "",
    groupName: "",
    groupSize: "1",
    groupType: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    whyVolunteer: "",
    previousVolunteerWork: "",
    medicalConditions: "",
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  });

  const [groupMembers, setGroupMembers] = useState<{name: string, role: string, contact: string, photo: string | null}[]>([]);
  const photoFileInput = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      if (index !== undefined) {
        const update = [...groupMembers];
        update[index].photo = b64;
        setGroupMembers(update);
      } else {
        setProfilePhoto(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  const addMember = () => setGroupMembers([...groupMembers, { name: "", role: "", contact: "", photo: null }]);
  const removeMember = (idx: number) => setGroupMembers(groupMembers.filter((_, i) => i !== idx));
  const updateMember = (idx: number, f: string, v: string) => {
    const update = [...groupMembers];
    update[idx] = { ...update[idx], [f]: v };
    setGroupMembers(update);
  };

  const handleSubmit = async () => {
    if (selectedTypes.length === 0) return showWarningToast(activeConfig.validationMessages?.selectVolunteerType || "Select a volunteer type");
    if (!profilePhoto) return showWarningToast("Profile photo is required for institutional I-Card");
    if (!isEmailVerified || !isMobileVerified) return showWarningToast("Please verify your email and phone number");
    if (!form.agreeToTerms) return showWarningToast("Mission terms agreement is required");
    if (!form.agreeToBackgroundCheck) return showWarningToast("Background check authorization is required");
    
    if (form.registrationType === 'group') {
      if (!form.groupName) return showWarningToast("Group name is required for taskforce enrollment");
      if (!form.groupType) return showWarningToast("Group classification (Type) is mandatory");
      if (groupMembers.length === 0) return showWarningToast("Taskforce must have at least one enlisted member");
    }

    setLoadingSubmit(true);
    try {
      // Tactical Sanitization: Clear leading zeros from phone signal
      const sanitizedPhone = form.phone.replace(/^0+/, '').replace(/\s+/g, '');
      
      const payload: any = { 
        ...form, 
        phone: sanitizedPhone,
        volunteerTypes: selectedTypes, 
        photo: profilePhoto, 
        groupMembers: form.registrationType === 'group' ? groupMembers : [] 
      };

      // Prune inactive group fields if individual
      if (form.registrationType === 'individual') {
        ['groupName', 'groupType', 'groupSize', 'groupLeaderName', 'groupLeaderPhone', 'groupLeaderEmail'].forEach(key => delete payload[key]);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if(res.ok) { 
        setSubmitted(true); 
        showSuccessToast(activeConfig.success?.title || "Application Submitted Successfully"); 
      } else {
        const errorMsg = data.errors ? data.errors[0].msg : data.message || "Registry Sync Failed";
        throw new Error(errorMsg);
      }
    } catch (e: any) { 
      showErrorToast(e.message); 
    } finally { 
      setLoadingSubmit(false); 
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-center text-zinc-950 font-black uppercase italic animate-in fade-in duration-1000">
         <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-stone-100">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl transition-all duration-700 animate-in zoom-in-0"><CheckCircle className="w-8 h-8" /></div>
            <div className="space-y-4 my-8">
               <h2 className="text-3xl font-black tracking-tighter leading-none">{activeConfig.success?.title}</h2>
               <p className="text-[10px] opacity-50 normal-case italic font-bold">{activeConfig.success?.description}</p>
            </div>
            <button onClick={() => window.location.reload()} className="w-full h-14 rounded-xl font-black text-xs italic bg-zinc-950 text-white tracking-[0.4em] hover:bg-black shadow-xl transition-all uppercase">
               {activeConfig.success?.registerAnotherText}
            </button>
         </div>
      </div>
    );
  }

  const SectionTitle = ({ num, title, icon: Icon }: { num: number; title: string, icon?: any }) => (
    <div className="flex flex-col gap-4 mb-8 md:mb-12 group/title">
       <div className="flex items-center gap-4 md:gap-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-navy-950 text-gold-500 flex items-center justify-center shadow-2xl group-hover/title:bg-gold-600 group-hover/title:text-navy-950 transition-all duration-500 border border-navy-900/50">
             {Icon ? <Icon className="w-4 h-4 md:w-5 md:h-5" /> : <span className="text-xs md:text-sm font-black italic">{num}</span>}
          </div>
          <div className="flex-1 h-px bg-stone-100"></div>
       </div>
       <div className="space-y-1">
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gold-600/80 ml-1">Step 0{num}</p>
          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-navy-950 leading-none">{title}</h3>
       </div>
    </div>
  );

  return (
    <div className="bg-[#FCFCFC] min-h-screen pb-24 md:pb-40 selection:bg-gold-200 antialiased">
       {/* HIGH-END NAVIGATION & STATUS BAR */}
       <div className="py-4 px-4 md:px-16 bg-white/80 sticky top-0 z-50 backdrop-blur-xl border-b border-stone-100 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 md:gap-12">
             <div className="flex items-center gap-4 md:gap-6">
                <div className="w-1 h-6 md:w-1.5 md:h-8 bg-navy-950 rounded-full"></div>
                <div className="space-y-0.5 md:space-y-1">
                   <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.6em] text-gold-600 leading-none">{activeConfig.hero?.badge || "GLOBAL RECRUITMENT"}</p>
                   <h1 className="text-sm md:text-2xl font-black text-navy-950 italic tracking-tighter leading-none uppercase">{activeConfig.hero?.title}</h1>
                </div>
             </div>
             <div className="flex items-center gap-4 md:gap-8">
                <div className="text-right">
                   <div className="text-[8px] md:text-[10px] font-black text-emerald-600 flex items-center justify-end gap-2 md:gap-3 tracking-widest leading-none">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> 
                      <span className="hidden xs:inline">SECURE_UP</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

        <div className="max-w-[1700px] mx-auto px-4 md:px-6 mt-8 md:mt-12 relative">
           
           <div className={cn(
              "max-w-[1700px] mx-auto transition-all duration-1000",
              showLivePreview ? "lg:translate-x-56" : "translate-x-0"
           )}>
              {loading ? <div className="py-10"><FormSkeleton /></div> : (
                 <main>
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-stone-100 space-y-16 md:space-y-24">
                       
                       {/* S1: IDENTITY IDENTIFICATION */}
                       <section className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
                          <SectionTitle num={1} title={activeConfig.sections?.[0]?.title || "Identity Matrix"} icon={Camera} />
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                             <div 
                                className="w-full aspect-video bg-stone-50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-white hover:border-gold-500 transition-all duration-700 group relative shadow-inner"
                                onClick={() => photoFileInput.current?.click()}
                             >
                                {profilePhoto ? (
                                   <NextImage 
                                     src={profilePhoto} 
                                     alt={getAlt(profilePhoto, null, "Identity Profile")}
                                     fill
                                     unoptimized
                                     className="object-cover transition-all duration-700 shadow-2xl" 
                                   />
                                ) : (
                                   <div className="text-center font-black uppercase tracking-widest text-navy-200 text-[10px] md:text-xs space-y-4 md:space-y-6 p-6 md:p-10">
                                      <Camera className="w-8 h-8 md:w-12 md:h-12 mx-auto text-stone-200 group-hover:text-gold-500 transition-all duration-700" /> 
                                      <div className="leading-tight text-stone-400 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em]">Upload Tactical Identity</div>
                                      <p className="text-[8px] md:text-[10px] font-black text-gold-600/50 italic tracking-widest lowercase">institutional badge format</p>
                                   </div>
                                )}
                                <input type="file" ref={photoFileInput} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                                {profilePhoto && (
                                   <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                       <div className="flex items-center gap-3 bg-white text-navy-950 px-5 md:px-6 py-2.5 md:py-3 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-2xl">
                                          <Upload className="w-3 md:w-3.5 h-3 md:h-3.5" /> RE-UPLOAD_BIO_SIGNAL
                                       </div>
                                   </div>
                                )}
                             </div>
                             <div className="space-y-6 md:space-y-10">
                                <div className="p-8 md:p-12 bg-navy-950 rounded-[2rem] md:rounded-[3rem] text-white relative overflow-hidden group/card shadow-2xl border border-navy-900">
                                   <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gold-500/10 blur-[80px] md:blur-[120px] rounded-full -mr-32 -mt-32 md:-mr-40 md:-mt-40 transition-all duration-1000 group-hover/card:bg-gold-500/20"></div>
                                   <div className="relative z-10 space-y-6 md:space-y-8">
                                      <div className="flex items-center gap-3 md:gap-4 text-gold-500 border-b border-white/10 pb-4 md:pb-6">
                                         <div className="w-1 md:w-1.5 h-5 md:h-6 bg-gold-500"></div>
                                         <h5 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Visual Identification Protocol</h5>
                                      </div>
                                      <p className="text-xs md:text-base text-stone-300 leading-relaxed font-medium italic">Identification visuals are mission-critical for regional authorization. Ensure clarity for institutional credentialing.</p>
                                      <div className="flex items-center gap-3 md:gap-4 py-2">
                                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                         <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase text-white/40">Secure_Metadata_Encryption_Active</span>
                                      </div>
                                   </div>
                                </div>
                                <button 
                                   onClick={() => photoFileInput.current?.click()}
                                   className="w-full py-5 md:py-8 bg-white text-navy-950 rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] hover:bg-navy-950 hover:text-white transition-all duration-500 flex items-center justify-center gap-4 md:gap-6 border-2 border-stone-100 shadow-xl group/btn"
                                >
                                   <Upload className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:-translate-y-1 transition-transform" /> START_UPLINK_PROCESS
                                </button>
                             </div>
                          </div>
                       </section>

                      {/* S2: VOLUNTEER CATEGORIES */}
                      <section className="space-y-8 md:space-y-12 pt-10 md:pt-16 border-t border-stone-100">
                         <SectionTitle num={2} title={activeConfig.labels?.selectVolunteerTypes || "Engagement Directive"} icon={Users} />
                         <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {volunteerTypes.map((v) => {
                               const Icon = v.icon;
                               const active = selectedTypes.includes(v.value);
                               return (
                                  <button 
                                     key={v.value} 
                                     onClick={() => setSelectedTypes(p => active ? p.filter(x => x !== v.value) : [...p, v.value])}
                                     className={cn(
                                        "p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 text-left transition-all duration-700 relative flex flex-col gap-4 md:gap-6 group/unit",
                                        active ? "bg-navy-950 border-navy-900 text-white shadow-2xl scale-[1.02]" : "bg-white border-stone-100 hover:border-gold-500 hover:shadow-xl"
                                     )}
                                  >
                                     <div className={cn("w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md", active ? "bg-white/10 text-gold-500" : "bg-stone-50 text-stone-300 group-hover/unit:text-gold-500")}>
                                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                     </div>
                                     <div>
                                        <h4 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] leading-tight mb-1 md:mb-2">{v.label}</h4>
                                        <p className={cn("text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] leading-none opacity-60", active ? "text-gold-400" : "text-stone-400")}>{v.commitment}</p>
                                     </div>
                                     {active && <div className="absolute top-4 right-4 md:top-8 md:right-8 w-5 h-5 md:w-6 md:h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-0 duration-500"><CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-navy-950" /></div>}
                                  </button>
                               );
                            })}
                         </div>
                      </section>

                      {/* S3: FORMATION CONTROL */}
                      <section className="space-y-8 md:space-y-12 pt-10 md:pt-16 border-t border-stone-100">
                         <SectionTitle num={3} title={activeConfig.labels?.registrationType || "Personnel Matrix"} icon={ShieldCheck} />
                         <div className="flex flex-col sm:flex-row gap-4 md:gap-6 max-w-2xl">
                            {['individual', 'group'].map((t) => (
                               <button 
                                  key={t} onClick={() => setForm({...form, registrationType: t})}
                                  className={cn(
                                     "flex-1 py-4 md:py-6 px-6 md:px-10 rounded-xl md:rounded-[1.5rem] border-2 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] flex items-center justify-center gap-3 md:gap-4 transition-all duration-700 shadow-sm",
                                     form.registrationType === t ? "bg-navy-950 border-navy-900 text-white scale-[1.01] shadow-2xl" : "bg-white border-stone-50 text-stone-300 hover:border-gold-500 hover:text-navy-950"
                                  )}
                               >
                                  {t === 'individual' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Users className="w-4 h-4 md:w-5 md:h-5" />}
                                  {activeConfig.registrationTypes?.[t as keyof typeof activeConfig.registrationTypes]?.title || t}
                               </button>
                            ))}
                         </div>

                         {form.registrationType === 'group' && (
                            <div className="p-6 md:p-16 bg-stone-50 rounded-[2rem] md:rounded-[3rem] border border-stone-100 mt-6 md:mt-8 space-y-8 md:space-y-12 animate-in slide-in-from-top-12 duration-1000 shadow-inner">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                  <InputField label={activeConfig.labels?.groupName} value={form.groupName} onChange={e => setForm({...form, groupName: e.target.value})} placeholder={activeConfig.placeholders?.groupName} required className="py-5 md:py-7 text-lg md:text-xl font-black italic tracking-tighter" />
                                  <SelectField label={activeConfig.labels?.groupType} options={activeConfig.selectOptions?.groupTypes || []} value={form.groupType} onChange={e => setForm({...form, groupType: e.target.value})} required className="py-4 md:py-5" />
                               </div>
                               <div className="space-y-8 md:space-y-12">
                                  <div className="flex flex-col md:flex-row justify-between items-center bg-navy-950 -mx-6 md:-mx-16 px-8 md:px-12 py-6 md:py-8 shadow-2xl relative gap-6 md:gap-8">
                                     <div className="absolute top-0 bottom-0 left-0 w-1.5 md:w-2 bg-gold-500"></div>
                                     <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                          <Users className="w-5 h-5 md:w-6 md:h-6 text-gold-500" />
                                          <div className="space-y-1 text-left">
                                             <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-gold-500 leading-none">Taskforce Manifest</h4>
                                             <p className="text-[7px] md:text-[8px] font-bold text-white/30 uppercase tracking-[0.3em] md:tracking-[0.4em]">Unit Identity Enumeration</p>
                                          </div>
                                     </div>
                                     <button onClick={addMember} className="flex items-center justify-center gap-3 text-[9px] md:text-[10px] font-black uppercase text-white hover:text-gold-500 transition-all tracking-[0.2em] md:tracking-[0.3em] border-2 border-white/10 px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl hover:border-gold-500 w-full md:w-auto"><Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> ENLIST_MEMBER</button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                                     {groupMembers.map((member, idx) => (
                                        <div key={idx} className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-stone-100 flex flex-col gap-6 md:gap-8 relative group/member animate-in zoom-in-95 transition-all hover:border-gold-500 hover:shadow-2xl">
                                           <button onClick={() => removeMember(idx)} className="absolute top-6 right-6 md:top-8 md:right-8 text-stone-200 hover:text-red-500 transition-all transform hover:rotate-90 duration-500"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                                           <div className="flex flex-col xs:flex-row items-center xs:items-start gap-6 md:gap-8">
                                              <div className="w-16 h-20 md:w-20 md:h-24 bg-stone-50 rounded-xl md:rounded-2xl border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer shadow-inner hover:border-gold-500 transition-all relative" onClick={() => document.getElementById(`m-${idx}`)?.click()}>
                                                 {member.photo ? (
                                                    <NextImage 
                                                       src={member.photo} 
                                                       fill 
                                                       className="object-cover" 
                                                       alt="Member Identity" 
                                                       unoptimized 
                                                    />
                                                 ) : <Camera className="w-6 h-6 md:w-8 md:h-8 text-stone-200" />}
                                                 <input id={`m-${idx}`} type="file" onChange={(e) => handlePhotoUpload(e, idx)} className="hidden" accept="image/*" />
                                              </div>
                                              <div className="flex-1 w-full">
                                                 <InputField label="Tactical Identifier" value={member.name} onChange={e => updateMember(idx, 'name', e.target.value)} required placeholder="Full Legal Name" className="text-base md:text-lg font-black italic tracking-tighter" />
                                              </div>
                                           </div>
                                           <div className="grid grid-cols-1 gap-6 md:gap-8 pt-6 border-t border-stone-50">
                                                 <InputField label="Operational Role" value={member.role} onChange={e => updateMember(idx, 'role', e.target.value)} required placeholder="e.g. Field Coordinator" />
                                                 <InputField label="Digital Uplink" value={member.contact} onChange={e => updateMember(idx, 'contact', e.target.value)} required placeholder="Phone or Email" className="font-mono text-sm" />
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         )}
                      </section>

                      {/* S4: PERSONAL MATRIX */}
                      <section className="space-y-10 md:space-y-16 pt-10 md:pt-16 border-t border-stone-100">
                         <SectionTitle num={4} title={activeConfig.sections?.[0]?.title || "Identity Matrix"} icon={User} />
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-14 items-end">
                            <div className="md:col-span-2">
                               <InputField 
                                 label={activeConfig.labels?.fullName} 
                                 value={form.name} 
                                 onChange={e => setForm({...form, name: e.target.value})}
                                 required 
                                 placeholder={activeConfig.placeholders?.fullName}
                                 className="text-2xl md:text-4xl font-black italic tracking-tighter py-6 md:py-8 leading-none bg-stone-50/50"
                               />
                            </div>
                            <SelectField label={activeConfig.labels?.gender} options={activeConfig.selectOptions?.genders || []} value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required className="py-4 md:py-5" />
                            <InputField label={activeConfig.labels?.dateOfBirth} type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} required className="py-4 md:py-5" />
                            
                            <div className="space-y-4">
                               <InputField label={activeConfig.labels?.emailAddress} value={form.email} onChange={e => {setForm({...form, email: e.target.value}); setIsEmailVerified(false)}} disabled={isEmailVerified} placeholder={activeConfig.placeholders?.email} required />
                               {form.email && !isEmailVerified && <div className="mt-1 md:mt-2"><EmailVerification email={form.email} onVerified={setIsEmailVerified} /></div>}
                            </div>
                            <div className="space-y-4">
                               <InputField label={activeConfig.labels?.phoneNumber} value={form.phone} onChange={e => {setForm({...form, phone: e.target.value}); setIsMobileVerified(false)}} disabled={isMobileVerified} required className="font-mono font-black" placeholder="9876543210" />
                               {form.phone && !isMobileVerified && <div className="mt-1 md:mt-2"><MobileVerification mobile={form.phone} onVerified={setIsMobileVerified} /></div>}
                            </div>
                         </div>

                         <div className="pt-8 md:pt-12 border-t border-stone-50 space-y-8 md:space-y-12">
                            <TextareaField 
                               label={activeConfig.labels?.completeAddress} 
                               value={form.address} 
                               onChange={e => setForm({...form, address: e.target.value})}
                               required 
                               placeholder={activeConfig.placeholders?.completeAddress} 
                               className="min-h-[120px] md:min-h-[140px] text-base md:text-lg font-bold"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                               <InputField label={activeConfig.labels?.city} value={form.city} onChange={e => setForm({...form, city: e.target.value})} required placeholder={activeConfig.placeholders?.city} />
                               <SelectField label={activeConfig.labels?.state} options={(activeConfig.selectOptions?.states || []).map(s => ({value: s, label: s}))} value={form.state} onChange={e => setForm({...form, state: e.target.value})} required />
                               <InputField label={activeConfig.labels?.pinCode} value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="font-mono text-sm" placeholder={activeConfig.placeholders?.pinCode} />
                            </div>
                         </div>
                      </section>
                      {/* S5: BRIEFING LOGISTICS */}
                      <section className="space-y-10 md:space-y-16 pt-10 md:pt-16 border-t border-stone-100">
                         <SectionTitle num={5} title={activeConfig.sections?.[2]?.title || "Briefing Matrix"} icon={Briefcase} />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <InputField label={activeConfig.labels?.currentOccupation} value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} required placeholder={activeConfig.placeholders?.occupation} />
                            <SelectField label={activeConfig.labels?.experienceLevel} options={activeConfig.selectOptions?.experienceLevels || []} value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} required />
                            <div className="md:col-span-2 text-navy-950">
                               <TextareaField label={activeConfig.labels?.specialSkills} value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder={activeConfig.placeholders?.skills} className="min-h-[100px] md:min-h-[120px] text-base md:text-lg font-medium" />
                            </div>
                         </div>
                      </section>

                      {/* S6: MISSION COMMITMENT & AUTHORIZATION */}
                      <section className="space-y-10 md:space-y-16 pt-10 md:pt-16 border-t border-stone-100">
                         <SectionTitle num={6} title={activeConfig.sections?.[4]?.title || "Mission Commitment"} icon={Activity} />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <SelectField label={activeConfig.labels?.availability} options={activeConfig.selectOptions?.availabilityOptions || []} value={form.availability} onChange={e => setForm({...form, availability: e.target.value})} required />
                            <InputField label={activeConfig.labels?.preferredLocation} value={form.preferredLocation} onChange={e => setForm({...form, preferredLocation: e.target.value})} placeholder={activeConfig.placeholders?.preferredLocation} />
                            <div className="md:col-span-2">
                               <TextareaField label={activeConfig.labels?.whyVolunteer} value={form.whyVolunteer} onChange={e => setForm({...form, whyVolunteer: e.target.value})} required placeholder={activeConfig.placeholders?.whyVolunteerPlaceholder} className="min-h-[120px] md:min-h-[160px] text-base md:text-lg font-medium" />
                            </div>
                         </div>

                         {/* ACTION ZONE: MISSION UPLINK COMMAND */}
                         <div className="relative mt-16 md:mt-24 rounded-[2rem] md:rounded-[3rem] overflow-hidden group/uplink bg-white border-2 border-stone-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)]">
                            {/* Subtle Interactive Glow */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-gold-400/[0.05] blur-[100px] md:blur-[120px] -mr-32 -mt-32 md:-mr-40 md:-mt-40 transition-all duration-1000 group-hover/uplink:bg-gold-400/[0.1]"></div>
                            
                            <div className="px-6 md:px-20 py-12 md:py-24 space-y-12 md:space-y-16 relative">
                               <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 md:gap-16 relative z-10">
                                  <div className="space-y-8 md:space-y-10 max-w-xl">
                                     <div className="flex items-center gap-4 text-gold-600 mb-2 md:mb-4">
                                        <div className="w-1.5 h-4 md:h-6 bg-gold-500 rounded-full"></div>
                                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Mission Authorization protocol</h4>
                                     </div>
                                     
                                     <div className="space-y-6 md:space-y-8">
                                        <label className="flex items-start gap-4 md:gap-6 cursor-pointer group/label">
                                           <div className={cn(
                                              "mt-1 w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0",
                                              form.agreeToTerms ? "bg-navy-950 border-navy-950" : "border-stone-200 group-hover/label:border-gold-500 bg-white"
                                           )}>
                                              {form.agreeToTerms && <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />}
                                              <input type="checkbox" checked={form.agreeToTerms} onChange={e => setForm({...form, agreeToTerms: e.target.checked})} className="hidden" />
                                           </div>
                                           <div className="space-y-1.5 md:space-y-2">
                                              <p className="text-xs md:text-sm font-black text-navy-950 uppercase tracking-widest leading-none group-hover/label:text-gold-600 transition-colors">{activeConfig.labels?.agreeToTerms || "Consent To Mission Protocols"}</p>
                                              <p className="text-[8px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest italic tracking-[0.1em]">Verification of operational standards required_</p>
                                           </div>
                                        </label>

                                        <label className="flex items-start gap-4 md:gap-6 cursor-pointer group/label">
                                           <div className={cn(
                                              "mt-1 w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0",
                                              form.agreeToBackgroundCheck ? "bg-navy-950 border-navy-950" : "border-stone-200 group-hover/label:border-gold-500 bg-white"
                                           )}>
                                              {form.agreeToBackgroundCheck && <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />}
                                              <input type="checkbox" checked={form.agreeToBackgroundCheck} onChange={e => setForm({...form, agreeToBackgroundCheck: e.target.checked})} className="hidden" />
                                           </div>
                                           <div className="space-y-1.5 md:space-y-2">
                                              <p className="text-xs md:text-sm font-black text-navy-950 uppercase tracking-widest leading-none group-hover/label:text-gold-600 transition-colors">{activeConfig.labels?.agreeToBackgroundCheck || "Authorize Background Verification"}</p>
                                              <p className="text-[8px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest italic tracking-[0.1em]">Safety clearance protocol v2.1 enabled_</p>
                                           </div>
                                        </label>
                                     </div>
                                  </div>

                                  {/* STREAMLINED SECURITY BADGE */}
                                  <div className="hidden lg:flex items-center gap-6 md:gap-8 p-5 md:p-6 bg-stone-50 rounded-[1.5rem] md:rounded-[2rem] border border-stone-100">
                                     <div className="flex flex-col items-end text-right">
                                        <p className="text-[9px] md:text-[10px] font-black text-gold-600 uppercase tracking-[0.4em]">SECURE_GATEWAY</p>
                                        <p className="text-[7px] md:text-[8px] font-bold text-stone-400 uppercase tracking-[0.2em] mt-1 md:mt-2 italic leading-none">MOKSHA_SEVA_ENCRYPTION</p>
                                     </div>
                                     <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center border border-stone-100 text-stone-200 shadow-sm">
                                        <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />
                                     </div>
                                  </div>
                               </div>

                               <div className="pt-10 md:pt-16 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
                                  <div className="flex items-center gap-4 md:gap-6 group/status w-full md:w-auto">
                                     <div className={cn(
                                        "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-pulse",
                                        form.agreeToTerms && form.agreeToBackgroundCheck ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-red-400/20"
                                     )}></div>
                                     <div className="text-left">
                                        <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-stone-400 italic mb-1 md:mb-2">Transmission Status_</p>
                                        <p className="text-[9px] md:text-[11px] font-black uppercase text-navy-950 group-hover/status:text-gold-600 transition-colors tracking-widest">{form.agreeToTerms && form.agreeToBackgroundCheck ? "READY_FOR_UPLINK" : "AWAITING_CONSENT_"}</p>
                                     </div>
                                  </div>

                                  <button 
                                     onClick={handleSubmit} 
                                     disabled={loadingSubmit}
                                     className="w-full md:w-auto px-10 md:px-24 py-6 md:py-8 bg-gold-500 text-navy-950 rounded-[1.5rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.6em] transition-all shadow-2xl hover:bg-navy-950 hover:text-white flex items-center justify-center gap-4 md:gap-8 group/btn relative overflow-hidden active:scale-95 disabled:opacity-30"
                                  >
                                     {loadingSubmit ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : (
                                        <>
                                           <span className="relative z-10">INITIALIZE MISSION</span>
                                           <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-3 transition-transform relative z-10" />
                                        </>
                                      )}
                                  </button>
                               </div>
                            </div>
                         </div>
                      </section>
                   </div>
                </main>
             )}
          </div>
       </div>

       {/* GLOBAL MISSION FOOTER */}
       <footer className="py-24 md:py-32 text-center bg-white border-t border-stone-100 mt-24 md:mt-32">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8 md:gap-10">
             <div className="w-16 md:w-20 h-1.5 md:h-2 bg-navy-950 rounded-full"></div>
             <div className="space-y-4 md:space-y-6">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.8em] md:tracking-[1.2em] text-navy-950 italic opacity-20 leading-none">Moksha Sewa Gateway Platform</p>
                <p className="text-[8px] md:text-[10px] font-bold text-stone-300 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Secured Recruitment Infrastructure • Build 1.6.0</p>
             </div>
          </div>
       </footer>
    </div>
  );
}
