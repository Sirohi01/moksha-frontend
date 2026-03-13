"use client";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { Globe, ShieldCheck, Mail, Phone, ChevronRight, MapPin, Building, Truck } from "lucide-react";

export default function AdoptACityPage() {
    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-32 relative overflow-hidden text-center">
                <div className="absolute inset-0 opacity-100">
                    <Image 
                        src="/gallery/gallery_ambulance_unit_1772862517482.png" 
                        alt="Ambulance Response Unit" 
                        fill 
                        sizes="100vw"
                        className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-stone-900/50" />
                </div>
                <Container className="relative z-10">
                    <Globe className="text-[#7ab800] mx-auto mb-8 animate-spin-slow" size={64} />
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8">ADOPT A <span className="text-[#7ab800]">CITY</span></h1>
                    <p className="text-stone-300 text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                        An institutional scale initiative for corporations and visionaries to own the
                        entire lifecycle of dignity within a specific geographic region.
                    </p>
                </Container>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 border-b border-stone-200 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <p className="text-[#7ab800] font-black text-[11px] uppercase tracking-[0.4em] mb-4">THE OPERATIONAL STACK</p>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85]">WHAT HAPPENS WHEN YOU ADOPT?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center p-8 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-inner">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#7ab800] mb-8">
                                <Truck size={32} />
                            </div>
                            <h4 className="font-black text-xl mb-4 tracking-tighter uppercase">RESPONSE LOGISTICS</h4>
                            <p className="text-stone-500 text-sm leading-relaxed">Fuel, maintenance, and driver insurance for a dedicated 24/7 Response Ambulance.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-inner">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#7ab800] mb-8">
                                <Building size={32} />
                            </div>
                            <h4 className="font-black text-xl mb-4 tracking-tighter uppercase">PERMANENT HUD</h4>
                            <p className="text-stone-500 text-sm leading-relaxed">A specialized &apos;Moksha Kendra&apos; for storage of materials and volunteer coordination.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-8 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-inner">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#7ab800] mb-8">
                                <MapPin size={32} />
                            </div>
                            <h4 className="font-black text-xl mb-4 tracking-tighter uppercase">REGIONAL IMPACT</h4>
                            <p className="text-stone-500 text-sm leading-relaxed">Coverage for 100% of unclaimed or underprivileged cases within city limits.</p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Locations Section */}
            <section className="py-24">
                <Container>
                    <div className="bg-stone-900 rounded-[4rem] p-12 md:p-20 text-white flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
                        <div className="lg:w-1/2 relative z-10">
                            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">CITIES <span className="text-[#7ab800] italic">AVAILABLE</span> FOR ADOPTION</h2>
                            <p className="text-stone-400 font-medium text-lg leading-relaxed mb-12">
                                We have identified 6 high-demand cities where infrastructure is currently
                                exhausted. You can become the primary patron for these regions.
                            </p>
                            <div className="space-y-4">
                                {["Kanpur", "Nashik", "Guwahati", "Indore"].map(city => (
                                    <div key={city} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                                        <p className="font-black uppercase tracking-widest text-sm">{city}</p>
                                        <ChevronRight size={20} className="text-[#7ab800] group-hover:translate-x-2 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative z-10">
                            <div className="aspect-square bg-[#7ab800]/5 rounded-full border border-[#7ab800]/10 p-12 flex items-center justify-center shadow-[0_0_100px_rgba(122,184,0,0.1)]">
                                <div className="text-center">
                                    <p className="text-7xl font-black tracking-tighter text-white mb-2 leading-none">12</p>
                                    <p className="text-[#7ab800] font-black text-xs uppercase tracking-[0.4em]">CITIES ALREADY SAFE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
