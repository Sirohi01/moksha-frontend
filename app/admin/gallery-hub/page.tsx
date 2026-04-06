'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
    Image as ImageIcon,
    Upload,
    RefreshCcw,
    CheckCircle,
    Layout,
    Layers,
    ChevronDown,
    Save,
    Globe,
    Settings,
    Eye,
    Camera,
    Search,
    Box,
    Monitor,
    Smartphone,
    Sparkles,
    ArrowRight,
    X
} from 'lucide-react';
import { cn, getAlt } from '@/lib/utils';
import { setNestedValue } from '@/lib/editor-utils';

export default function MasterVisualHub() {
    const [pages, setPages] = useState<any[]>([]);
    const [selectedSlug, setSelectedSlug] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [seoData, setSeoData] = useState<any>(null);

    useEffect(() => {
        fetchGalleryData();
    }, []);

    useEffect(() => {
        if (selectedSlug) {
            fetchSeoForPage(selectedSlug);
        }
    }, [selectedSlug]);

    const fetchSeoForPage = async (slug: string) => {
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/seo/page/${slug}`);
            const data = await response.json();
            if (data.success) {
                setSeoData(data.data);
            } else {
                setSeoData(null);
            }
        } catch (error) {
            console.error("SEO fetch error:", error);
            setSeoData(null);
        }
    };

    const fetchGalleryData = async () => {
        try {
            setLoading(true);
            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/page-config?hydrate=true&limit=100`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await response.json();

            if (data.success && data.data?.configs) {
                const validPages = data.data.configs;
                setPages(validPages);
                if (validPages.length > 0) setSelectedSlug(validPages[0].slug);
            }
        } catch (error) {
            console.error("Gallery fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const currentPageData = pages.find(p => p.slug === selectedSlug);
    const harvestImages = (obj: any, path: string = '', section: string = ''): any[] => {
        let images: any[] = [];
        if (!obj || typeof obj !== 'object') return images;

        for (let key in obj) {
            const val = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            const currentSection = section || key;

            if (typeof val === 'string' && val.length > 3) {
                const hasImageExtension = /\.(jpg|jpeg|png|webp|gif|svg|avif|bmp|tiff)($|\?)/i.test(val);
                const isUrl = val.startsWith('http') || val.startsWith('/') || val.startsWith('data:image/');
                const isImageContext = ['image', 'img', 'src', 'url', 'slides', 'banner', 'logo', 'background', 'thumb', 'icon', 'visual'].some(k =>
                    key.toLowerCase().includes(k)
                );

                if ((hasImageExtension || isImageContext) && isUrl) {
                    images.push({
                        url: val,
                        path: currentPath,
                        section: currentSection,
                        key: key,
                        alt: getAlt(val, seoData || currentPageData?.seo) // Prioritize SEOPage model mappings
                    });
                }
            } else if (Array.isArray(val)) {
                val.forEach((item, idx) => {
                    if (typeof item === 'string') {
                        const isImg = /\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(item) ||
                            item.startsWith('/') || item.startsWith('http');
                        if (isImg) {
                            images.push({
                                url: item,
                                path: `${currentPath}[${idx}]`,
                                section: currentSection,
                                key: `${key}[${idx}]`,
                                alt: getAlt(item, seoData || currentPageData?.seo)
                            });
                        }
                    } else {
                        images = images.concat(harvestImages(item, `${currentPath}[${idx}]`, currentSection));
                    }
                });
            } else if (typeof val === 'object' && val !== null) {
                images = images.concat(harvestImages(val, currentPath, currentSection));
            }
        }
        return images;
    };

    const allFoundImages = currentPageData?.config ? harvestImages(currentPageData.config) : [];

    const groupedImages: Record<string, any[]> = {};
    allFoundImages.forEach(img => {
        const sectionName = img.section.toUpperCase();
        if (!groupedImages[sectionName]) groupedImages[sectionName] = [];
        groupedImages[sectionName].push(img);
    });

    const handleUpdateImage = async (path: string, urlValue: any, altValue?: string) => {
        if (!currentPageData) return false;
        if (!altValue || altValue.trim().length < 3) {
            alert("SEO PROTOCOL REJECTED: Alt Text is mandatory (min 3 chars) for deployment.");
            return false;
        }

        const newConfig = setNestedValue(currentPageData.config, path, urlValue);

        const normalizeUrl = (s: string) => {
            if (!s || typeof s !== 'string') return s;
            return s.replace(/^https?:\/\//, '').replace(/\/v\d+\//, '/');
        };

        const srcValue = typeof urlValue === 'string' ? urlValue : (urlValue.src || urlValue.url || "");
        const currentSeo = currentPageData.seo || { imageAltMappings: {} };
        const newAltMappings = { ...currentSeo.imageAltMappings };

        if (altValue && srcValue) {
            const normalized = normalizeUrl(srcValue);
            Object.keys(newAltMappings).forEach(k => {
                if (normalizeUrl(k) === normalized) delete newAltMappings[k];
            });
            newAltMappings[srcValue] = altValue;
        }

        setSaving(true);
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

            // 1. Update Config
            const configResponse = await fetch(`${API_BASE_URL}/api/page-config/${selectedSlug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    config: newConfig,
                    changeLog: `Master Hub Sync: ${path}`
                })
            });
            await fetch(`${API_BASE_URL}/api/page-config/${selectedSlug}/seo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    seo: { ...currentSeo, imageAltMappings: newAltMappings }
                })
            });
            try {
                const seoRes = await fetch(`${API_BASE_URL}/api/seo/page/${selectedSlug}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    },
                    body: JSON.stringify({
                        imageAltMappings: newAltMappings
                    })
                });
                const seoResult = await seoRes.json();
                if (seoResult.success) {
                    setSeoData(seoResult.data);
                }
            } catch (err) {
                console.error("Global SEO Sync failed:", err);
            }

            const data = await configResponse.json();
            if (data.success) {
                setPages(prev => prev.map(p => p.slug === selectedSlug ? {
                    ...p,
                    config: newConfig,
                    seo: { ...currentSeo, imageAltMappings: newAltMappings }
                } : p));
                return true;
            } else {
                alert(data.message || "Sync Protocol Rejected.");
                return false;
            }
        } catch (error) {
            alert("Sync Failed.");
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file: File, path: string, altValue: string) => {
        if (file.size > 10 * 1024 * 1024) { // Increased to 10MB for Master Hub High-Res
            alert(`Image Protocol Rejected: ${file.name} is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max limit is 10MB for High-Res assets.`);
            return;
        }

        if (!altValue || altValue.trim().length < 3) {
            alert("SEO PROTOCOL REJECTED: Alt Text is required BEFORE uploading this media.");
            return;
        }

        setSaving(true);
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${API_BASE_URL}/api/media`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                const updated = await handleUpdateImage(path, data.data.url, altValue);
                if (updated) alert("Direct Upload Success!");
            } else {
                alert(data.message || 'Upload protocol failed');
            }
        } catch (err) {
            alert('Upload connection failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center p-24 text-center font-black animate-pulse opacity-40 uppercase tracking-widest italic text-navy-950 text-xs">Syncing Visual Network Infrastructure...</div>;

    return (
        <div className="min-h-screen bg-[#fafafa] select-none font-sans text-navy-950">
            <div className="max-w-[1600px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-16 border-l-4 border-gold-500 pl-4 md:pl-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Camera className="w-6 h-6 md:w-8 md:h-8 text-navy-950" />
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Master Visual Hub</h1>
                        </div>
                        <p className="text-navy-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] italic leading-tight">Centralized Image Archive & Deployment Engine</p>
                    </div>

                    <div className="w-full md:w-[400px]">
                        <p className="text-[9px] font-black text-navy-400 uppercase tracking-widest mb-3 ml-2 italic">Select Target Sector</p>
                        <div className="relative group">
                            <select
                                value={selectedSlug}
                                onChange={(e) => setSelectedSlug(e.target.value)}
                                className="w-full h-14 bg-white border-2 border-navy-50 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-navy-950 shadow-sm focus:border-gold-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                {pages.map(page => (
                                    <option key={page.slug} value={page.slug}>{page.title.toUpperCase()} (/{page.slug})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Dynamic Mapping Grid */}
                {Object.entries(groupedImages).length > 0 ? (
                    <div className="space-y-24">
                        {Object.entries(groupedImages).map(([sectionName, images]) => (
                            <section key={sectionName}>
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-navy-50">
                                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">
                                        <ImageIcon className="w-4 h-4 text-navy-950" />
                                    </div>
                                    <h2 className="text-xl font-black uppercase tracking-widest italic text-navy-950/80">{sectionName}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="w-full min-w-0">
                                            <VisualAssetCard
                                                title={img.path.split('.').pop()?.replace(/\[|\]/g, ' ')}
                                                path={img.path}
                                                url={img.url}
                                                alt={img.alt}
                                                onSwap={(newUrl: string, newAlt: string) => handleUpdateImage(img.path, newUrl, newAlt)}
                                                onUpload={(file: File, altValue: string) => handleImageUpload(file, img.path, altValue)}
                                                saving={saving}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-navy-50">
                        <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-6 h-6 text-navy-200" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-navy-300 italic">No Visual Sensors Detected In This Sector</p>
                            <p className="text-[9px] font-bold text-navy-200 uppercase tracking-widest">Verify page configuration integrity in Content Central.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function VisualAssetCard({ title, path, url, alt, onSwap, onUpload, saving }: any) {
    const [tempUrl, setTempUrl] = useState(url);
    const [tempAlt, setTempAlt] = useState(alt || '');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // Synchronize local state with incoming props (Crucial for pre-filling)
    useEffect(() => {
        setTempUrl(url);
        setTempAlt(alt || '');
    }, [url, alt]);

    const fileInputRef = Object.assign(useState<any>(null)[0] || {}, { current: null });

    // Determine Requirement protocol based on path
    const getRequirement = (path: string) => {
        const lowerPath = path.toLowerCase();
        // SEO Team Mission Directives
        if (lowerPath.includes('hero') || lowerPath.includes('slide')) return "1620x700px (Cinematic)";
        if (lowerPath.includes('about')) return "1000x1000px (1:1 High Res)";
        if (lowerPath.includes('service') || lowerPath.includes('impact')) return "800x600px (Standard Card)";
        if (lowerPath.includes('logo')) return "400x200px (Vector Opt)";
        if (lowerPath.includes('banner') || lowerPath.includes('bg')) return "1920x800px (Atmospheric)";
        if (lowerPath.includes('campaign')) return "800x540px (Campaign)";
        if (lowerPath.includes('story') || lowerPath.includes('motion')) return "1280x800px (Cinematic)";
        return "1200x800px (General)";
    };

    return (
        <>
            <Card className="group relative bg-white border-2 border-navy-50 rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-10 space-y-4 md:space-y-8 hover:border-gold-500 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col h-full w-full min-w-[280px]">
                {/* Visual Canvas */}
                <div className="aspect-[16/10] relative rounded-[1rem] md:rounded-[2rem] overflow-hidden bg-navy-50 shadow-inner">
                    <Image
                        src={tempUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        unoptimized
                    />

                    {/* Protocol Overlay */}
                    <div className="absolute top-2 md:top-6 left-2 md:left-6 px-2 md:px-4 py-1 md:py-2 bg-navy-950/95 backdrop-blur-xl rounded-lg md:rounded-xl border border-gold-500/30 flex items-center gap-1 md:gap-2 shadow-2xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gold-500">{getRequirement(path)}</p>
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-2 md:gap-4 backdrop-blur-[4px]">
                        <button
                            onClick={() => setIsPickerOpen(true)}
                            className="bg-gold-500 text-black px-4 md:px-8 py-2 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1"
                        >
                            <Layers className="w-3 md:w-4 h-3 md:h-4" />
                            Archive
                        </button>

                        <div className="flex items-center gap-2 text-white/40 text-[7px] md:text-[8px] font-black uppercase tracking-widest">
                            <div className="w-4 md:w-8 h-px bg-white/20" /> OR <div className="w-4 md:w-8 h-px bg-white/20" />
                        </div>

                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/20 transition-all backdrop-blur-md transform hover:-translate-y-1">
                            <Upload className="w-3 md:w-4 h-3 md:h-4" />
                            Upload
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onUpload(file, tempAlt);
                                }}
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4 md:space-y-5">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h3 className="text-navy-950 font-black text-[10px] md:text-sm uppercase tracking-widest leading-none">{title}</h3>
                                <p className="text-[8px] md:text-[10px] font-bold text-navy-400 italic truncate max-w-[120px] md:max-w-[200px] mt-1">Node: {path}</p>
                            </div>
                            <button
                                onClick={() => setIsPickerOpen(true)}
                                className="w-8 h-8 rounded-full bg-navy-50 hover:bg-gold-500 flex items-center justify-center transition-colors group/btn shrink-0"
                            >
                                <Layout className="w-3 h-3 text-navy-400 group-hover/btn:text-black" />
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-navy-950"></div>
                            <input
                                type="text"
                                shadow-inner
                                value={tempUrl}
                                onChange={(e) => setTempUrl(e.target.value)}
                                className="w-full h-12 md:h-14 bg-stone-50 rounded-xl md:rounded-2xl pl-10 md:pl-12 pr-4 md:pr-6 text-[10px] md:text-[11px] font-extrabold text-navy-900 outline-none border-2 border-transparent focus:border-gold-500/50 transition-all font-mono truncate"
                                placeholder="IMAGE_URL"
                            />
                        </div>

                        {/* Mandate Alt Text Input Layer */}
                        <div className="relative">
                            <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                            <input
                                type="text"
                                shadow-inner
                                value={tempAlt}
                                onChange={(e) => setTempAlt(e.target.value)}
                                className={cn(
                                    "w-full h-12 md:h-14 bg-rose-50/30 rounded-xl md:rounded-2xl pl-10 md:pl-12 pr-4 md:pr-6 text-[10px] md:text-[11px] font-black text-navy-950 outline-none border-2 transition-all italic",
                                    !tempAlt ? "border-rose-200 ring-2 ring-rose-50" : "border-emerald-100 focus:border-gold-500"
                                )}
                                placeholder="DESCRIPTION_REQUIRED (SEO ALT)"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={() => onSwap(tempUrl, tempAlt)}
                        disabled={saving || (tempUrl === url && tempAlt === alt) || !tempAlt || tempAlt.trim().length < 3}
                        className={cn(
                            "w-full h-12 md:h-16 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest md:tracking-[0.3em] transition-all flex items-center justify-center gap-2 md:gap-3",
                            (tempUrl === url && tempAlt === alt) || !tempAlt || tempAlt.trim().length < 3
                                ? "bg-stone-50 text-navy-400 border-2 border-navy-50/50 cursor-default opacity-80"
                                : "bg-gold-500 text-black shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:bg-navy-950 hover:text-gold-500 hover:-translate-y-1 active:translate-y-0"
                        )}
                    >
                        {saving ? <RefreshCcw className="w-4 md:w-5 h-4 md:h-5 animate-spin" /> : <Save className="w-4 md:w-5 h-4 md:h-5" />}
                        {saving ? 'SYNCING...' : 'SWAP VISUAL'}
                    </Button>
                </div>
            </Card>

            {/* Asset Picker Modal */}
            {isPickerOpen && (
                <AssetPickerModal
                    onClose={() => setIsPickerOpen(false)}
                    onSelect={(selectedUrl, selectedAlt) => {
                        setTempUrl(selectedUrl);
                        setTempAlt(selectedAlt || '');
                        setIsPickerOpen(false);
                    }}
                />
            )}
        </>
    );
}

function AssetPickerModal({ onClose, onSelect }: { onClose: () => void, onSelect: (url: string, alt: string) => void }) {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');

    useEffect(() => {
        // LOCK BODY SCROLL
        document.body.style.overflow = 'hidden';

        const fetchGallery = async () => {
            try {
                setLoading(true);
                const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
                const response = await fetch(`${API_BASE_URL}/api/media?limit=100`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = await response.json();
                if (data.success) {
                    setImages(Array.isArray(data.data) ? data.data : (data.data.images || []));
                }
            } catch (error) {
                console.error("Picker fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();

        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const filteredImages = category === 'all' ? images : images.filter(img => img.category === category);

    const availableCategories = useMemo(() => {
        const cats = new Set(images.map(img => img.category).filter(Boolean));
        return ['all', ...Array.from(cats)].sort();
    }, [images]);

    return (
        <div className="fixed inset-0 z-[9999] bg-stone-50 flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Elite Archive Header */}
            <div className="bg-white border-b border-stone-200 px-12 py-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-navy-950 rounded-2xl flex items-center justify-center shadow-xl shadow-navy-950/20">
                        <Layers className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-navy-950">Visual Archive Protocol</h2>
                        <p className="text-[10px] font-black text-navy-300 uppercase tracking-[0.4em] italic mt-1 font-mono">Selecting Dynamic Asset for Deployment</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-wrap bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                        {availableCategories.map((cat: any) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={cn(
                                    "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    category === cat ? "bg-white text-navy-950 shadow-lg scale-105" : "text-navy-400 hover:text-navy-950"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-100 text-navy-950 hover:bg-navy-950 hover:text-white transition-all flex items-center justify-center shadow-sm group"
                    >
                        <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                    </button>
                </div>
            </div>

            {/* Expansive Grid Surface */}
            <div className="flex-grow overflow-y-auto p-12 bg-stone-50/50">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6">
                        <RefreshCcw className="w-12 h-12 text-navy-200 animate-spin" />
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-navy-300 animate-pulse">Scanning Cloud Storage Nodes...</p>
                    </div>
                ) : (
                    <div className="max-w-[1700px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10 pb-24">
                        {filteredImages.map((img) => (
                            <div
                                key={img._id || img.id}
                                onClick={() => onSelect(img.url, img.altText || img.alt)}
                                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white cursor-pointer ring-offset-4 ring-gold-500 hover:ring-4 transition-all shadow-xl hover:-translate-y-2 duration-500 border-4 border-white"
                            >
                                <Image
                                    src={img.url}
                                    alt={img.title || 'Gallery Asset'}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                    <p className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1 truncate">{img.title || 'UNNAMED_ASSET'}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[8px] font-bold text-white/70 uppercase tracking-widest">{img.category}</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[8px] font-black text-navy-950 opacity-0 group-hover:opacity-100 transition-opacity">
                                    CLOUD_ID: {img._id?.slice(-6).toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Semantic Footer */}
            <div className="bg-white border-t border-stone-200 px-12 py-6 flex justify-between items-center text-[10px] font-black text-navy-300 uppercase tracking-widest italic">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2">• Select asset to initialize hot-swap protocol</span>
                    <span className="flex items-center gap-2">• Only verified high-res assets listed</span>
                </div>
                <p>Global Detected Assets: {filteredImages.length}</p>
            </div>
        </div>
    );
}
