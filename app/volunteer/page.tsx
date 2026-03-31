"use client";
import { useState, useRef, useEffect } from "react";
import { Container } from "@/components/ui/Elements";
import { InputField, TextareaField, SelectField } from "@/components/ui/FormFields";
import Button from "@/components/ui/Button";
import EmailVerification from "@/components/ui/EmailVerification";
import MobileVerification from "@/components/ui/MobileVerification";
import { cn } from "@/lib/utils";
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
    <div className="flex flex-col gap-4 mb-10 group/title">
       <div className="flex items-center gap-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-lg group-hover/title:bg-gold-500 transition-all duration-500 border border-zinc-800">
             {Icon ? <Icon className="w-4 h-4" /> : <span className="text-xs font-black italic">0{num}</span>}
          </div>
          <div className="flex-1 h-px bg-zinc-50"></div>
       </div>
       <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-zinc-950 italic leading-none">{title}</h3>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-40 selection:bg-gold-200 antialiased">
       {/* CINEMATIC PERFORMANCE HEADER */}
       <div className="py-2.5 px-8 md:px-16 bg-white sticky top-0 z-50 transition-all duration-500 border-b border-zinc-50 backdrop-blur-xl bg-white/95">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-12">
             <div className="flex items-center gap-6">
                <div className="w-1 h-6 bg-zinc-950 rounded-full"></div>
                <div className="space-y-0.5">
                   <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gold-600 leading-none">{activeConfig.hero?.badge || "JOIN US"}</p>
                   <h1 className="text-lg md:text-xl font-black text-zinc-950 italic tracking-tighter leading-none uppercase">{activeConfig.hero?.title}</h1>
                </div>
             </div>
             <div className="hidden lg:flex items-center gap-12">
{/* <button 
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="flex items-center gap-3 px-6 py-2 bg-zinc-50 hover:bg-zinc-950 hover:text-white rounded-full transition-all border border-zinc-100 group/preview"
                >
                   <Eye className={cn("w-4 h-4 transition-transform", showLivePreview ? "text-gold-500 scale-125" : "text-zinc-300")} />
                   <span className="text-[9px] font-black uppercase tracking-widest leading-none">Live Credential {showLivePreview ? 'Active' : 'Preview'}</span>
                </button> */}
                <div className="text-right">
                   <div className="text-[10px] font-black text-emerald-600 flex items-center justify-end gap-2 italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 
                      GATEWAY_SYNC_ACTIVE
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-[1600px] mx-auto px-6 mt-4 relative">
          
          {/* LIVE I-CARD PREVIEW - STICKY TACTICAL SIDEBAR */}
          <div className={cn(
             "hidden lg:block fixed left-16 top-32 w-80 transition-all duration-1000 z-40 transform translate-y-0",
             showLivePreview ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20 pointer-events-none"
          )}>
             <div className="bg-white p-4 rounded-[2.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.1)] border border-stone-100 relative overflow-hidden backdrop-blur-xl">
                 <div className="mb-4 flex items-center justify-between px-4">
                    <span className="text-[8px] font-black text-gold-600 uppercase tracking-[0.4em] italic">Live Credentialing_</span>
                    <ShieldAlert className="w-3.5 h-3.5 text-zinc-300" />
                 </div>
                 {/* ID CARD REPLICA */}
                 <div className="w-full aspect-[2/3] bg-stone-50 rounded-[1.8rem] overflow-hidden border border-stone-200 relative shadow-inner">
                    <div className="h-1/5 bg-zinc-950 flex flex-col items-center justify-center p-4">
                       <h4 className="text-[10px] font-black text-gold-500 tracking-[0.4em] leading-none mb-1">MOKSHA SEWA</h4>
                       <p className="text-[6px] text-stone-500 uppercase tracking-widest font-black">Regional Unit Manifest</p>
                    </div>
                    <div className="p-6 space-y-6 flex flex-col items-center">
                       <div className="w-32 h-40 bg-white border-4 border-white rounded-2xl shadow-xl overflow-hidden mt-[-20px] transition-all duration-700 bg-zinc-100 flex items-center justify-center grayscale hover:grayscale-0">
                          {profilePhoto ? (
                             <img src={profilePhoto} className="w-full h-full object-cover" alt="ID" />
                          ) : (
                             <Camera className="w-8 h-8 text-stone-200" />
                          )}
                       </div>
                       <div className="text-center space-y-2">
                          <h5 className="text-sm font-black text-zinc-950 uppercase italic leading-tight line-clamp-2 h-10 flex items-center justify-center underline decoration-gold-500 decoration-2 underline-offset-4">{form.name || 'YOUR LEGAL NAME'}</h5>
                          <span className="inline-block px-3 py-1 bg-gold-50 text-gold-600 text-[8px] font-black tracking-widest rounded-full border border-gold-100">{form.registrationType === 'group' ? 'TASKFORCE LEADER' : 'AUTHORISED AGENT'}</span>
                       </div>
                       <div className="w-full space-y-3 pt-2">
                          <div className="border-b border-stone-100 pb-1">
                             <p className="text-[6px] font-black text-stone-400 uppercase tracking-widest">ID SIG_</p>
                             <p className="text-[9px] font-black text-zinc-950 italic">VOL-2026-TRIAL</p>
                          </div>
                          <div className="border-b border-stone-100 pb-1">
                             <p className="text-[6px] font-black text-stone-400 uppercase tracking-widest">REGIONAL HUB_</p>
                             <p className="text-[9px] font-black text-zinc-950 italic">{form.city || 'PENDING'}, {form.state || 'COORD'}</p>
                          </div>
                       </div>
                    </div>
                    <div className="absolute bottom-0 w-full h-10 bg-zinc-950 flex items-center justify-center">
                       <p className="text-[8px] font-black text-white/50 tracking-[0.4em]">AUTHENTICITY_PENDING</p>
                    </div>
                 </div>
                 <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-stone-50 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center"><Info className="w-3.5 h-3.5 text-stone-500" /></div>
                    <p className="text-[7px] font-bold text-stone-400 uppercase tracking-widest leading-relaxed italic">Credential shifts synchronize in real-time as data is entered.</p>
                 </div>
             </div>
          </div>

          <div className={cn(
             "max-w-[1700px] mx-auto transition-all duration-1000",
             showLivePreview ? "lg:translate-x-56" : "translate-x-0"
          )}>
             {loading ? <div className="py-10"><FormSkeleton /></div> : (
                <main>
                   <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-stone-50 space-y-16">
                      
                      {/* S1: IDENTITY IDENTIFICATION */}
                      <section className="space-y-10 animate-in fade-in duration-1000">
                         <SectionTitle num={1} title={activeConfig.sections?.[0]?.title || "Identity Matrix"} icon={Camera} />
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div 
                               className="w-full aspect-video bg-zinc-50 rounded-[2.5rem] border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-zinc-100 hover:border-gold-300 transition-all duration-700 group relative shadow-inner"
                               onClick={() => photoFileInput.current?.click()}
                            >
                               {profilePhoto ? (
                                  <img src={profilePhoto} className="w-full h-full object-cover transition-all duration-700 grayscale hover:grayscale-0 shadow-2xl" alt="Identity" />
                               ) : (
                                  <div className="text-center font-black uppercase tracking-widest text-zinc-300 text-xs space-y-6 p-10">
                                     <Camera className="w-10 h-10 mx-auto text-zinc-100 group-hover:text-gold-400 transition-all duration-700" /> 
                                     <div className="leading-tight opacity-50 text-[10px]">Upload Individual Identity</div>
                                     <p className="text-[8px] font-black text-gold-500 italic">Institutional I-Card Format</p>
                                  </div>
                               )}
                               <input type="file" ref={photoFileInput} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                               {profilePhoto && (
                                  <div className="absolute top-6 right-6 p-4 bg-zinc-950/20 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                      <p className="text-[8px] font-black text-white uppercase tracking-widest">Change Photo_</p>
                                  </div>
                               )}
                            </div>
                            <div className="space-y-8">
                               <div className="p-10 bg-zinc-950 rounded-[2.5rem] text-white relative overflow-hidden group/card shadow-3xl border border-zinc-800">
                                  <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 blur-[100px] rounded-full -mr-40 -mt-40 transition-all duration-1000 group-hover/card:bg-gold-400/20"></div>
                                  <div className="relative z-10 space-y-8">
                                     <div className="flex items-center gap-4 text-gold-500 border-b border-white/10 pb-4">
                                        <div className="w-1 h-6 bg-gold-400"></div>
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] italic">Visual Identity Policy</h5>
                                     </div>
                                     <p className="text-sm text-zinc-400 leading-relaxed font-bold italic normal-case">Identity visuals are mandatory for high-security regional credentials. Ensure clarity for institutional authorization.</p>
                                     <div className="flex items-center gap-4 py-2 opacity-50">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[8px] font-black tracking-[0.3em] uppercase">Auth_Signature_Active</span>
                                     </div>
                                  </div>
                               </div>
                               <button 
                                  onClick={() => photoFileInput.current?.click()}
                                  className="w-full py-5 bg-white text-zinc-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-zinc-950 hover:text-white transition-all duration-500 flex items-center justify-center gap-6 border-2 border-zinc-100 shadow-xl"
                               >
                                  <Upload className="w-4 h-4" /> UPLOAD_BIO_SIGNAL
                                </button>
                            </div>
                         </div>
                      </section>

                      {/* S2: VOLUNTEER CATEGORIES */}
                      <section className="space-y-8 md:space-y-12 pt-10 border-t border-zinc-50">
                         <SectionTitle num={2} title={activeConfig.labels?.selectVolunteerTypes || "Engagement Directive"} icon={Users} />
                         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                            {volunteerTypes.map((v) => {
                               const Icon = v.icon;
                               const active = selectedTypes.includes(v.value);
                               return (
                                  <button 
                                     key={v.value} 
                                     onClick={() => setSelectedTypes(p => active ? p.filter(x => x !== v.value) : [...p, v.value])}
                                     className={cn(
                                        "p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-4 text-left transition-all duration-700 relative flex flex-col gap-4 md:gap-6 group/unit",
                                        active ? "bg-zinc-950 border-zinc-900 text-white shadow-2xl scale-[1.02]" : "bg-white border-zinc-50 hover:border-gold-300"
                                     )}
                                  >
                                     <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-md", active ? "bg-white/10" : "bg-zinc-50 text-zinc-300 group-hover/unit:text-gold-500")}>
                                        <Icon className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest italic leading-tight mb-1">{v.label}</h4>
                                        <p className={cn("text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] leading-none", active ? "text-gold-400" : "text-zinc-400")}>{v.commitment}</p>
                                     </div>
                                     {active && <div className="absolute top-4 right-4 md:top-6 md:right-6 w-4 h-4 md:w-5 md:h-5 bg-gold-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-0 duration-500"><CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5 text-zinc-950" /></div>}
                                  </button>
                               );
                            })}
                         </div>
                      </section>

                      {/* S3: FORMATION CONTROL */}
                      <section className="space-y-8 md:space-y-12 pt-10 border-t border-zinc-50">
                         <SectionTitle num={3} title={activeConfig.labels?.registrationType || "Personnel Matrix"} icon={ShieldCheck} />
                         <div className="flex flex-col sm:flex-row gap-4">
                            {['individual', 'group'].map((t) => (
                               <button 
                                  key={t} onClick={() => setForm({...form, registrationType: t})}
                                  className={cn(
                                     "flex-1 py-4 md:py-5 px-6 md:px-10 rounded-xl md:rounded-2xl border-2 md:border-4 font-black text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] italic flex items-center justify-center gap-4 md:gap-6 transition-all duration-700 shadow-sm",
                                     form.registrationType === t ? "bg-zinc-950 border-zinc-900 text-white scale-[1.01] shadow-xl" : "bg-white border-zinc-50 text-zinc-300 hover:border-gold-300"
                                  )}
                               >
                                  {t === 'individual' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Users className="w-4 h-4 md:w-5 md:h-5" />}
                                  {activeConfig.registrationTypes?.[t as keyof typeof activeConfig.registrationTypes]?.title || t}
                               </button>
                            ))}
                         </div>

                         {form.registrationType === 'group' && (
                            <div className="p-6 md:p-14 bg-zinc-50 rounded-[2rem] md:rounded-[3.5rem] border-2 md:border-4 border-zinc-50 mt-6 md:border-zinc-50 mt-8 space-y-10 md:space-y-14 animate-in slide-in-from-top-12 duration-1000 shadow-inner">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                  <InputField label={activeConfig.labels?.groupName} value={form.groupName} onChange={e => setForm({...form, groupName: e.target.value})} placeholder={activeConfig.placeholders?.groupName} required className="py-5 md:py-6 text-lg md:text-xl tracking-tighter" />
                                  <SelectField label={activeConfig.labels?.groupType} options={activeConfig.selectOptions?.groupTypes || []} value={form.groupType} onChange={e => setForm({...form, groupType: e.target.value})} required className="py-5 md:py-6" />
                               </div>
                               <div className="space-y-10 md:space-y-12">
                                  <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-950 -mx-6 md:-mx-14 px-8 md:px-10 py-6 md:py-8 shadow-2xl relative gap-6">
                                     <div className="absolute top-0 bottom-0 left-0 w-1 md:w-2 bg-gold-500"></div>
                                     <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                                          <Users className="w-5 h-5 md:w-6 md:h-6 text-gold-500" />
                                          <div className="space-y-1 text-left">
                                             <h4 className="text-[9px] md:text-[10px] font-black italic uppercase tracking-[0.5em] md:tracking-[0.8em] text-gold-500 leading-none">Taskforce Manifest</h4>
                                             <p className="text-[7px] font-bold text-white/30 uppercase tracking-[0.4em]">Unit Identity Enumeration</p>
                                          </div>
                                     </div>
                                     <button onClick={addMember} className="flex items-center justify-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-black uppercase text-white hover:text-gold-400 transition-all font-bold tracking-[0.2em] md:tracking-[0.3em] border-2 border-white/10 px-4 md:px-6 py-2 rounded-xl hover:border-gold-500 w-full md:w-auto"><Plus className="w-3 h-3 md:w-4 md:h-4" /> ENLIST_MEMBER</button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                                     {groupMembers.map((member, idx) => (
                                        <div key={idx} className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-3xl border border-zinc-100 flex flex-col gap-6 md:gap-10 relative group/member animate-in zoom-in-95 transition-all hover:border-gold-300">
                                           <button onClick={() => removeMember(idx)} className="absolute top-6 right-6 md:top-10 md:right-10 text-zinc-200 hover:text-red-500 transition-all transform hover:rotate-90 duration-500"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                                           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
                                              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-50 rounded-xl md:rounded-2xl border-2 md:border-4 border-dashed border-zinc-100 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer shadow-inner hover:border-gold-400 transition-all" onClick={() => document.getElementById(`m-${idx}`)?.click()}>
                                                 {member.photo ? <img src={member.photo} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 md:w-8 md:h-8 text-zinc-100" />}
                                                 <input id={`m-${idx}`} type="file" onChange={(e) => handlePhotoUpload(e, idx)} className="hidden" accept="image/*" />
                                              </div>
                                              <div className="flex-1 w-full">
                                                 <InputField label="Identity Name" value={member.name} onChange={e => updateMember(idx, 'name', e.target.value)} required placeholder="Full Legal Name" className="text-base md:text-lg italic" />
                                              </div>
                                           </div>
                                           <div className="grid grid-cols-1 gap-6 md:gap-8 pt-4 border-t border-zinc-50 w-full">
                                                 <InputField label="Operational Role" value={member.role} onChange={e => updateMember(idx, 'role', e.target.value)} required placeholder="e.g. Field Coordinator" />
                                                 <InputField label="Digital Uplink" value={member.contact} onChange={e => updateMember(idx, 'contact', e.target.value)} required placeholder="Phone or Email" className="font-mono" />
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         )}
                      </section>

                      {/* S4: PERSONAL MATRIX */}
                      <section className="space-y-10 md:space-y-16 pt-10 border-t border-zinc-50">
                         <SectionTitle num={4} title={activeConfig.sections?.[0]?.title || "Identity Matrix"} icon={User} />
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 md:gap-12 items-end">
                            <div className="sm:col-span-2 xl:col-span-2">
                               <InputField 
                                 label={activeConfig.labels?.fullName} 
                                 value={form.name} 
                                 onChange={e => setForm({...form, name: e.target.value})}
                                 required 
                                 placeholder={activeConfig.placeholders?.fullName}
                                 className="text-xl md:text-3xl font-black italic tracking-tighter py-6 md:py-8 leading-none bg-stone-50/30"
                               />
                            </div>
                            <SelectField label={activeConfig.labels?.gender} options={activeConfig.selectOptions?.genders || []} value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required className="py-5 md:py-6" />
                            <InputField label={activeConfig.labels?.dateOfBirth} type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} required className="py-5 md:py-6" />
                            
                            <div className="space-y-4 sm:col-span-1 xl:col-span-1">
                               <InputField label={activeConfig.labels?.emailAddress} value={form.email} onChange={e => {setForm({...form, email: e.target.value}); setIsEmailVerified(false)}} disabled={isEmailVerified} placeholder={activeConfig.placeholders?.email} required />
                               {form.email && !isEmailVerified && <EmailVerification email={form.email} onVerified={setIsEmailVerified} />}
                            </div>
                            <div className="space-y-4 sm:col-span-1 xl:col-span-1">
                               <InputField label={activeConfig.labels?.phoneNumber} value={form.phone} onChange={e => {setForm({...form, phone: e.target.value}); setIsMobileVerified(false)}} disabled={isMobileVerified} required className="font-mono font-black placeholder:text-zinc-100" placeholder="9876543210" />
                               {form.phone && !isMobileVerified && <MobileVerification mobile={form.phone} onVerified={setIsMobileVerified} />}
                            </div>
                         </div>

                         <div className="pt-8 md:pt-10 border-t border-zinc-50 space-y-10 md:space-y-12">
                            <TextareaField 
                               label={activeConfig.labels?.completeAddress} 
                               value={form.address} 
                               onChange={e => setForm({...form, address: e.target.value})}
                               required 
                               placeholder={activeConfig.placeholders?.completeAddress} 
                               className="min-h-[100px] md:min-h-[120px] text-base md:text-lg font-bold"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                               <InputField label={activeConfig.labels?.city} value={form.city} onChange={e => setForm({...form, city: e.target.value})} required placeholder={activeConfig.placeholders?.city} />
                               <SelectField label={activeConfig.labels?.state} options={(activeConfig.selectOptions?.states || []).map(s => ({value: s, label: s}))} value={form.state} onChange={e => setForm({...form, state: e.target.value})} required />
                               <InputField label={activeConfig.labels?.pinCode} value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="font-mono" placeholder={activeConfig.placeholders?.pinCode} />
                            </div>
                         </div>
                      </section>
                      {/* S5: BRIEFING LOGISTICS */}
                      <section className="space-y-12 md:space-y-16 pt-10 border-t border-zinc-50">
                         <SectionTitle num={5} title={activeConfig.sections?.[2]?.title || "Briefing Matrix"} icon={Briefcase} />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                            <InputField label={activeConfig.labels?.currentOccupation} value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} required placeholder={activeConfig.placeholders?.occupation} />
                            <SelectField label={activeConfig.labels?.experienceLevel} options={activeConfig.selectOptions?.experienceLevels || []} value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} required />
                            <div className="md:col-span-2">
                               <TextareaField label={activeConfig.labels?.specialSkills} value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder={activeConfig.placeholders?.skills} />
                            </div>
                         </div>
                      </section>

                      {/* S6: MISSION COMMITMENT & AUTHORIZATION */}
                      <section className="space-y-12 md:space-y-16 pt-10 border-t border-zinc-50">
                         <SectionTitle num={6} title={activeConfig.sections?.[4]?.title || "Mission Commitment"} icon={Activity} />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                            <SelectField label={activeConfig.labels?.availability} options={activeConfig.selectOptions?.availabilityOptions || []} value={form.availability} onChange={e => setForm({...form, availability: e.target.value})} required />
                            <InputField label={activeConfig.labels?.preferredLocation} value={form.preferredLocation} onChange={e => setForm({...form, preferredLocation: e.target.value})} placeholder={activeConfig.placeholders?.preferredLocation} />
                            <div className="md:col-span-2">
                               <TextareaField label={activeConfig.labels?.whyVolunteer} value={form.whyVolunteer} onChange={e => setForm({...form, whyVolunteer: e.target.value})} required placeholder={activeConfig.placeholders?.whyVolunteerPlaceholder} className="min-h-[120px]" />
                            </div>
                         </div>

                         {/* ACTION ZONE: MISSION UPLINK COMMAND */}
                         <div className="relative mt-16 md:mt-24 rounded-[2rem] md:rounded-[3rem] overflow-hidden group/uplink bg-white border-2 border-zinc-100/80 shadow-2xl shadow-zinc-200/20">
                            {/* Subtle Interactive Glow */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-400/[0.03] blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover/uplink:bg-gold-400/[0.08]"></div>
                            
                            <div className="px-8 md:px-14 py-12 md:py-16 space-y-12 md:space-y-16 relative">
                               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-10">
                                  <div className="space-y-8 max-w-xl">
                                     <div className="flex items-center gap-4 text-gold-600 mb-4">
                                        <div className="w-1.5 h-5 bg-gold-500 rounded-full"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Mission Authorization Protocol</h4>
                                     </div>
                                     
                                     <div className="space-y-6">
                                        <label className="flex items-start gap-5 cursor-pointer group/label">
                                           <div className={cn(
                                              "mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0",
                                              form.agreeToTerms ? "bg-zinc-950 border-zinc-950" : "border-zinc-200 group-hover/label:border-gold-500 bg-white"
                                           )}>
                                              {form.agreeToTerms && <CheckCircle className="w-4 h-4 text-gold-500" />}
                                              <input type="checkbox" checked={form.agreeToTerms} onChange={e => setForm({...form, agreeToTerms: e.target.checked})} className="hidden" />
                                           </div>
                                           <div className="space-y-1.5">
                                              <p className="text-[10px] md:text-[11px] font-black text-zinc-950 uppercase tracking-widest leading-none group-hover/label:text-gold-600 transition-colors">{activeConfig.labels?.agreeToTerms || "Consent To Mission Protocols"}</p>
                                              <p className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest italic">Institutional Verification Required_</p>
                                           </div>
                                        </label>

                                        <label className="flex items-start gap-5 cursor-pointer group/label">
                                           <div className={cn(
                                              "mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0",
                                              form.agreeToBackgroundCheck ? "bg-zinc-950 border-zinc-950" : "border-zinc-200 group-hover/label:border-gold-500 bg-white"
                                           )}>
                                              {form.agreeToBackgroundCheck && <CheckCircle className="w-4 h-4 text-gold-500" />}
                                              <input type="checkbox" checked={form.agreeToBackgroundCheck} onChange={e => setForm({...form, agreeToBackgroundCheck: e.target.checked})} className="hidden" />
                                           </div>
                                           <div className="space-y-1.5">
                                              <p className="text-[10px] md:text-[11px] font-black text-zinc-950 uppercase tracking-widest leading-none group-hover/label:text-gold-600 transition-colors">{activeConfig.labels?.agreeToBackgroundCheck || "Authorize Background Verification"}</p>
                                              <p className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest italic">Operational Safety Protocol v1.6_</p>
                                           </div>
                                        </label>
                                     </div>
                                  </div>

                                  {/* STREAMLINED SECURITY BADGE */}
                                  <div className="hidden lg:flex items-center gap-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                     <div className="flex flex-col items-end text-right">
                                        <p className="text-[8px] font-black text-gold-600 uppercase tracking-[0.3em]">SECURE_GATEWAY</p>
                                        <p className="text-[6px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1 italic leading-none">Regional Unit Manifest</p>
                                     </div>
                                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-zinc-100 text-zinc-400 shadow-sm">
                                        <Fingerprint className="w-5 h-5" />
                                     </div>
                                  </div>
                               </div>

                               <div className="pt-10 md:pt-12 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-10">
                                  <div className="flex items-center gap-5 group/status">
                                     <div className={cn(
                                        "w-2.5 h-2.5 rounded-full animate-pulse",
                                        form.agreeToTerms && form.agreeToBackgroundCheck ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-red-400/20"
                                     )}></div>
                                     <div className="text-left">
                                        <p className="text-[7px] font-black uppercase tracking-[0.3em] text-zinc-400 italic mb-1">Status_</p>
                                        <p className="text-[9px] font-black uppercase text-zinc-900 group-hover/status:text-gold-600 transition-colors">{form.agreeToTerms && form.agreeToBackgroundCheck ? "Ready For Final Uplink" : "Waiting For Authorization_"}</p>
                                     </div>
                                  </div>

                                  <button 
                                     onClick={handleSubmit} 
                                     disabled={loadingSubmit}
                                     className="w-full md:w-auto px-12 md:px-20 py-5 md:py-7 bg-gold-500 text-zinc-950 rounded-xl md:rounded-2xl font-black text-xs md:text-[13px] uppercase tracking-[0.4em] md:tracking-[0.6em] transition-all shadow-xl hover:bg-zinc-950 hover:text-white flex items-center justify-center gap-6 group/btn relative overflow-hidden active:scale-95 disabled:opacity-30"
                                  >
                                     {loadingSubmit ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                           <span className="relative z-10">Initialize Manifest</span>
                                           <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform relative z-10" />
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
       <footer className="py-24 md:py-32 text-center bg-white border-t border-zinc-50 mt-24 md:mt-32">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8 md:gap-10">
             <div className="w-16 h-1.5 bg-zinc-950 rounded-full"></div>
             <div className="space-y-4">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[1em] md:tracking-[1.2em] text-zinc-950 italic opacity-20 leading-none">Moksha Sewa Gateway Platform</p>
                <p className="text-[7px] md:text-[8px] font-bold text-stone-300 uppercase tracking-widest italic leading-none">Secured Operational Recruitment Interface • Unit 1.6.0</p>
             </div>
          </div>
       </footer>
    </div>
  );
}
