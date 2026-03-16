"use client";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { storiesConfig } from "@/config/stories.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function StoriesPage() {
    const { config, loading, error } = usePageConfig('stories', storiesConfig);
    
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ab800]"></div>
            </div>
        );
    }

    if (error || !config) {
        console.error('Failed to load Stories page config:', error);
        // Fallback to static config
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Temporarily Unavailable</h1>
                    <p className="text-gray-600">Please try again later.</p>
                </div>
            </div>
        );
    }

    const stories = config?.storiesGrid?.stories || [];

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{config?.hero?.badge || 'STORIES'}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{config?.hero?.title || 'IMPACT'} <br /><span className="text-[#7ab800]">{config?.hero?.highlightText || 'STORIES'}</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {config?.hero?.description || 'Real stories of dignity, compassion, and service.'}
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
                                    <Image src={story.image} alt={story.imageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/10 transition-colors" />
                                    <button className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#7ab800] shadow-2xl hover:scale-110 transition-all">
                                        {(() => {
                                            const PlayIcon = getIcon('Play');
                                            return <PlayIcon className="fill-[#7ab800] ml-1" size={28} />;
                                        })()}
                                    </button>
                                    <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        {(() => {
                                            const ClockIcon = getIcon('Clock');
                                            return <ClockIcon size={12} />;
                                        })()} {story.duration}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 text-left">
                                    <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.3em] mb-4">✦ {story.type}</p>
                                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85] mb-6">{story.title}</h3>
                                    <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                        {story.description}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button className="bg-stone-900 text-white px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10">{config?.storiesGrid?.buttons?.watchNow || 'WATCH NOW'}</button>
                                        <button className="w-14 h-14 rounded-full border border-stone-200 flex items-center justify-center text-[#7ab800] hover:border-[#7ab800] transition-colors" title={config?.storiesGrid?.buttons?.favorite || 'Add to favorites'}>
                                            {(() => {
                                                const HeartIcon = getIcon('Heart');
                                                return <HeartIcon size={20} />;
                                            })()}
                                        </button>
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
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85] mb-8">{config?.newsletter?.title || 'STAY'} <span className="text-[#7ab800]">{config?.newsletter?.highlightText || 'CONNECTED'}</span></h2>
                        <p className="text-stone-500 font-medium text-lg leading-relaxed mb-12">
                            {config?.newsletter?.description || 'Get updates on our latest stories and impact.'}
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                            <input type="email" placeholder={config?.newsletter?.placeholder || 'Enter your email'} className="flex-1 h-16 rounded-full px-8 bg-white border border-stone-200 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#7ab800] transition-all shadow-inner" />
                            <button className="h-16 bg-[#7ab800] text-white px-10 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-[#7ab800]/20 hover:scale-105 transition-all">{config?.newsletter?.buttonText || 'SUBSCRIBE'}</button>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
