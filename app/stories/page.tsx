"use client";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { Video, Mail, Phone, ChevronRight, Play, Clock, Heart } from "lucide-react";
import Button from "@/components/ui/Button";

export default function StoriesPage() {
    const stories = [
        { title: "The Man with the Silver Key", duration: "4:15", type: "Short Film", desc: "A forgotten watchmaker in Varanasi and the Saathi who became his son for one final hour.", image: "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=2000&auto=format&fit=crop" },
        { title: "Night Shift Dignity", duration: "6:30", type: "Documentary", desc: "Follow our Lucknow response unit through a midnight call that changed their lives forever.", image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2000&auto=format&fit=crop" },
        { title: "Naming the Nameless", duration: "3:45", type: "Cinematic Short", desc: "The deep investigation process we follow to find the identity of those forgotten by society.", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop" },
    ];

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">STORIES OF RESILIENCE</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">NARRATIVES OF <br /><span className="text-[#7ab800]">DIGNITY</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            Every person we serve has a story that was almost lost. We document these
                            journeys to ensure their humanity is never forgotten.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Stories Grid */}
            <section className="py-20">
                <Container>
                    <div className="space-y-16">
                        {stories.map((story, i) => (
                            <div key={i} className="flex flex-col lg:flex-row items-center gap-12 group">
                                <div className="lg:w-1/2 w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl relative">
                                    <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/10 transition-colors" />
                                    <button className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#7ab800] shadow-2xl hover:scale-110 transition-all">
                                        <Play className="fill-[#7ab800] ml-1" size={28} />
                                    </button>
                                    <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> {story.duration}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 text-left">
                                    <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.3em] mb-4">✦ {story.type}</p>
                                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85] mb-6">{story.title}</h3>
                                    <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                        {story.desc}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button className="bg-stone-900 text-white px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">WATCH NOW</button>
                                        <button className="w-14 h-14 rounded-full border border-stone-200 flex items-center justify-center text-[#7ab800] hover:border-[#7ab800] transition-colors"><Heart size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 bg-white border-t border-stone-100">
                <Container>
                    <div className="max-w-4xl mx-auto p-12 md:p-20 bg-stone-50 rounded-[5rem] text-center border border-stone-200 overflow-hidden relative">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85] mb-8">GET STORIES IN YOUR <span className="text-[#7ab800]">INBOX</span></h2>
                        <p className="text-stone-500 font-medium text-lg leading-relaxed mb-12">
                            Subscribe to &apos;The Dignity Dispatch&apos;—a monthly long-form narrative series about the souls we serve.
                            No spam, just humanity.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                            <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 h-16 rounded-full px-8 bg-white border border-stone-200 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#7ab800] transition-all shadow-inner" />
                            <button className="h-16 bg-[#7ab800] text-white px-10 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-[#7ab800]/20 hover:scale-105 transition-all">SUBSCRIBE</button>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
