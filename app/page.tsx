"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Flame, Users, Heart, FileText, Star, Shield, Play,
  HandHeart, Globe, ArrowRight, Cross, HelpingHand,
  Activity, Scale, Building2, ShieldCheck, Handshake
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Elements";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const heroSlides = [
  "/gallery/image1.png",
  "/gallery/image02.png",
  "/gallery/image03.png",
  "/gallery/image2.png",
  "/gallery/image3.png",
  "/gallery/image6.png",
];

const programmes = [
  { 
    title: "Final Journey", 
    icon: Flame, 
    desc: "Providing dignified transportation and sacred final rites for unclaimed souls with complete respect and traditional ceremonies.",
    img: "/gallery/image001.png"
  },
  { 
    title: "Compassionate Care", 
    icon: Heart, 
    desc: "Supporting families in need with emotional, logistical and financial assistance during their most difficult times.",
    img: "/gallery/image002.png"
  },
  { 
    title: "Community Outreach", 
    icon: Users, 
    desc: "Educating communities about dignity in death and building awareness for those who have no one to care.",
    img: "/gallery/image003.png"
  },
  { 
    title: "Sacred Documentation", 
    icon: FileText, 
    desc: "Maintaining proper records and ensuring legal compliance while honoring the memory of every soul we serve.",
    img: "/gallery/image004.png"
  },
];

const sdgs = [
  { n: "01", t: "FINAL DIGNITY", c: "bg-orange-600", i: Heart },
  { n: "02", t: "SACRED RITES", c: "bg-[#f4c430]", i: Flame },
  { n: "03", t: "RESTORING HUMANITY", c: "bg-sky-700", i: Users },
  { n: "04", t: "LEGAL SANCTITY", i: ShieldCheck, c: "bg-stone-700" },
  { n: "05", t: "MISSION UNITY", c: "bg-indigo-600", i: Handshake },
];

const testimonialSlides = [
  { quote: "Moksha Seva provided a dignified farewell when we had no one else to turn to.", author: "Rajesh K., Beneficiary" },
  { quote: "Their dedication to the sacred rites of unclaimed souls is truly divine work.", author: "Pritam S., Local Partner" },
  { quote: "A world-class organization that treats every human being with ultimate respect.", author: "Anita D., Volunteer" },
];

const govPartners = [
  { name: "MCG", label: "MUNICIPAL CORPORATION" },
  { name: "UP GOVT", label: "DEPARTMENT OF HEALTH" },
  { name: "DELHI POLICE", label: "INSTITUTIONAL PARTNER" },
  { name: "NRHM", label: "NATIONAL HEALTH MISSION" },
];

const campaigns = [
  { t: "KASHI GHAT MISSION", d: "Revitalizing the final rites facilities at the sacred Manikarnika Ghat.", targeted: "₹5,00,000", raised: "₹3,20,000", p: "64%", img: "/gallery/image1.png" },
  { t: "NEW ANTIM YATRA VAN", d: "Aiding the purchase of a specialized mobile unit for the Delhi-NCR hub.", targeted: "₹12,00,000", raised: "₹7,80,000", p: "65%", img: "/gallery/hero_moksha_1.png" },
  { t: "SACRED OIL FUND", d: "Ensuring a steady supply of traditional oils and materials for unclaimed rites.", targeted: "₹1,00,000", raised: "₹85,000", p: "85%", img: "/gallery/gallery_peaceful_departure_1772861335733.png" },
];

const timeline = [
  { year: "2018", event: "Mission started in a single city with 1 volunteer.", icon: Star, desc: "A humble beginning focused on the unclaimed souls of a single city hub." },
  { year: "2020", event: "Reached the milestone of 500+ dignified cremations.", icon: Heart, desc: "Establishing ourselves as a beacon of hope for the destitute during times of loss." },
  { year: "2023", event: "Expanded to 30+ cities across Northern India.", icon: Globe, desc: "Scaling our specialized mobile units to serve a wider humanitarian landscape." },
  { year: "2026", event: "Operating in 38 cities with 400+ active volunteers.", icon: Users, desc: "A national force for terminal dignity, powered by thousands of supporters." },
];

