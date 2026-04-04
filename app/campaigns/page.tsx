"use client";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Elements";
import { Heart, Globe, Anchor, Tent, ChevronRight, Share2, Play } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getSafeSrc, getAlt } from "@/lib/utils";

export default function CampaignsPage() {
    const campaigns = [
        {
            id: "dignity-for-all",
            title: "DIGNITY FOR ALL",
            subtitle: "THE CORE MISSION",
            desc: "Our primary initiative to ensure that every unclaimed body or person from an underprivileged background receives a sacred and dignified final farewell.",
            stats: "8,500+ Lives Honored",
            color: "bg-[#7ab800]",
            icon: Heart,
            image: "/gallery/gallery_peaceful_departure_1772861335733.png"
        },
        {
            id: "adopt-a-city",
            title: "ADOPT A CITY",
            subtitle: "SCALE THE FORCE",
            desc: "An initiative for institutional donors to adopt the entire operations of a tier-2 city, providing fuel, ambulances, and ritual materials for a full year.",
            stats: "12 Cities Adopted",
            color: "bg-stone-900",
            icon: Globe,
            image: "/gallery/gallery_ambulance_unit_1772862517482.png"
        },
        {
            id: "sacred-river",
            title: "SACRED RIVER",
            subtitle: "ENVIRONMENTAL RITES",
            desc: "Revolutionizing the way ash immersion happens. We use eco-friendly materials and ensure rivers remain clean while fulfilling spiritual obligations.",
            stats: "Eco-Friendly Rites",
            color: "bg-[#7ab800]",
            icon: Anchor,
            image: "/gallery/gallery_cremation_ceremony_1772861295131.png"
        },
        {
            id: "home-for-saathis",
            title: "SAATHI SHELTER",
            subtitle: "CARE FOR THE CARERS",
            desc: "Building transit homes and mental health support centers for our volunteer force who work 24/7 in the most challenging conditions.",
            stats: "4 Support Hubs Built",
            color: "bg-stone-900",
            icon: Tent,
            image: "/gallery/gallery_volunteer_meeting_1772862633347.png"
        }
    ];

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-100">
                    <Image 
                        src="/gallery/gallery_community_support_1772861359875.png" 
                        alt={getAlt("/gallery/gallery_community_support_1772861359875.png", null, "Community Support")} 
                        fill 
                        sizes="100vw"
                        className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-stone-900/60" />
                </div>
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">ACTIVE INITIATIVES</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">OUR GLOBAL <br /><span className="text-[#7ab800]">CAMPAIGNS</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            Targeted efforts to tackle specific challenges in the humanitarian space.
                            Find a cause that resonates with your vision for a better world.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Campaigns List */}
            <section className="py-20">
                <Container>
                    <div className="flex flex-col gap-24">
                        {campaigns.map((campaign, i) => (
                            <div key={campaign.id} className={cn(
                                "flex flex-col lg:items-center gap-12 lg:gap-20",
                                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                            )}>
                                {/* Visual Side */}
                                <div className="lg:w-1/2 w-full">
                                    <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl group">
                                        <Image 
                                            src={getSafeSrc(campaign.image)} 
                                            alt={getAlt(campaign.image, null, campaign.title)} 
                                            fill 
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                                        />
                                        <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-all" />
                                        <div className="absolute top-8 left-8">
                                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl", campaign.color)}>
                                                <campaign.icon size={32} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white text-[11px] font-black uppercase tracking-widest">
                                            {campaign.stats}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="lg:w-1/2 text-left">
                                    <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] mb-4">✦ {campaign.subtitle}</p>
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 leading-[0.85] mb-8">{campaign.title}</h2>
                                    <p className="text-stone-500 font-medium text-lg leading-relaxed mb-10">
                                        {campaign.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <Link href={`/campaigns/${campaign.id}`} className="flex-1 sm:flex-none">
                                            <Button className="w-full bg-stone-900 text-white font-black px-10 py-5 rounded-full text-[12px] tracking-widest hover:bg-[#7ab800] transition-all">
                                                EXPLORE CAMPAIGN
                                            </Button>
                                        </Link>
                                        <button className="w-14 h-14 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-[#7ab800] hover:border-[#7ab800] transition-all">
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Support Message */}
            <section className="py-24 bg-white border-t border-stone-100">
                <Container>
                    <div className="max-w-4xl mx-auto p-12 md:p-20 bg-stone-50 border border-stone-200 rounded-[5rem] text-center shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7ab800]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-stone-800 mb-8 leading-[0.85]">CAN&apos;T CHOOSE A <span className="text-[#7ab800]">CAUSE?</span></h2>
                        <p className="text-stone-500 font-medium text-lg leading-relaxed mb-12">
                            Your general contribution allows us to allocate funds to the
                            most urgent needs of the hour. Trust us to lead where the pain is deepest.
                        </p>
                        <Button className="px-12 py-5 bg-[#7ab800] text-white font-black text-[13px] tracking-widest rounded-full shadow-2xl shadow-[#7ab800]/20">DONATE TO GENERAL FUND</Button>
                    </div>
                </Container>
            </section>
        </main>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
