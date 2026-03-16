"use client";
import React from "react";
import { Container } from "@/components/ui/Elements";
import { Newspaper, Megaphone, Download, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { pressConfig } from "@/config/press.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function PressPage() {
    const { config, loading: configLoading, error: configError } = usePageConfig('press', pressConfig);
    const activeConfig = config || pressConfig;

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Loading State */}
            {configLoading && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ab800]"></div>
                </div>
            )}

            {/* Error State */}
            {configError && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Failed to load page configuration</p>
                        <p className="text-gray-600">Using default configuration</p>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{activeConfig.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{activeConfig.hero.title} <br /><span className="text-[#7ab800]">{activeConfig.hero.subtitle}</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {activeConfig.hero.description}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Press Coverage Grid */}
            <section className="py-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {activeConfig.pressCoverage.items.map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm hover:translate-y-[-4px] transition-all group overflow-hidden relative text-left">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#7ab800]/10 transition-colors" />

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-[#7ab800]">
                                        <Newspaper size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-widest leading-none mb-1">{item.source}</p>
                                        <p className="text-stone-400 font-black text-[9px] uppercase tracking-widest">{item.date}</p>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 text-stone-800 leading-[1.1]">{item.title}</h3>
                                <p className="text-stone-500 font-medium text-sm leading-relaxed mb-10">✦ {item.type}</p>

                                <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#7ab800] hover:text-[#5b8a00] transition-colors">
                                    {activeConfig.pressCoverage.readButton} <ExternalLink size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Asset Library */}
            <section className="py-20 bg-stone-100">
                <Container>
                    <div className="bg-white rounded-[4rem] p-12 md:p-20 border border-stone-200 shadow-xl text-left">
                        <div className="flex items-center gap-4 mb-10">
                            <Megaphone className="text-[#7ab800]" size={40} />
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85]">{activeConfig.assetLibrary.title}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {activeConfig.assetLibrary.assets.map((asset, i) => (
                                <div key={i} className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 hover:border-[#7ab800] transition-all group cursor-pointer">
                                    <h4 className="text-stone-800 font-black text-xs uppercase tracking-widest mb-2 leading-tight">{asset.name}</h4>
                                    <p className="text-stone-400 font-black text-[9px] uppercase tracking-widest mb-6">{asset.format} • {asset.size}</p>
                                    <button className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-[#7ab800] group-hover:text-white transition-all">
                                        <Download size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Media Contact */}
            <section className="py-24 bg-white">
                <Container size="md">
                    <div className="text-center p-12 md:p-20 bg-stone-900 rounded-[4rem] text-white">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{activeConfig.mediaContact.title} <span className="text-[#7ab800]">{activeConfig.mediaContact.subtitle}</span> INQUIRIES</h2>
                        <p className="text-stone-400 font-medium text-lg leading-relaxed mb-10">
                            {activeConfig.mediaContact.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            {activeConfig.mediaContact.contacts.map((contact, i) => {
                                const Icon = getIcon(contact.icon);
                                return (
                                    <a key={i} href={contact.href} className="flex items-center gap-4 group">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${i === 0 ? 'bg-[#7ab800] text-white' : 'bg-white text-stone-900'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-stone-400 text-[9px] font-black uppercase tracking-widest mb-0.5">{contact.label}</p>
                                            <p className="font-black text-sm uppercase tracking-tighter">{contact.value}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
