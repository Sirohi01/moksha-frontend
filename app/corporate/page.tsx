"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { getSafeSrc } from "@/lib/utils";
import { corporateConfig } from "@/config/corporate.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function CorporatePage() {
    const { config, loading, error } = usePageConfig('corporate', corporateConfig);
    
    // Use fallback config if dynamic config is null
    const activeConfig = config || corporateConfig;

    // Handle loading and error states after all hooks
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
            </div>
        );
    }

    if (error) {
        console.error('Failed to load Corporate page config:', error);
        // Fallback to static config
    }

    const models = activeConfig.models.map(model => ({
        ...model,
        icon: getIcon(model.icon)
    }));

    const TrustIcon = getIcon(activeConfig.trust.icon);

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{activeConfig.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{activeConfig.hero.title} <br /><span className="text-[#7ab800]">{activeConfig.hero.subtitle}</span> {activeConfig.hero.partnersText}</h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {activeConfig.hero.description}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Models Grid */}
            <section className="py-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {models.map((model, i) => (
                            <div key={i} className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-sm hover:translate-y-[-4px] transition-all group overflow-hidden relative text-left">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#7ab800]/10 transition-colors" />

                                <div className="w-16 h-16 rounded-3xl bg-stone-50 flex items-center justify-center mb-10 group-hover:bg-[#7ab800]/10 transition-colors text-[#7ab800]">
                                    <model.icon size={36} />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-stone-800 leading-none">{model.title}</h3>
                                <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                    {model.desc}
                                </p>

                                <Link href={activeConfig.buttons.contactLink}>
                                    <button className="flex items-center justify-between w-full px-10 py-5 rounded-full bg-stone-900 border border-transparent text-white text-[12px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">
                                        {activeConfig.buttons.getPartnershipDeck} <ChevronRight size={14} />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-stone-100">
                <Container>
                    <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-[4rem] p-12 md:p-20 border border-stone-200 shadow-xl text-left overflow-hidden relative">
                        <div className="lg:w-1/2">
                            <TrustIcon className="text-[#7ab800] mb-8" size={64} />
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85] mb-8">{activeConfig.trust.title} <span className="text-[#7ab800]">{activeConfig.trust.subtitle}</span> {activeConfig.trust.forCSRText}</h2>
                            <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                {activeConfig.trust.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                    <p className="text-[#7ab800] text-3xl font-black mb-1">{activeConfig.trust.certifications.taxExemption.value}</p>
                                    <p className="text-stone-400 font-black text-[9px] uppercase tracking-widest">{activeConfig.trust.certifications.taxExemption.label}</p>
                                </div>
                                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                    <p className="text-[#7ab800] text-3xl font-black mb-1">{activeConfig.trust.certifications.permanentReg.value}</p>
                                    <p className="text-stone-400 font-black text-[9px] uppercase tracking-widest">{activeConfig.trust.certifications.permanentReg.label}</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="aspect-[3/2] md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl relative group">
                                <Image src={getSafeSrc(activeConfig.trust.imageUrl)} alt={activeConfig.trust.imageAlt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                                    <Link href={activeConfig.trust.videoButtonLink}>
                                        <button className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-[#7ab800] shadow-2xl hover:scale-110 transition-all">
                                            <ChevronRight size={32} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
