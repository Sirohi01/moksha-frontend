"use client";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { Video, Mail, Phone, ChevronRight, Play, Clock, Heart, Award } from "lucide-react";
import Button from "@/components/ui/Button";
import { documentariesConfig } from "@/config/documentaries.config";

export default function DocumentariesPage() {
    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-50 text-gray-900 py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 mb-6">
                            <p className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em] leading-none">{documentariesConfig.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-gray-900">{documentariesConfig.hero.title} <br /><span className="text-amber-700">{documentariesConfig.hero.subtitle}</span></h1>
                        <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
                            {documentariesConfig.hero.description}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Films Grid */}
            <section className="py-16 bg-stone-100">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documentariesConfig.films.items.map((film, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 group overflow-hidden relative text-left flex flex-col">
                                <div className="aspect-[4/5] relative">
                                    <Image src={film.image} alt={film.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/10 transition-colors" />
                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock size={10} /> {film.duration}
                                    </div>
                                    <button className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-700 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                                        <Play className="fill-white ml-0.5" size={18} />
                                    </button>
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-amber-800 text-white px-2 py-1 rounded text-[7px] font-black uppercase tracking-widest shadow-sm">{documentariesConfig.films.newBadge}</div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-amber-700 font-black text-[9px] uppercase tracking-[0.3em]">✦ {film.type}</p>
                                        <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest">{film.year}</p>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-gray-800 leading-tight">{film.title}</h3>
                                    <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                                        {film.desc}
                                    </p>
                                    <button className="w-full py-3 border border-stone-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-700 hover:bg-amber-700 hover:text-white transition-all">{documentariesConfig.films.watchButton}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Festival Selections */}
            <section className="py-16 bg-amber-800">
                <Container>
                    <div className="text-center mb-12">
                        <Award className="text-amber-100 mx-auto mb-6" size={48} />
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-[0.85] mb-4 text-white">
                            {documentariesConfig.festivalSelections.title} <span className="text-amber-100">{documentariesConfig.festivalSelections.subtitle}</span>
                        </h2>
                        <p className="text-white/80 text-base max-w-2xl mx-auto font-medium">
                            {documentariesConfig.festivalSelections.description}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {documentariesConfig.festivalSelections.festivals.map((festival, idx) => (
                            <div key={idx} className="group text-center">
                                <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center mb-3 group-hover:border-amber-100 group-hover:bg-amber-100/10 transition-all duration-300 backdrop-blur-sm">
                                    <Award className="w-6 h-6 text-white/60 group-hover:text-amber-100 transition-colors" />
                                </div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1 group-hover:text-amber-100 transition-colors">
                                    {festival.name}
                                </h3>
                                <p className="text-white/60 text-xs font-medium mb-0.5">{festival.subtitle}</p>
                                <p className="text-white/40 text-xs font-bold">{festival.year}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-white/60 text-sm font-medium mb-4">
                            {documentariesConfig.festivalSelections.recognitionText}
                        </p>
                        <div className="flex justify-center gap-3">
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <span className="text-amber-100 font-black text-base">{documentariesConfig.festivalSelections.stats.awards}</span>
                                <span className="text-white/80 text-xs font-medium ml-2 uppercase tracking-widest">{documentariesConfig.festivalSelections.statsLabels.awards}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <span className="text-amber-100 font-black text-base">{documentariesConfig.festivalSelections.stats.selections}</span>
                                <span className="text-white/80 text-xs font-medium ml-2 uppercase tracking-widest">{documentariesConfig.festivalSelections.statsLabels.selections}</span>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
