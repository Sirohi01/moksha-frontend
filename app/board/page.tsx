"use client";
import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { Mail, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { boardConfig } from "@/config/board.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function BoardPage() {
    // Use dynamic config with fallback to static config
    const { config: dynamicConfig, loading: configLoading } = usePageConfig('board', boardConfig);
    
    // Use dynamic config if available, otherwise fallback to static
    const config = dynamicConfig || boardConfig;
    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{config.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{config.hero.title} <span className="text-[#7ab800]">{config.hero.titleHighlight}</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {config.hero.description}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Leadership Grid */}
            <section className="py-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {config.leadership.map((member, i) => {
                            const MemberIcon = getIcon(member.icon);
                            return (
                                <div key={i} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:translate-y-[-4px] transition-all group">
                                    <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center mb-8 group-hover:bg-[#7ab800]/10 transition-colors">
                                        <MemberIcon className="text-[#7ab800]" size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 text-stone-800 leading-none">{member.name}</h3>
                                    <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-widest mb-6">{member.role}</p>
                                    <p className="text-stone-500 font-medium text-sm leading-relaxed mb-10">
                                        {member.desc}
                                    </p>

                                    <div className="flex items-center gap-4 border-t border-stone-50 pt-8 mt-auto">
                                        <a href={`mailto:${member.id}@mokshaseva.org`} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center hover:bg-[#7ab800] hover:text-white transition-all">
                                            <Mail size={16} />
                                        </a>
                                        <Link href={`/board/profile/${member.id}`} className="flex-1">
                                            <button className="w-full px-6 py-2.5 rounded-full bg-stone-50 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors flex items-center justify-between group-hover:bg-[#7ab800]/5 group-hover:text-[#7ab800]">
                                                {config.labels.viewProfile} <ChevronRight size={14} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Join the force card */}
                        <div className="bg-[#7ab800] p-8 rounded-[2rem] shadow-xl text-white flex flex-col justify-center items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-8 border border-white/20">
                                {(() => {
                                    const UsersIcon = getIcon('Users');
                                    return <UsersIcon size={32} className="text-white" />;
                                })()}
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none">{config.joinCard.title}</h3>
                            <p className="text-white/80 font-medium text-sm leading-relaxed mb-8">
                                {config.joinCard.description}
                            </p>
                            <Link href={config.joinCard.buttonHref}>
                                <Button className="w-full bg-white text-[#7ab800] font-black py-4 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]">
                                    {config.joinCard.buttonText}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Advisory Stats */}
            <section className="py-20 border-t border-stone-200">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {config.stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-[#7ab800] text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2">{stat.number}</p>
                                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </main>
    );
}
