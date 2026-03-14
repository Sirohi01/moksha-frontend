"use client";
import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { legacyGivingConfig } from "@/config/legacy-giving.config";
import { getIcon } from "@/config/icons.config";

export default function LegacyGivingPage() {
    const options = legacyGivingConfig.options.map(option => ({
        ...option,
        icon: getIcon(option.icon)
    }));

    const MessageIcon = getIcon(legacyGivingConfig.message.icon);

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{legacyGivingConfig.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{legacyGivingConfig.hero.title} <span className="text-[#7ab800]">{legacyGivingConfig.hero.subtitle}</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {legacyGivingConfig.hero.description}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Options Grid */}
            <section className="py-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {options.map((option, i) => (
                            <div key={i} className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-sm hover:translate-y-[-4px] transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#7ab800]/10 transition-colors" />

                                <div className="w-16 h-16 rounded-3xl bg-stone-50 flex items-center justify-center mb-10 group-hover:bg-[#7ab800]/10 transition-colors text-[#7ab800]">
                                    <option.icon size={36} />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-stone-800 leading-none">{option.title}</h3>
                                <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                    {option.desc}
                                </p>

                                <Link href={legacyGivingConfig.buttons.requestInfoLink}>
                                    <button className="flex items-center gap-4 px-10 py-4 rounded-full bg-stone-50 text-[11px] font-black uppercase tracking-widest text-[#7ab800] hover:bg-[#7ab800] hover:text-white transition-all group-hover:bg-[#7ab800]/5 group-hover:text-[#7ab800]">
                                        {legacyGivingConfig.buttons.requestInfoPack} <ChevronRight size={14} />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Personal Message */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto p-12 md:p-20 bg-[#7ab800] rounded-[5rem] text-center shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-10 shadow-lg relative z-10">
                            <MessageIcon className="text-[#7ab800]" size={40} />
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.85] mb-8">{legacyGivingConfig.message.title} <br />{legacyGivingConfig.message.subtitle} <span className="opacity-60 text-stone-900 italic">{legacyGivingConfig.message.subtitleHighlight}</span></h2>
                        <p className="text-white font-medium text-xl leading-relaxed mb-12">
                            {legacyGivingConfig.message.description}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href={legacyGivingConfig.message.buttons.talkToFounderLink}>
                                <button className="bg-stone-900 text-white px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-stone-900/10 hover:bg-stone-800 transition-all">{legacyGivingConfig.message.buttons.talkToFounder}</button>
                            </Link>
                            <Link href={legacyGivingConfig.message.buttons.downloadPDFLink}>
                                <button className="bg-white text-[#7ab800] px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl transition-all hover:bg-stone-50">{legacyGivingConfig.message.buttons.downloadPDF}</button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
