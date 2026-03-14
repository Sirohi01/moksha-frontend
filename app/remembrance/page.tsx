"use client";
import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import Button from "@/components/ui/Button";
import { remembranceConfig } from "@/config/remembrance.config";
import { getIcon } from "@/config/icons.config";

export default function RemembrancePage() {
    const memorials = remembranceConfig.memorialGrid.memorials;

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{remembranceConfig.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{remembranceConfig.hero.title} <span className="text-[#7ab800]">{remembranceConfig.hero.highlightText}</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {remembranceConfig.hero.description}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Memorial Grid */}
            <section className="py-20">
                <Container>
                    <div className="max-w-3xl mx-auto mb-16 px-4">
                        <div className="relative group overflow-hidden bg-white rounded-2xl border border-stone-200 focus-within:ring-4 focus-within:ring-[#7ab800]/10 transition-all shadow-sm">
                            <input type="text" placeholder={remembranceConfig.memorialGrid.search.placeholder} className="w-full h-16 bg-transparent px-16 text-[11px] font-black uppercase tracking-widest text-stone-800 placeholder-stone-300 outline-none" />
                            {(() => {
                                const SearchIcon = getIcon('Search');
                                return <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#7ab800] transition-colors" size={20} />;
                            })()}
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#7ab800] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7ab800]/10">{remembranceConfig.memorialGrid.search.buttonText}</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {memorials.map((memorial, i) => (
                            <div key={i} className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm hover:translate-y-[-4px] transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#7ab800]/10 transition-colors" />

                                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center mb-10 group-hover:bg-[#7ab800]/10 transition-colors text-[#7ab800]">
                                    {(() => {
                                        const FlameIcon = getIcon('Flame');
                                        return <FlameIcon size={24} />;
                                    })()}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 text-stone-800 leading-none">{memorial.name}</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-widest">{memorial.date}</p>
                                    <span className="text-stone-300">/</span>
                                    <p className="text-stone-400 font-black text-[10px] uppercase tracking-widest">{memorial.city}</p>
                                </div>
                                <p className="text-stone-500 font-medium text-sm leading-relaxed mb-10 italic">
                                    &quot;{memorial.tribute}&quot;
                                </p>

                                <div className="flex items-center justify-between border-t border-stone-50 pt-8 mt-auto">
                                    <div className="flex items-center gap-2 text-[#7ab800]">
                                        {(() => {
                                            const FlowerIcon = getIcon('Flower');
                                            return <FlowerIcon size={16} />;
                                        })()}
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">{remembranceConfig.memorialGrid.actions.offerFlower}</p>
                                    </div>
                                    <Link href="/database">
                                        <button className="flex items-center gap-4 px-6 py-2.5 rounded-full bg-stone-50 text-[10px] font-black uppercase tracking-widest text-[#7ab800] hover:bg-[#7ab800] hover:text-white transition-all group-hover:bg-[#7ab800]/5 group-hover:text-[#7ab800]">
                                            {remembranceConfig.memorialGrid.actions.viewCase} {(() => {
                                                const ChevronRightIcon = getIcon('ChevronRight');
                                                return <ChevronRightIcon size={14} />;
                                            })()}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {/* Remembrance Wall Stats */}
                        <div className="bg-[#7ab800] p-8 rounded-[3.5rem] shadow-xl text-white flex flex-col justify-center items-center text-center overflow-hidden relative">
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50" />
                            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none text-white">{remembranceConfig.memorialGrid.stats.number}</h3>
                            <p className="text-white/80 font-black text-[10px] uppercase tracking-widest mb-8">{remembranceConfig.memorialGrid.stats.description}</p>
                            <Link href={remembranceConfig.memorialGrid.stats.sponsorLink}>
                                <Button className="w-full bg-stone-900 border border-transparent text-white font-black py-4 hover:bg-stone-800 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                                    {remembranceConfig.memorialGrid.stats.sponsorButton}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Memorial Message */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto p-12 md:p-20 bg-stone-50 rounded-[4rem] text-center border border-stone-100 shadow-inner overflow-hidden relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#7ab800]/5 blur-3xl rounded-full" />
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-10 shadow-lg relative z-10">
                            {(() => {
                                const HeartIcon = getIcon('Heart');
                                return <HeartIcon className="text-[#7ab800]" size={36} fill="#7ab800" />;
                            })()}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85] mb-8">{remembranceConfig.memorialMessage.title} <span className="text-[#7ab800]">{remembranceConfig.memorialMessage.highlightText}</span></h2>
                        <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                            {remembranceConfig.memorialMessage.description}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href={remembranceConfig.memorialMessage.actions.leaveTribute.href}>
                                <button className="bg-stone-900 text-white px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-stone-900/10 hover:bg-stone-800 transition-all">{remembranceConfig.memorialMessage.actions.leaveTribute.text}</button>
                            </Link>
                            <Link href={remembranceConfig.memorialMessage.actions.missionStory.href}>
                                <button className="bg-white border border-stone-200 text-[#7ab800] px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-widest hover:border-[#7ab800] transition-all">{remembranceConfig.memorialMessage.actions.missionStory.text}</button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
