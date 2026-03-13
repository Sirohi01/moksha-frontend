"use client";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { Tent, ShieldCheck, Mail, Phone, ChevronRight, Heart, Home, HeartPulse } from "lucide-react";


export default function SaathiShelterPage() {
    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-100">
                    <Image src="/gallery/gallery_volunteer_meeting_1772862633347.png" alt="Volunteer Meeting" fill className="object-cover" />
                    <div className="absolute inset-0 bg-stone-900/50" />
                </div>
                <Container className="relative z-10">
                    <div className="max-w-2xl">
                        <Tent className="text-[#7ab800] mb-8" size={64} />
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8">SAATHI <br /><span className="text-[#7ab800]">SHELTER</span></h1>
                        <p className="text-stone-300 text-xl font-medium leading-relaxed mb-12">
                            Our Saathis give everything to the mission. It&apos;s time we provide them
                            with a home, mental health support, and a safety net for their families.
                        </p>

                    </div>
                </Container>
            </section>

            {/* Pillars Section */}
            <section className="py-24">
                <Container>
                    <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-none mb-6">SUPPORTING THOSE <br />WHO <span className="text-[#7ab800]">SERVE</span></h2>
                        <p className="text-stone-500 text-lg font-medium">Being a Saathi is emotionally and physically taxing. The Saathi Shelter campaign provides three pillars of care.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "TRANSIT HOMES", desc: "Safe spaces for volunteers to rest between 24/7 shifts in high-demand cities.", icon: Home },
                            { title: "MENTAL WELLNESS", desc: "Professional counseling and trauma support for the grief they handle daily.", icon: HeartPulse },
                            { title: "FAMILY COVERAGE", desc: "Education and health insurance for the biological families of our full-time Saathis.", icon: ShieldCheck }
                        ].map((pillar, i) => (
                            <div key={i} className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-sm text-center group hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 rounded-3xl bg-stone-50 text-[#7ab800] flex items-center justify-center mx-auto mb-10 group-hover:bg-[#7ab800] group-hover:text-white transition-colors">
                                    <pillar.icon size={32} />
                                </div>
                                <h4 className="font-black text-xl mb-4 tracking-tighter uppercase">{pillar.title}</h4>
                                <p className="text-stone-500 text-sm leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </main>
    );
}
