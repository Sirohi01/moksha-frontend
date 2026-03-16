"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { tributeConfig } from "@/config/tribute.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function TributePage() {
    const { config, loading, error } = usePageConfig('tribute', tributeConfig);
    
    // Use fallback config if dynamic config is null
    const activeConfig = config || tributeConfig;

    // Handle loading and error states after all hooks
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
            </div>
        );
    }

    if (error) {
        console.error('Failed to load Tribute page config:', error);
        // Fallback to static config
    }

    const families = activeConfig.options.map(option => ({
        ...option,
        icon: getIcon(option.icon)
    }));

    const QuoteIcon = getIcon(activeConfig.quote.icon);

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{activeConfig.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{activeConfig.hero.title} <span className="text-[#7ab800]">{activeConfig.hero.subtitle}</span> {activeConfig.hero.titleSuffix}</h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {activeConfig.hero.description}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Tribute Options Grid */}
            <section className="py-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {families.map((family, i) => (
                            <div key={i} className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-sm hover:translate-y-[-4px] transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#7ab800]/10 transition-colors" />

                                <div className="w-16 h-16 rounded-3xl bg-stone-50 flex items-center justify-center mb-10 group-hover:bg-[#7ab800]/10 transition-colors text-[#7ab800]">
                                    <family.icon size={36} />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-stone-800 leading-none">{family.title}</h3>
                                <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                    {family.desc}
                                </p>

                                <Link href={activeConfig.buttons.donateLink}>
                                    <button className="flex items-center justify-between w-full px-10 py-5 rounded-full bg-stone-900 border border-transparent text-white text-[12px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">
                                        {activeConfig.buttons.sponsorTribute} <ChevronRight size={14} />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Quote / Narrative Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden grayscale group hover:grayscale-0 transition-all duration-700 shadow-2xl">
                                <Image src={activeConfig.quote.imageUrl} alt={activeConfig.quote.imageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                            </div>
                        </div>
                        <div className="md:w-1/2 text-left">
                            <QuoteIcon className="text-[#7ab800] mb-8" size={32} />
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.9] mb-8">{activeConfig.quote.title} <br /><span className="text-[#7ab800]">{activeConfig.quote.subtitle}</span></h2>
                            <p className="text-stone-500 font-medium text-lg leading-relaxed mb-12 italic">
                                &quot;{activeConfig.quote.quote}&quot;
                            </p>
                            <Link href={activeConfig.quote.buttonLink}>
                                <Button className="w-full md:w-auto px-12 py-5 bg-[#7ab800] rounded-full text-[12px] font-black shadow-2xl shadow-[#7ab800]/20">{activeConfig.quote.buttonText}</Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
