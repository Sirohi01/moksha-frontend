'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/ui/Elements";
import Image from "next/image";
import { galleryConfig } from "@/config/gallery.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { cn } from "@/lib/utils";
import { galleryAPI } from '@/lib/api';

export default function GalleryPage() {
    const { config, loading: configLoading } = usePageConfig('gallery', galleryConfig);
    const activeConfig = config || galleryConfig;

    const initialCategories = activeConfig.gallery?.categories || ["All", "Services", "Community", "Events", "Volunteers"];

    const Maximize2 = getIcon('Maximize2');
    const MapPin = getIcon('MapPin');
    const Calendar = getIcon('Calendar');
    const X = getIcon('X');

    const [selectedImg, setSelectedImg] = useState<null | any>(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (selectedImg) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedImg]);

    useEffect(() => {
        setPage(1);
        fetchGalleryImages(1, activeCategory, true);
    }, [activeCategory]);

    const fetchGalleryImages = async (pageNum: number, category: string, reset: boolean = false) => {
        try {
            setLoading(true);
            const cat = category === "All" ? "all" : category.toLowerCase();
            const response = await galleryAPI.getImages(pageNum, 12, cat, undefined, false);

            if (response.success) {
                const newImages = response.data.images.map((img: any) => ({
                    ...img,
                    location: img.location || "Moksha Sewa Project",
                    date: new Date(img.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                }));

                if (reset) {
                    setGalleryImages(newImages);
                } else {
                    setGalleryImages(prev => [...prev, ...newImages]);
                }

                setHasMore(pageNum < response.data.pages);
            }
        } catch (error) {
            console.error('Failed to fetch gallery images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchGalleryImages(nextPage, activeCategory);
    };

    const getSafeSrc = (imgSource: any) => {
        if (!imgSource) return "/gallery/hero_moksha_1.png";
        if (typeof imgSource === 'string') return imgSource;
        if (typeof imgSource === 'object' && imgSource.src) return imgSource.src;
        return "/gallery/hero_moksha_1.png";
    };

    if (configLoading && galleryImages.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-stone-200 border-t-gold-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4] text-navy-950 selection:bg-gold-200 font-sans">
            {/* Minimal Editorial Hero */}
            <section className="relative bg-white overflow-hidden py-12 border-b border-stone-50 transition-all duration-700">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
                <Container className="relative z-10 w-full">
                    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-px bg-gold-600" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold-600">
                                {activeConfig.hero.badge || "Visual Archive"}
                            </span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
                            <h1 className="text-3xl md:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-none text-navy-950">
                                <span className="block opacity-90 text-navy-400">
                                    {activeConfig.hero.title.line1 || "Captured"}
                                </span>
                                <span className="block text-gold-800 italic -mt-2">
                                    {activeConfig.hero.title.line2 || "Moments"} {activeConfig.hero.title.line3 || ""}
                                </span>
                            </h1>

                            <div className="flex items-center gap-8 lg:pb-1">
                                <div className="space-y-0.5">
                                    <p className="text-2xl font-black text-navy-950 leading-none">
                                        {activeConfig.hero.stats?.momentsCaptured?.number || "2.8K+"}
                                    </p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gold-600 opacity-70">
                                        {activeConfig.hero.stats?.momentsCaptured?.label || "Moments"}
                                    </p>
                                </div>
                                <div className="w-px h-6 bg-stone-200" />
                                <div className="space-y-0.5">
                                    <p className="text-2xl font-black text-navy-950 leading-none">
                                        {activeConfig.hero.stats?.citiesDocumented?.number || "38+"}
                                    </p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gold-600 opacity-70">
                                        {activeConfig.hero.stats?.citiesDocumented?.label || "Cities"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm font-medium max-w-2xl text-navy-700/60 leading-relaxed tracking-tight italic border-l-4 border-gold-500/30 pl-6 uppercase">
                            {activeConfig.hero.description || "A curated collection of visual documentation showcasing our mission impact."}
                        </p>
                    </div>
                </Container>
            </section>


            {/* Grid Gallery */}
            <section className="py-16 bg-[#f8f7f4]">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {galleryImages.map((image, idx) => (
                            <div
                                key={idx}
                                className="group cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 h-full"
                                onClick={() => setSelectedImg(image)}
                            >
                                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-stone-200 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700 border-[6px] border-white">
                                    <Image
                                        src={getSafeSrc(image.src)}
                                        alt={image.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                        className="object-cover transition-all duration-[2000ms] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-navy-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[1px]">
                                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-navy-950 scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl relative overflow-hidden group/btn">
                                            <Maximize2 className="w-5 h-5 relative z-10 group-hover/btn:scale-110 transition-transform" />
                                            <div className="absolute inset-0 bg-gold-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 px-3 space-y-1.5 flex-grow">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div className="w-1.5 h-1.5 bg-gold-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(212,163,47,0.4)]"></div>
                                        <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.3em]">{image.location}</p>
                                    </div>
                                    <h3 className="text-lg font-black text-navy-950 uppercase tracking-tighter leading-tight group-hover:text-gold-600 transition-colors italic">
                                        {image.title}
                                    </h3>
                                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-stone-300">{image.date}</span>
                                        <span className="text-[8px] font-black text-gold-600/40 uppercase tracking-widest italic group-hover:text-gold-600 transition-colors">Verified</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="text-center mt-20">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="group relative px-12 py-4.5 bg-navy-950 text-gold-500 rounded-xl font-black uppercase tracking-[0.3em] text-[9px] transition-all hover:bg-gold-600 hover:text-navy-950 shadow-2xl active:scale-95 disabled:opacity-50 overflow-hidden"
                            >
                                <span className="relative z-10">{loading ? 'Accessing Data...' : 'Reveal More Chapters'}</span>
                                <div className="absolute inset-0 bg-gold-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                            </button>
                        </div>
                    )}
                </Container>
            </section>

            {/* Improved Large-Scale Modal Lightbox */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-[9999] bg-navy-950/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500"
                    onClick={() => setSelectedImg(null)}
                >
                    <button
                        onClick={() => setSelectedImg(null)}
                        className="fixed top-8 right-8 w-14 h-14 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-navy-950 transition-all shadow-2xl z-[10000] border border-white/10 backdrop-blur-xl group"
                    >
                        <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
                    </button>

                    <div
                        className="relative max-w-[95vw] max-h-[90vh] w-full flex flex-col md:flex-row bg-white rounded-[3rem] overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image Viewer - Ensuring full scaling */}
                        <div className="flex-grow bg-[#050505] relative flex items-center justify-center p-6 md:p-12 min-h-[40vh] md:min-h-[75vh]">
                            <img
                                src={getSafeSrc(selectedImg.src)}
                                alt={selectedImg.title}
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                            />
                        </div>

                        {/* Sidebar */}
                        <div className="w-full md:w-[400px] p-10 lg:p-14 flex flex-col justify-between bg-white border-l border-stone-50">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <span className="inline-block bg-gold-50 text-gold-600 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] leading-none border border-gold-100">
                                        {selectedImg.category}
                                    </span>
                                    <h3 className="text-4xl lg:text-5xl font-black text-navy-950 uppercase tracking-tighter leading-[0.9] italic">
                                        {selectedImg.title}
                                    </h3>
                                </div>
                                <blockquote className="text-lg font-bold text-navy-600/70 leading-relaxed italic border-l-4 border-gold-400 pl-6 uppercase tracking-tight">
                                    {selectedImg.description || "Mission documentation from the Moksha Sewa Archive."}
                                </blockquote>
                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-gold-600 shadow-sm">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.4em] mb-0.5">Deployment Zone</p>
                                            <p className="text-navy-950 font-black uppercase italic tracking-tight">{selectedImg.location || "Project Zone Alpha"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-navy-300 shadow-sm">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.4em] mb-0.5">Historical Date</p>
                                            <p className="text-navy-950 font-black uppercase italic tracking-tight">{selectedImg.date}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-10">
                                <button
                                    onClick={() => setSelectedImg(null)}
                                    className="w-full bg-navy-950 text-gold-500 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-gold-600 hover:text-navy-950 transition-all shadow-xl group relative overflow-hidden"
                                >
                                    <span className="relative z-10">Exit Archive View</span>
                                    <div className="absolute inset-0 bg-gold-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}