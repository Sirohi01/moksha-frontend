'use client';

import { useState, useEffect } from 'react';
import { Container } from "@/components/ui/Elements";
import Image from "next/image";
import { galleryConfig } from "@/config/gallery.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function GalleryPage() {
    const { config, loading, error } = usePageConfig('gallery', galleryConfig);
    
    // Use fallback config if dynamic config is null
    const activeConfig = config || galleryConfig;
    const galleryImages = activeConfig.gallery.images;
    const categories = activeConfig.gallery.categories;

    // Get icons
    const Camera = getIcon('Camera');
    const Heart = getIcon('Heart');
    const Share2 = getIcon('Share2');
    const Maximize2 = getIcon('Maximize2');
    const MapPin = getIcon('MapPin');
    const Calendar = getIcon('Calendar');
    const X = getIcon('X');
    const Download = getIcon('Download');

    // Initialize state - always call these hooks
    const [selectedImg, setSelectedImg] = useState<null | any>(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [filteredImages, setFilteredImages] = useState(galleryImages);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredImages(galleryImages);
        } else {
            setFilteredImages(galleryImages.filter(img => img.category === activeCategory));
        }
    }, [activeCategory, galleryImages]);

    // Handle loading and error states after all hooks
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (error) {
        console.error('Failed to load Gallery page config:', error);
        // Fallback to static config
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="relative h-[80vh] overflow-hidden bg-stone-900">
                {/* Animated Background Grid */}
                <div className="absolute inset-0">
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 h-full gap-1">
                        {activeConfig.hero.backgroundImages.map((src, idx) => (
                            <div 
                                key={idx} 
                                className="relative overflow-hidden opacity-20 hover:opacity-40 transition-all duration-1000 aspect-square"
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 16vw, (max-width: 1024px) 12vw, 8vw"
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/80 to-stone-900/95" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-teal-600/30" />

                {/* Main Content */}
                <div className="relative z-10 h-full flex items-center justify-center">
                    <Container>
                        <div className="text-center text-white">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
                                <Camera className="w-5 h-5 text-yellow-400" />
                                <span className="text-white text-sm font-bold tracking-wider uppercase">
                                    {activeConfig.hero.badge}
                                </span>
                            </div>

                            {/* Main Title */}
                            <div className="mb-8">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-tight mb-4">
                                    <span className="block">{activeConfig.hero.title.line1}</span>
                                    <span className="text-yellow-400">{activeConfig.hero.title.line2}</span>
                                    <span className="text-teal-400 ml-4">{activeConfig.hero.title.line3}</span>
                                </h1>
                            </div>

                            {/* Subtitle */}
                            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed opacity-90 mb-12">
                                {activeConfig.hero.description}
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center gap-8">
                                {[
                                    activeConfig.hero.stats.momentsCaptured,
                                    activeConfig.hero.stats.categories,
                                    activeConfig.hero.stats.citiesDocumented,
                                    activeConfig.hero.stats.storiesTold
                                ].map((stat, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="text-2xl md:text-3xl font-black text-yellow-400 mb-1">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs font-medium uppercase tracking-widest text-white/70">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="py-8 bg-white border-b border-stone-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
                <Container>
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                                    activeCategory === category
                                        ? "bg-yellow-400 text-white shadow-lg"
                                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Gallery */}
            <section className="py-12">
                <Container>
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {filteredImages.map((image, idx) => (
                            <div
                                key={idx}
                                className="break-inside-avoid group cursor-pointer"
                                onClick={() => setSelectedImg(image)}
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                    <div className="relative overflow-hidden">
                                        <div style={{ height: `${image.height}px` }} className="relative">
                                            <Image
                                                src={image.src}
                                                alt={image.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-teal-600 text-white px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                                                    {image.category}
                                                </span>
                                            </div>

                                            {/* Hover Actions */}
                                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 transition-colors">
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                                <button className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 transition-colors">
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Expand Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                                                    <Maximize2 className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-stone-900 text-sm uppercase tracking-tighter leading-tight mb-2">
                                            {image.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-xs text-stone-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {image.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {image.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <div className="text-center mt-12">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-xl">
                            {activeConfig.gallery.loadMoreText}
                        </button>
                    </div>
                </Container>
            </section>

            {/* Lightbox Modal */}
            {selectedImg && (
                <div
                    className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setSelectedImg(null)}
                >
                    <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedImg(null)}
                            className="absolute -top-12 right-0 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image */}
                        <div className="relative">
                            <Image
                                src={selectedImg.src}
                                alt={selectedImg.title}
                                width={800}
                                height={600}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>

                        {/* Image Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/90 to-transparent p-6 rounded-b-lg">
                            <h3 className="text-white text-xl font-bold mb-2">{selectedImg.title}</h3>
                            <div className="flex items-center gap-4 text-white/70 text-sm">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {selectedImg.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {selectedImg.date}
                                </span>
                                <span className="bg-teal-600 px-2 py-1 rounded text-xs font-bold uppercase">
                                    {selectedImg.category}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}