const mediaLogos = ["TIMES OF INDIA", "DAINIK BHASKAR", "AAJ TAK", "NDTV", "HINDUSTAN TIMES"];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentLocationSlide, setCurrentLocationSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentCampaignSlide, setCurrentCampaignSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const locationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const campaignTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    
    // Location carousel timer
    if (locationTimerRef.current) clearInterval(locationTimerRef.current);
    locationTimerRef.current = setInterval(() => {
      setCurrentLocationSlide((prev) => {
        const next = (prev + 1) % 4;
        console.log('Location slide changing from', prev, 'to', next);
        return next;
      });
    }, 4000);
    
    // Campaign carousel timer
    if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
    campaignTimerRef.current = setInterval(() => {
      setCurrentCampaignSlide((prev) => (prev + 1) % campaigns.length);
    }, 6000);
    
    const tTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialSlides.length);
    }, 6000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationTimerRef.current) clearInterval(locationTimerRef.current);
      if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
      clearInterval(tTimer);
    };
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      {/* ── HERO (HINDU RITUALS & SACRED DEPARTURE) ── */}
      <section className="relative h-[60vh] md:h-[75vh] lg:h-[85vh] w-full overflow-hidden bg-black border-b-[8px] border-[#f4c430]">
        {heroSlides.map((src, idx) => (
          <div
            key={src}
            className={cn(
              "absolute inset-0 transition-all duration-[2000ms] ease-in-out",
              idx === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            )}
          >
            <Image
              src={src}
              alt="Moksha Seva Sacred Mission"
              fill
              className="object-cover"
              style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
              priority={idx === 0}
            />
          </div>
        ))}

        {/* Dynamic Progress Indicator (Smile Style) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-2 flex bg-black/10">
          {heroSlides.map((_, idx) => (
            <div key={idx} className="flex-1 h-full overflow-hidden bg-white/10">
              <div
                className={cn(
                  "h-full bg-[#f4c430] transition-all duration-[5000ms] ease-linear",
                  idx === currentSlide ? "w-full" : "w-0"
                )}
              />
            </div>
          ))}
        </div>

        {/* Floating Indicator Dots */}
        <div className="absolute bottom-6 right-6 z-30 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                startTimer();
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                idx === currentSlide ? "w-12 bg-[#f4c430]" : "w-2 bg-white/30 hover:bg-white"
              )}
            />
          ))}
        </div>
      </section>

      {/* Action Banner */}
      <div className="bg-black py-4">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-white text-xl md:text-2xl font-semibold">
            Free Sacred Rites for Unclaimed Souls • Dignity for the Forgotten
          </h2>
          <div className="flex gap-4">
            <Link href="/report">
              <Button className="px-6 py-2 bg-white text-black hover:bg-gray-100 font-medium">
                Report a Case
              </Button>
            </Link>
            <Link href="/donate">
              <Button className="px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 font-medium">
                Donate Now
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* About Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gray-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-gray-100/10 to-gray-100/10 rounded-full blur-3xl"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                <span className="text-gray-600 text-sm uppercase tracking-wider font-medium">About Moksha Seva</span>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Restoring Dignity to the 
                <span className="text-gray-700 block">Final Journey</span>
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Moksha Seva is dedicated to ensuring that no soul departs this world without the sacred rites and dignity they deserve. We serve as guardians of humanity&apos;s final chapter, providing compassionate care when families cannot.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Founded on the principle that every life has value, we have transformed the way unclaimed souls are honored across India. Through traditional Hindu rites, modern logistics, and unwavering compassion, we bridge the gap between abandonment and sacred departure.
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900 mb-1">5000+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Souls Served</div>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900 mb-1">38+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Cities</div>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Service</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <Button className="px-8 py-3 bg-gray-800 text-white hover:bg-gray-900 transition-colors shadow-lg">
                    Learn More
                  </Button>
                </Link>
                <Link href="/volunteer">
                  <Button variant="ghost" className="px-8 py-3 bg-white/80 text-gray-900 hover:bg-white border border-gray-200 transition-colors">
                    Join Our Mission
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Image Side */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Main image container with enhanced styling */}
                <div className="relative">
                  {/* Background decoration */}
                  <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-3xl blur-sm"></div>
                  
                  {/* Main image */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-sm">
                    <Image
                      src="/gallery/image001.png"
                      alt="Moksha Seva - Dignified Final Journey"
                      fill
                      className="object-cover"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900">Serving with Dignity</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Sacred Mission</div>
                        <div className="text-xs text-gray-600">Since 2018</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Seva - Enhanced */}
      <section className="py-12 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236b7280' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              <span className="text-gray-600 text-sm uppercase tracking-wider font-medium">Our Sacred Services</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Seva</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive support with compassion and dignity, ensuring every soul receives the respect they deserve in their final journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programmes.map((p, index) => (
              <div key={p.title} className="group relative">
                {/* Card */}
                <div className="relative h-full bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-200/20 to-transparent rounded-bl-3xl rounded-tr-3xl"></div>
                  
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <p.icon className="w-10 h-10 text-gray-700" />
                    </div>
                    {/* Floating number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-gray-700 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed mb-6">
                    {p.desc}
                  </p>
                  
                  {/* Service image */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-md">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Learn more link */}
                  <div className="text-center">
                    <Link 
                      href={
                        p.title === "Final Journey" ? "/services/final-journey" :
                        p.title === "Compassionate Care" ? "/services/compassionate-care" :
                        p.title === "Community Outreach" ? "/services/community-outreach" :
                        p.title === "Sacred Documentation" ? "/services/sacred-documentation" :
                        "/services"
                      } 
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors group/link"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Where We Serve */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 uppercase tracking-wider">Our Presence</span>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Where We Serve</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From the sacred ghats of Kashi to the holy waters of Haridwar, we bring dignity and compassion 
              to every corner where souls seek their final peace.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Featured Image Carousel */}
              <div className="lg:col-span-3">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-gray-100 rounded-2xl"></div>
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                    {/* Carousel Images */}
                    {[
                      { src: "/gallery/image001.png", title: "Sacred Kashi", desc: "Where eternal souls find liberation", location: "Primary Hub" },
                      { src: "/gallery/image002.png", title: "Holy Haridwar", desc: "Gateway to divine blessings", location: "Regional Center" },
                      { src: "/gallery/image003.png", title: "Sacred Prayagraj", desc: "Confluence of holy rivers", location: "Active Hub" },
                      { src: "/gallery/image004.png", title: "Peaceful Service", desc: "Compassionate care for all souls", location: "Service Network" },
                    ].map((slide, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "absolute inset-0 transition-all duration-1000 ease-in-out",
                          idx === currentLocationSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                        )}
                      >
                        <Image
                          src={slide.src}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">{slide.location}</span>
                          </div>
                          <h3 className="text-3xl font-bold mb-2">{slide.title}</h3>
                          <p className="text-lg opacity-90">{slide.desc}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Carousel Controls */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      {[...Array(4)].map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentLocationSlide(idx);
                            // Reset timer
                            if (locationTimerRef.current) clearInterval(locationTimerRef.current);
                            locationTimerRef.current = setInterval(() => {
                              setCurrentLocationSlide((prev) => (prev + 1) % 4);
                            }, 4000);
                          }}
                          className={cn(
                            "h-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/80",
                            idx === currentLocationSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Network Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Active Network</h3>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {[
                      { city: "Haridwar", status: "24/7 Active" },
                      { city: "Prayagraj", status: "Full Service" },
                      { city: "Rishikesh", status: "Active Hub" },
                      
                    ].map((location) => (
                      <div key={location.city} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-125 transition-transform"></div>
                          <span className="font-medium text-gray-800">{location.city}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {location.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">38+</div>
                        <div className="text-sm text-gray-600">Sacred Cities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
                        <div className="text-sm text-gray-600">Service</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Network */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200 mb-6">
                <span className="text-sm font-medium text-gray-700">Complete Network Coverage</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {["Lucknow", "Patna", "Ujjain", "Gaya", "Agra", "Kanpur", "Allahabad", "Varanasi"].map((city) => (
                  <div key={city} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all">
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission Pillars */}
      <section className="py-12 bg-stone-100 relative overflow-hidden">
        <Container>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-amber-700"></div>
              <span className="text-amber-800 text-sm uppercase tracking-wider">Core Values</span>
              <div className="w-8 h-px bg-amber-700"></div>
            </div>
            <h2 className="text-3xl font-bold text-amber-900 mb-3">Mission Pillars</h2>
            <p className="text-amber-800 max-w-2xl mx-auto">
              Five sacred principles guiding our mission
            </p>
          </div>

          {/* Compact Marigold Garland */}
          <div className="w-full px-4">
            <div className="relative">
              {/* Simple Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-300 hidden lg:block"></div>

              {/* Flowers in a Row */}
              <div className="flex justify-center items-center gap-6 md:gap-12 lg:gap-16">
                {[
                  { title: "Final Dignity", icon: Heart, number: "01" },
                  { title: "Sacred Rites", icon: Flame, number: "02" },
                  { title: "Restoring Humanity", icon: Users, number: "03" },
                  { title: "Legal Sanctity", icon: ShieldCheck, number: "04" },
                  { title: "Mission Unity", icon: Handshake, number: "05" },
                ].map((pillar, index) => (
                  <div 
                    key={pillar.number} 
                    className={cn(
                      "group relative transition-all duration-300 hover:-translate-y-1",
                      // Subtle alternating heights
                      index % 2 === 0 ? "mt-0" : "mt-2"
                    )}
                  >
                    {/* Simple Flower Design */}
                    <div className="relative">
                      {/* Main Flower Circle */}
                      <div className="relative w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center shadow-md border-2 border-stone-200 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        {/* Icon */}
                        <pillar.icon className="w-6 h-6 text-amber-800 group-hover:text-amber-900" />
                        
                        {/* Number Badge */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-800 text-stone-50 rounded-full flex items-center justify-center text-xs font-bold">
                          {pillar.number}
                        </div>
                      </div>
                    </div>

                    {/* Title below */}
                    <div className="text-center mt-4">
                      <h3 className="text-xs font-medium text-amber-800 group-hover:text-amber-900 transition-colors leading-tight">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-stone-50 rounded-full shadow-sm border border-amber-200">
                <span className="text-amber-800 text-sm">United in Service, Guided by Compassion</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STORIES IN MOTION (CAROUSEL) ── */}
      <section className="py-12 bg-white overflow-hidden">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-stone-900 leading-none border-b-4 border-[#f4c430] inline-block pb-1">STORIES IN MOTION</h2>
          </div>

          <div className="relative group/carousel">
            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-4 -mx-4">
              {[
                { img: "/gallery/image005.png", t: "SACRED KASHI RITES" },
                { img: "/gallery/image006.png", t: "MISSION PRAYAGRAJ" },
                { img: "/gallery/image007.png", t: "FINAL JOURNEY" },
                { img: "/gallery/image008.png", t: "AMBULANCE SERVICE" },
                { img: "/gallery/image009.png", t: "DIGNIFIED FAREWELL" },
              ].map((story, i) => (
                <div key={i} className="relative min-w-[280px] md:min-w-[400px] aspect-[16/10] rounded-[2rem] overflow-hidden group shadow-lg">
                  <Image src={story.img} alt={story.t} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-all">
                    <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:bg-[#f4c430] transition-all">
                      <Play className="text-white fill-white ml-1" size={24} />
                    </div>
                  </div> */}
                  <div className="absolute bottom-5 left-6">
                    <p className="text-white font-black uppercase text-[10px] tracking-widest">{story.t}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Indicator for scrolling hint */}
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-12 h-12 bg-white shadow-2xl rounded-full hidden md:flex items-center justify-center text-stone-400 group-hover/carousel:-right-6 transition-all border border-stone-100 italic">
              <ChevronRight size={24} className="animate-pulse" />
            </div>
          </div>
        </Container>
      </section>

      {/* Join The Mission */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gallery/image4.png"
            alt="Join the Mission"
            fill
            className="object-cover"
          />
          {/* Simple curved gradient - dark on left for text, clear on right for image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#20b2aa]/10 border border-[#20b2aa]/20 mb-6 backdrop-blur-md">
              <p className="text-[#20b2aa] font-black text-[10px] uppercase tracking-[0.4em] leading-none">MISSION SAATHI PORTAL</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.85] mb-8">STAND WITH US <br />IN THE <span className="text-[#f4c430]">FINAL JOURNEY</span></h2>
            <p className="text-white/90 font-medium text-lg mb-10 leading-snug drop-shadow-lg">Whether you have an hour a week or a lifetime to give, your presence can bring dignity to a soul forgotten by the world. Join our specialized hubs in 38+ cities.</p>

            <div className="flex flex-wrap gap-4">
              <Link href="/volunteer">
                <Button variant="ghost" className="px-8 py-3 bg-gray-600 text-white hover:bg-gray-700 transition-colors">JOIN OUR FORCE</Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="px-8 py-3 bg-white text-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition-colors">VIEW OPPORTUNITIES</Button>
              </Link>
            </div>

            <div className="mt-12 flex gap-10 border-t border-white/10 pt-10">
              <div className="flex flex-col">
                <p className="text-white font-black text-2xl tracking-tighter leading-none mb-1">400+</p>
                <p className="text-stone-400 font-black text-[9px] uppercase tracking-widest leading-none">ON-GROUND SATHIS</p>
              </div>
              <div className="flex flex-col">
                <p className="text-white font-black text-2xl tracking-tighter leading-none mb-1">24/7</p>
                <p className="text-stone-400 font-black text-[9px] uppercase tracking-widest leading-none">MISSION SUPPORT</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Urgent Campaigns */}
      <section className="py-12 bg-gradient-to-br from-stone-50 to-stone-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
              <span className="text-amber-700 text-sm uppercase tracking-wider font-medium">Active Missions</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            </div>
            <h2 className="text-4xl font-bold text-black mb-3">Urgent Campaigns</h2>
            <p className="text-black text-lg">Support our sacred missions across India</p>
          </div>
          
          {/* Enhanced 3D Circular Carousel */}
          <div className="relative max-w-7xl mx-auto h-[500px] overflow-visible" style={{ perspective: '1200px' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              {campaigns.map((c, index) => {
                // Calculate position relative to current slide
                let position = index - currentCampaignSlide;
                if (position < 0) position += campaigns.length;
                if (position >= campaigns.length) position -= campaigns.length;
                
                // Enhanced 3D positioning
                let transform = '';
                let zIndex = 0;
                let opacity = 0.3;
                let scale = 0.7;
                let blur = 'blur(2px)';
                
                if (position === 0) {
                  // Center (active) - enhanced
                  transform = 'translateX(0) translateY(0) translateZ(50px) rotateY(0deg)';
                  zIndex = 50;
                  opacity = 1;
                  scale = 1.05;
                  blur = 'blur(0px)';
                } else if (position === 1) {
                  // Right side - enhanced depth
                  transform = 'translateX(350px) translateY(20px) translateZ(-150px) rotateY(-35deg)';
                  zIndex = 30;
                  opacity = 0.6;
                  scale = 0.8;
                  blur = 'blur(1px)';
                } else if (position === 2) {
                  // Left side - enhanced depth
                  transform = 'translateX(-350px) translateY(20px) translateZ(-150px) rotateY(35deg)';
                  zIndex = 30;
                  opacity = 0.6;
                  scale = 0.8;
                  blur = 'blur(1px)';
                }
                
                return (
                  <div
                    key={c.t}
                    className="absolute transition-all duration-1000 ease-out cursor-pointer group"
                    style={{
                      transform: `${transform} scale(${scale})`,
                      zIndex,
                      opacity,
                      filter: blur,
                    }}
                    onClick={() => {
                      if (position !== 0) {
                        setCurrentCampaignSlide(index);
                        // Reset timer when manually clicked
                        if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
                        campaignTimerRef.current = setInterval(() => {
                          setCurrentCampaignSlide((prev) => (prev + 1) % campaigns.length);
                        }, 6000);
                      }
                    }}
                  >
                    <div className={cn(
                      "w-80 bg-white rounded-3xl overflow-hidden transition-all duration-500",
                      position === 0 
                        ? "shadow-2xl shadow-gray-900/20 ring-1 ring-gray-200" 
                        : "shadow-lg shadow-gray-500/20 hover:shadow-xl"
                    )}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image 
                          src={c.img} 
                          alt={c.t} 
                          fill 
                          className={cn(
                            "object-cover transition-transform duration-700",
                            position === 0 ? "scale-100" : "scale-105 group-hover:scale-100"
                          )} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Enhanced overlay content */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Active Campaign</span>
                          </div>
                          <h4 className="text-white font-bold text-xl mb-3 leading-tight">{c.t}</h4>
                          
                          {/* Enhanced progress bar */}
                          <div className="relative mb-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 w-full overflow-hidden">
                              <div 
                                className="bg-white h-full rounded-full transition-all duration-1000"
                                style={{ width: c.p }}
                              >
                              </div>
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-white">
                            <div className="text-sm">
                              <span className="text-white/70">Raised: </span>
                              <span className="font-semibold">{c.raised}</span>
                            </div>
                            <div className="text-sm font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              {c.p}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced card content */}
                      <div className="p-6">
                        <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2">{c.d}</p>
                        <Link href="/donate">
                          <Button 
                            variant="ghost" 
                            className={cn(
                              "w-full transition-all duration-300",
                              position === 0 
                                ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 shadow-lg" 
                                : "bg-gray-600 text-white hover:bg-gray-700"
                            )}
                          >
                            {position === 0 ? "Donate Now" : "View Campaign"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Navigation Arrows */}
            <button
              onClick={() => {
                setCurrentCampaignSlide((prev) => (prev - 1 + campaigns.length) % campaigns.length);
                if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
                campaignTimerRef.current = setInterval(() => {
                  setCurrentCampaignSlide((prev) => (prev + 1) % campaigns.length);
                }, 6000);
              }}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-50 backdrop-blur-sm border border-gray-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => {
                setCurrentCampaignSlide((prev) => (prev + 1) % campaigns.length);
                if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
                campaignTimerRef.current = setInterval(() => {
                  setCurrentCampaignSlide((prev) => (prev + 1) % campaigns.length);
                }, 6000);
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-50 backdrop-blur-sm border border-gray-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
              {campaigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCampaignSlide(index);
                    if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
                    campaignTimerRef.current = setInterval(() => {
                      setCurrentCampaignSlide((prev) => (prev + 1) % campaigns.length);
                    }, 6000);
                  }}
                  className={cn(
                    "h-3 rounded-full transition-all duration-500 border-2",
                    index === currentCampaignSlide 
                      ? "w-12 bg-gray-700 border-gray-700 shadow-lg" 
                      : "w-3 bg-white/70 border-gray-300 hover:bg-white hover:border-gray-400"
                  )}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>
      {/* <section className="py-10 bg-stone-100">
        <Container>
          <div className="bg-stone-50 rounded-[3rem] p-8 md:p-14 border border-amber-200 shadow-2xl flex flex-col md:flex-row items-center gap-12 border-t-8 border-t-amber-600">
            <div className="w-full md:w-1/3 aspect-square rounded-[2rem] overflow-hidden rotate-2 shadow-2xl grayscale hover:rotate-0 hover:grayscale-0 transition-all duration-700 relative">
              <Image src="/gallery/image006.png" alt="Legacy" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-amber-900 leading-none mb-4">LEAVE A LEGACY <br /><span className="text-amber-700">IN THEIR HONOR</span></h2>
              <p className="text-amber-800 font-medium text-lg leading-snug mb-8">Donate a &apos;Sacred Kit&apos; in memory of your loved ones. We will perform the rites in their name as a direct tribute to their life.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-100 border border-amber-200 italic">
                  <Star className="text-amber-600 shrink-0" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none text-amber-800">Named Tributes</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-100 border border-amber-200 italic">
                  <FileText className="text-amber-600 shrink-0" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none text-amber-800">Digital Certificates</p>
                </div>
              </div>
              <Link href="/donate">
                <Button variant="ghost" className="px-8 py-3 bg-amber-700 text-stone-50 hover:bg-amber-800 transition-colors">Create a Tribute</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section> */}

      {/* ── OUR SACRED JOURNEY (COMPACT HORIZONTAL) ── */}
      <section className="py-12 bg-stone-950 border-y border-stone-800">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="shrink-0 text-center md:text-left">
              <p className="text-[#f4c430] font-black text-[10px] uppercase tracking-[0.4em] mb-2 leading-none">THE CHRONICLE</p>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-none">OUR SACRED<br className="hidden md:block" /> JOURNEY</h2>
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-start gap-8 md:gap-12">
              {timeline.map((item, i) => (
                <div key={i} className="flex flex-col items-center md:items-start max-w-[160px] group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#f4c430]/20 flex items-center justify-center border border-[#f4c430]/50 group-hover:bg-[#f4c430] transition-all">
                      <item.icon size={14} className="text-[#f4c430] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-white font-black text-xl tracking-tighter leading-none">{item.year}</p>
                  </div>
                  <p className="text-stone-500 font-bold uppercase text-[10px] leading-tight tracking-wider">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── TRANSPARENCY (NEW) ── */}
      <section className="py-10 bg-white border-y border-stone-100">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-stone-900 leading-[0.85] mb-6">TRANSPARENCY <br /><span className="text-[#20b2aa]">IS OUR SANCTITY</span></h2>
              <p className="text-stone-500 font-medium text-lg leading-snug mb-8 max-w-md">Every rupee donated to Moksha Seva is a sacred trust. We maintain 100% visibility on all our mission operational costs and final rites expenditures.</p>
              <div className="space-y-4">
                {[
                  { l: "Direct Mission Costs", p: "82%" },
                  { l: "Service Maintenance", p: "12%" },
                  { l: "Administrative Support", p: "6%" },
                ].map((stat) => (
                  <div key={stat.l}>
                    <div className="flex justify-between font-black uppercase text-[10px] tracking-widest mb-1.5 transform translate-y-0.5">
                      <span>{stat.l}</span>
                      <span>{stat.p}</span>
                    </div>
                    <div className="bg-stone-100 h-1.5 w-full rounded-full overflow-hidden">
                      <div className="bg-[#20b2aa] h-full rounded-full" style={{ width: stat.p }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-100 rotate-1 shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-stone-900">YOUR TRUST MATTERS</h3>
              <p className="text-stone-500 font-medium mb-6">We are committed to the values of absolute accountability as established by our founding charter.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
                  <p className="text-[#f4c430] font-black text-2xl tracking-tighter">80G</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-stone-400">TAX EXEMPT READY</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
                  <p className="text-orange-600 font-black text-2xl tracking-tighter">100%</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-stone-400">MISSION FOCUSED</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── MEDIA RECOGNITION (NEW) ── */}
      <section className="py-10 bg-white">
        <Container>
          <p className="text-center text-stone-400 font-black text-[10px] uppercase tracking-[0.4em] mb-8">IN NATIONAL MEDIA</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {mediaLogos.map((logo) => (
              <div key={logo} className="text-xl md:text-2xl font-black uppercase tracking-tighter text-stone-900 border-x border-stone-900/10 px-4">{logo}</div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── VOICES OF CHANGE (TESTIMONIALS) ── */}
      <section className="py-10 bg-stone-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              <p className="text-[#f4c430] font-black text-[10px] uppercase tracking-widest mb-2">WHISPERED VOICES</p>
              <div className="relative">
                {testimonialSlides.map((t, i) => (
                  <div key={i} className={cn("transition-all duration-1000", i === currentTestimonial ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0")}>
                    <p className="text-white text-xl md:text-3xl font-black italic tracking-tighter leading-tight mb-6">&quot;{t.quote}&quot;</p>
                    <p className="text-stone-400 font-bold uppercase text-xs tracking-widest">— {t.author}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-10">
              {testimonialSlides.map((_, i) => (
                <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === currentTestimonial ? "w-8 bg-[#f4c430]" : "w-2 bg-white/20")} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── GOVERNMENT PARTNERS ── */}
      <section className="py-12 bg-stone-50">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-stone-400 leading-none underline decoration-stone-200 decoration-1 underline-offset-[10px]">GOVERNMENT & INSTITUTIONAL PARTNERS</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {govPartners.map((gp) => (
              <div key={gp.name} className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-stone-900 border-b-2 border-stone-900 pb-1">{gp.name}</div>
                <p className="text-[8px] font-black uppercase tracking-widest mt-2 text-stone-500">{gp.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SACRED KNOWLEDGE (FAQ) ── */}
      <section className="py-10 bg-white border-y border-stone-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-900 border-b-4 border-[#f4c430] inline-block pb-1">FREQUENT QUESTIONS</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "HOW ARE CASES REPORTED?", a: "Our 24/7 mission helpline receives calls from police departments, hospitals, and kind-hearted citizens." },
                { q: "ARE TRADITIONAL RITES FOLLOWED?", a: "Yes. Every 'Antyesti' is performed strictly according to sacred Hindu traditions by our staff priests." },
                { q: "IS THE DONATION TAX-EXEMPT?", a: "Yes, Moksha Seva is a registered entity and all donations are 80G tax-exempted according to regulations." },
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-[#20b2aa]/20 hover:bg-white transition-all group cursor-default">
                  <p className="font-black text-sm uppercase tracking-tighter text-stone-900 mb-2 group-hover:text-[#20b2aa] transition-colors">{faq.q}</p>
                  <p className="text-stone-500 text-sm font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <style jsx global>{`
        .clip-path-hexagon {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
      `}</style>
    </div>
  );
}

function ChevronRight({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
