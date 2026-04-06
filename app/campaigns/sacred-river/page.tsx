"use client";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { Anchor, ShieldCheck, Mail, Phone, ChevronRight, Droplets, Waves, Flower } from "lucide-react";


export default function SacredRiverPage() {
    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-100">
                    <Image src="/gallery/gallery_cremation_ceremony_1772861295131.png" alt="Sacred River Ceremony" fill className="object-contain" />
                    <div className="absolute inset-0 bg-stone-900/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <Waves className="text-blue-400 mx-auto mb-8 animate-pulse" size={64} />
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8">THE <span className="text-blue-400">SACRED</span> RIVER</h1>
                    <p className="text-stone-300 text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                        Protecting the life of our rivers while honoring the life of our ancestors.
                        Eco-friendly ash immersion and river cleaning initiatives.
                    </p>

                </Container>
            </section>

            {/* Narrative Section */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <Image src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" alt="Clean River" fill className="object-contain" />
                            </div>
                        </div>
                        <div className="md:w-1/2 text-left">
                            <Droplets className="text-blue-500 mb-8" size={32} />
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.9] mb-8">CLEANING THE <br /><span className="text-blue-500">POOLS OF NIRVANA</span></h2>
                            <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                Traditional ash immersion often involves non-biodegradable items that
                                choke our rivers. This campaign focuses on providing eco-friendly
                                &apos;Ash-Immersion Kits&apos; and organizing weekly riverfront cleaning drives
                                led by our Saathis.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex-1 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-blue-600 font-black text-2xl mb-1">500+</p>
                                    <p className="text-blue-400 font-black text-[9px] uppercase tracking-widest">Kgs Waste Removed</p>
                                </div>
                                <div className="flex-1 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-blue-600 font-black text-2xl mb-1">100%</p>
                                    <p className="text-blue-400 font-black text-[9px] uppercase tracking-widest">Eco-Friendly Kits</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
