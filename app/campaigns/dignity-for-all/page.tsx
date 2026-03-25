"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { Heart, ShieldCheck, Mail, Phone, ChevronRight, Activity, Users, Globe } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DignityForAllPage() {
    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-100">
                    <Image src="/gallery/gallery_peaceful_departure_1772861335733.png" alt="Dignity in Departure" fill className="object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40" />
                </div>
                <Container className="relative z-10">
                    <div className="max-w-2xl">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/20 border border-[#7ab800]/40 mb-6 backdrop-blur-md">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">CORE CAMPAIGN 2024</p>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8">DIGNITY <br /><span className="text-[#7ab800]">FOR ALL</span></h1>
                        <p className="text-white text-xl font-medium leading-relaxed mb-10">
                            The fundamental pillar of Moksha Sewa. Our pledge to never let a single soul
                            leave this world forgotten, unnamed, or without a sacred ritual.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Campaign Details */}
            <section className="py-24">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-stone-800 mb-8 border-b border-stone-200 pb-4">WHY THIS MATTERS</h2>
                            <div className="prose prose-stone max-w-none text-stone-600 text-lg leading-relaxed space-y-8">
                                <p>
                                    In our rapidly advancing society, thousands die every year on the streets,
                                    unclaimed by families or forgotten by the systems meant to protect them.
                                    History will judge us by how we treated those who could do nothing for us.
                                </p>
                                <p className="font-bold text-stone-800 italic border-l-4 border-[#7ab800] pl-6">
                                    &quot;A funeral is not for the dead, it is a statement of our humanity for the living.&quot;
                                </p>
                                <p>
                                    This campaign funds the entire lifecycle of a response: from the moment we
                                    receive a call, to the legal documentation, the transport, and finally
                                    the sacred fire of the cremation or the prayer of the burial.
                                </p>
                            </div>

                            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm">
                                    <ShieldCheck className="text-[#7ab800] mb-4" size={32} />
                                    <h4 className="font-black uppercase tracking-tighter text-xl mb-2">Legal Verification</h4>
                                    <p className="text-stone-500 text-sm">We ensure 100% compliance with police protocols and municipal records.</p>
                                </div>
                                <div className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm">
                                    <Users className="text-[#7ab800] mb-4" size={32} />
                                    <h4 className="font-black uppercase tracking-tighter text-xl mb-2">Full Ritual Support</h4>
                                    <p className="text-stone-500 text-sm">Every soul is treated as family, with the specific religious rites they deserve.</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Live Impact */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/10 rounded-full blur-3xl" />
                                    <h3 className="text-xl font-black uppercase tracking-widest mb-8 leading-none">CAMPAIGN GOAL</h3>
                                    <div className="mb-4 flex items-end justify-between">
                                        <p className="text-4xl font-black tracking-tighter">₹45,00,000</p>
                                        <p className="text-[#7ab800] font-black text-xs uppercase tracking-widest mb-1">68% REACHED</p>
                                    </div>
                                    <div className="w-full h-3 bg-white/10 rounded-full mb-10 overflow-hidden">
                                        <div className="h-full bg-[#7ab800] w-[68%]" />
                                    </div>
                                    <Link href="/donate">
                                        <Button className="w-full bg-white text-stone-900 font-black py-4 rounded-2xl">CONTRIBUTE NOW</Button>
                                    </Link>
                                </div>

                                <div className="bg-white rounded-[3rem] p-10 border border-stone-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <Activity className="text-red-500 animate-pulse" size={20} />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-stone-800">LIVE FEED</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-4 border-l-2 border-stone-50 pl-4">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#7ab800]">Case #GHZ-102</p>
                                                    <p className="text-stone-800 font-bold text-sm">Response unit arrived in Ghaziabad for ritual prep.</p>
                                                    <p className="text-stone-400 text-[9px] uppercase font-bold mt-1">45 mins ago</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
