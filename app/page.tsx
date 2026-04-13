"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Globe, Heart, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Elements";
import { usePageConfig } from "@/hooks/usePageConfig";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { cn, getSafeSrc, getAlt } from '@/lib/utils';
import { homepageConfig } from "@/config/homepage.config";
import { getIcon } from "@/config/icons.config";
import { getRatioClass } from "@/lib/ratios";

export default function HomePage() {
  const { config: dynamicConfig, seo, loading } = usePageConfig('homepage', homepageConfig);
  const config = dynamicConfig || homepageConfig;


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
      setCurrentSlide((prev) => (prev + 1) % config.hero.slides.length);
    }, config.hero.autoSlideInterval);
  };

  useEffect(() => {
    if (!config.hero?.slides) return;

    startTimer();
    if (config.whereWeServe?.carousel?.slides) {
      if (locationTimerRef.current) clearInterval(locationTimerRef.current);
      locationTimerRef.current = setInterval(() => {
        setCurrentLocationSlide((prev) => {
          const next = (prev + 1) % config.whereWeServe.carousel.slides.length;
          console.log('Location slide changing from', prev, 'to', next);
          return next;
        });
      }, config.whereWeServe.carousel.autoSlideInterval);
    }
    if (config.urgentCampaigns?.campaigns) {
      if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
      campaignTimerRef.current = setInterval(() => {
        setCurrentCampaignSlide((prev) => (prev + 1) % config.urgentCampaigns.campaigns.length);
      }, config.urgentCampaigns.autoSlideInterval);
    }
    if (config.testimonials?.slides) {
      const tTimer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % config.testimonials.slides.length);
      }, config.testimonials.autoSlideInterval);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (locationTimerRef.current) clearInterval(locationTimerRef.current);
        if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
        clearInterval(tTimer);
      };
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationTimerRef.current) clearInterval(locationTimerRef.current);
      if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
    };
  }, [config]);

  // Show premium loading state
  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <Skeleton className="h-[75vh] w-full" />
        <Container className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      {/* ── SEO DYNAMIC H1 ── */}
      {config.seo?.h1Tag && (
        <h2 className="sr-only">{config.seo.h1Tag}</h2>
      )}
      {!config.seo?.h1Tag && config.about?.title && (
        <h2 className="sr-only">{config.about.title} {config.about.titleHighlight}</h2>
      )}
      <section className={cn(
        "relative w-full overflow-hidden bg-white border-b-4 border-stone-100 transition-all duration-700",
        getRatioClass(config.hero.aspectRatio, "aspect-[1650/700]"),
        getRatioClass(config.hero.mobileAspectRatio, "aspect-[1650/700]")
      )}>
        {config.hero?.slides?.map((slide, idx) => {
          const src = typeof slide === 'string' ? slide : slide.src;
          const alt = getAlt(slide, seo, config.hero.altText || config.labels?.heroAltText);
          return (
            <div
              key={src}
              className={cn(
                "absolute inset-0 transition-all duration-[2000ms] ease-in-out",
                idx === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
              )}
            >
              <Image
                src={getSafeSrc(src)}
                alt={alt}
                fill
                className="object-cover"
                style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                priority={idx === 0}
              />
            </div>
          );
        })}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-2.5 flex bg-black/10">
          {config.hero?.slides?.map((_, idx) => (
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
        <div className="absolute bottom-6 right-6 z-30 flex gap-2">
          {config.hero?.slides?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                startTimer();
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-4 rounded-full transition-all duration-500 hover:scale-110",
                idx === currentSlide ? "w-12 bg-[#f4c430]" : "w-4 bg-white/40 hover:bg-white"
              )}
            />
          ))}
        </div>
      </section>


      {/* Action Banner */}
      <div className="bg-black py-4">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-white text-xl md:text-2xl font-semibold">
            {config.actionBanner?.title}
          </h1>
          <div className="flex gap-4">
            {config.actionBanner?.buttons?.map((button, index) => (
              <Link key={index} href={button.href || '#'}>
                <Button className={cn(
                  "px-6 py-2 font-medium",
                  button.variant === "primary"
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                )}>
                  {button.text}
                </Button>
              </Link>
            ))}
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
                <span className="text-gray-600 text-sm uppercase tracking-wider font-medium">{config.about.badge}</span>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {config.about.title}
                <span className="text-gray-700 block">{config.about.titleHighlight}</span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-800 mb-6 leading-relaxed font-medium">
                {config.about.description}
              </p>

              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                {config.about.secondaryDescription}
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {config.about.stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {config.about.buttons.map((button, index) => (
                  <Link key={index} href={button.href || '#'}>
                    <Button className={cn(
                      "px-8 py-3 transition-colors shadow-lg",
                      button.variant === "primary"
                        ? "bg-gray-800 text-white hover:bg-gray-900"
                        : "bg-white/80 text-gray-900 hover:bg-white border border-gray-200"
                    )}>
                      {button.text}
                    </Button>
                  </Link>
                ))}
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
                  <div className={cn(
                    "relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-sm transition-all duration-700",
                    "aspect-square lg:aspect-square"
                  )}>
                    <Image
                      src={getSafeSrc(config.about?.image)}
                      alt={getAlt(config.about?.image, seo, config.about?.alt || "Moksha Sewa - Dignified Final Journey")}
                      fill
                      className="object-contain"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                    {/* Floating badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-900">{config.about?.floatingBadge?.text || "Serving with Dignity"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-200/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {(() => {
                          const HeartIcon = getIcon("Heart");
                          return <HeartIcon className="w-5 h-5 text-gray-600" />;
                        })()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{config.about?.floatingBadge?.text || "Serving with Dignity"}</div>
                        <div className="text-xs text-gray-600">{config.about?.floatingBadge?.subtext || "Since 2026"}</div>
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
              <span className="text-gray-600 text-sm uppercase tracking-wider font-medium">{config.ourSeva.badge}</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            </div>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-8 uppercase tracking-tighter italic">{config.ourSeva.title}</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-normal italic">
              {config.ourSeva.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.ourSeva.programmes.map((p, index) => {
              const IconComponent = getIcon(p.icon);
              return (
                <div key={p.title} className="group relative">
                  {/* Card */}
                  <div className="relative h-full bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-200/20 to-transparent rounded-bl-3xl rounded-tr-3xl"></div>

                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <IconComponent className="w-10 h-10 text-gray-700" />
                      </div>
                      {/* Floating number */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-3 text-center group-hover:text-gray-700 transition-colors uppercase tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-base text-gray-600 text-center leading-relaxed mb-6 font-normal">
                      {p.description}
                    </p>

                    {/* Service image */}
                    <div className="relative aspect-[3/2] rounded-2xl overflow-hidden mb-4 shadow-md bg-stone-50">
                      <Image
                        src={getSafeSrc(p.image)}
                        alt={getAlt(p.image, seo, p.alt || p.title || "Moksha Seva Service")}
                        fill
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>

                    {/* Learn more link */}
                    <div className="text-center">
                      <Link
                        href={p.href || '#'}
                        className="inline-flex items-center gap-2 text-gray-800 hover:text-black font-semibold text-sm transition-colors group/link py-3 px-1"
                      >
                        {p.linkText || config.labels?.learnMore || "Learn More"}
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Where We Serve */}
      {config.whereWeServe && (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <Container>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-600 uppercase tracking-wider">{config.whereWeServe.badge}</span>
                <div className="w-8 h-px bg-gray-300"></div>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter italic">{config.whereWeServe.title}</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                {config.whereWeServe.description}
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
                      {config.whereWeServe.carousel.slides.map((slide, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "absolute inset-0 transition-all duration-1000 ease-in-out",
                            idx === currentLocationSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                          )}
                        >
                          <Image
                            src={getSafeSrc(slide.src)}
                            alt={getAlt(slide.src, seo, slide.alt || slide.title)}
                            fill
                            className="object-contain"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-8 left-8 text-white z-10">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium">{slide.location}</span>
                            </div>
                            <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">{slide.title}</h3>
                            <p className="text-xl opacity-95 font-medium leading-snug">{slide.description}</p>
                          </div>
                        </div>
                      ))}

                      <div className="absolute bottom-6 right-6 flex gap-3">
                        {config.whereWeServe.carousel.slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentLocationSlide(idx);
                              // Reset timer
                              if (locationTimerRef.current) clearInterval(locationTimerRef.current);
                              locationTimerRef.current = setInterval(() => {
                                setCurrentLocationSlide((prev) => (prev + 1) % config.whereWeServe.carousel.slides.length);
                              }, config.whereWeServe.carousel.autoSlideInterval);
                            }}
                            aria-label={`Go to location slide ${idx + 1}`}
                            className={cn(
                              "h-4 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/80 hover:scale-110",
                              idx === currentLocationSlide ? "w-10 bg-white" : "w-4 bg-white/50"
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
                      <h3 className="text-xl font-semibold text-gray-900">{config.whereWeServe.activeNetwork.title}</h3>
                    </div>

                    <div className="space-y-3 mb-8">
                      {config.whereWeServe.activeNetwork.locations.map((location) => (
                        <div key={location.city} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-125 transition-transform"></div>
                            <span className="font-medium text-gray-800">{location.city}</span>
                          </div>
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            {location.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="border-t pt-6">
                      <div className="grid grid-cols-2 gap-6">
                        {config.whereWeServe.activeNetwork.stats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extended Network */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200 mb-6">
                  <span className="text-sm font-medium text-gray-700">{config.whereWeServe.extendedNetwork.title}</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                  {config.whereWeServe.extendedNetwork.cities.map((city) => (
                    <div key={city} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all">
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Mission Pillars */}
      <section className="py-12 bg-stone-100 relative overflow-hidden">
        <Container>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-amber-700"></div>
              <span className="text-amber-800 text-sm uppercase tracking-wider">{config.missionPillars.badge}</span>
              <div className="w-8 h-px bg-amber-700"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-amber-900 mb-6 uppercase tracking-tighter italic">{config.missionPillars.title}</h2>
            <p className="text-xl md:text-2xl text-amber-800 max-w-3xl mx-auto font-medium leading-relaxed">
              {config.missionPillars.description}
            </p>
          </div>

          {/* Compact Marigold Garland */}
          <div className="w-full px-4">
            <div className="relative">
              {/* Simple Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-300 hidden lg:block"></div>

              {/* Flowers in a Row */}
              <div className="flex justify-center items-center gap-6 md:gap-12 lg:gap-16">
                {config.missionPillars.pillars.map((pillar, index) => {
                  const IconComponent = getIcon(pillar.icon);
                  return (
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
                          <IconComponent className="w-6 h-6 text-amber-800 group-hover:text-amber-900" />

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
                  );
                })}
              </div>
            </div>

            {/* Bottom Statement */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-stone-50 rounded-full shadow-sm border border-amber-200">
                <span className="text-amber-800 text-sm">{config.missionPillars.bottomStatement}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STORIES IN MOTION (CAROUSEL) ── */}
      {config.storiesInMotion && (
        <section className="py-12 bg-white overflow-hidden">
          <Container>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-tighter text-stone-900 leading-none border-b-4 border-[#f4c430] inline-block pb-1">{config.storiesInMotion.title}</h2>
            </div>

            <div className="relative group/carousel">
              <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-4 -mx-4">
                {config.storiesInMotion.stories.map((story, i) => (
                  <div key={i} className="relative min-w-[280px] md:min-w-[400px] aspect-[16/10] rounded-[2rem] overflow-hidden group shadow-lg">
                    <Image
                      src={getSafeSrc(story.image)}
                      alt={getAlt(story.image, seo, story.title || "Moksha Seva Story")}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-700 bg-stone-50"
                    />
                    <div className="absolute bottom-5 left-6 z-10">
                      <p className="text-white font-black uppercase text-[10px] tracking-widest drop-shadow-md">{story.title}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
      )}

      {/* Join The Mission - Reverted to Full Background per user request */}
      {/* <section className="relative py-16 md:py-32 overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <Image
            src={getSafeSrc(config.joinMission.backgroundImage)}
            alt={getAlt(config.joinMission.backgroundImage, seo, config.labels?.joinMissionAltText || "Join Our Mission")}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-navy-50/10 border border-navy-50/20 mb-6 backdrop-blur-md">
              <p className="text-[#20b2aa] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{config.joinMission.badge}</p>
            </div>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none md:leading-[0.85] mb-10">
              {config.joinMission.title} <br />
              <span className="text-[#f4c430]">{config.joinMission.titleHighlight}</span>
            </h2>
            <p className="text-white font-medium text-xl md:text-2xl mb-12 leading-relaxed drop-shadow-xl max-w-2xl">
              {config.joinMission.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {config.joinMission.buttons.map((button, index) => (
                <Link key={index} href={button.href || '#'}>
                  <Button variant="ghost" className={cn(
                    "px-8 py-3 transition-colors",
                    button.variant === "primary"
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-white text-gray-800 hover:bg-yellow-400 hover:text-gray-900"
                  )}>
                    {button.text}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-6 md:gap-10 border-t border-white/10 pt-10">
              {config.joinMission.stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <p className="text-white font-black text-2xl tracking-tighter leading-none mb-1">{stat.number}</p>
                  <p className="text-stone-400 font-black text-[9px] uppercase tracking-widest leading-none">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section> */}

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
              <span className="text-amber-700 text-sm uppercase tracking-wider font-medium">{config.urgentCampaigns.badge}</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-black mb-8 uppercase tracking-tighter italic">{config.urgentCampaigns.title}</h2>
            <p className="text-xl md:text-2xl text-black font-medium leading-relaxed max-w-3xl mx-auto">{config.urgentCampaigns.description}</p>
          </div>

          {/* Enhanced 3D Circular Carousel */}
          <div className="relative max-w-7xl mx-auto h-[500px] overflow-visible" style={{ perspective: '1200px' }}>
            <div className="relative w-full h-full flex items-center justify-center">
              {config.urgentCampaigns.campaigns.map((c, index) => {
                // Calculate position relative to current slide
                let position = index - currentCampaignSlide;
                if (position < 0) position += config.urgentCampaigns.campaigns.length;
                if (position >= config.urgentCampaigns.campaigns.length) position -= config.urgentCampaigns.campaigns.length;

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
                    key={c.title}
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
                          setCurrentCampaignSlide((prev) => (prev + 1) % config.urgentCampaigns.campaigns.length);
                        }, config.urgentCampaigns.autoSlideInterval);
                      }
                    }}
                  >
                    <div className={cn(
                      "w-80 bg-white rounded-3xl overflow-hidden transition-all duration-500",
                      position === 0
                        ? "shadow-2xl shadow-gray-900/20 ring-1 ring-gray-200"
                        : "shadow-lg shadow-gray-400/10 hover:shadow-xl opacity-90"
                    )}>
                      <div className="relative aspect-[3/2] overflow-hidden bg-stone-50">
                        <Image
                          src={getSafeSrc(c.image)}
                          alt={getAlt(c.image, seo, c.alt || c.title || "Urgent Mission")}
                          fill
                          className={cn(
                            "object-contain transition-transform duration-700 bg-stone-50",
                            position === 0 ? "scale-100" : "scale-105 group-hover:scale-100"
                          )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                        {/* Enhanced overlay content */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-white/80 text-xs font-medium uppercase tracking-wider">{config.urgentCampaigns.labels.activeCampaign}</span>
                          </div>
                          <h3 className="text-white font-bold text-xl mb-3 leading-tight">{c.title}</h3>

                          {/* Enhanced progress bar */}
                          <div className="relative mb-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 w-full overflow-hidden">
                              <div
                                className="bg-white h-full rounded-full transition-all duration-1000"
                                style={{ width: c.percentage }}
                              >
                              </div>
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-white">
                            <div className="text-sm">
                              <span className="text-white/70">{config.urgentCampaigns.labels.raised}</span>
                              <span className="font-semibold">{c.raised}</span>
                            </div>
                            <div className="text-sm font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              {c.percentage}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced card content */}
                      <div className="p-6">
                        <p className="text-gray-900 text-sm mb-5 leading-relaxed font-medium line-clamp-2">{c.description}</p>
                        <Link href="/donate">
                          <Button
                            className={cn(
                              "w-full transition-all duration-300",
                              position === 0
                                ? "bg-gray-900 text-white hover:bg-black shadow-lg"
                                : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-bold"
                            )}
                          >
                            {position === 0 ? config.urgentCampaigns.labels.donateNow : config.urgentCampaigns.labels.viewCampaign}
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
                setCurrentCampaignSlide((prev) => (prev - 1 + config.urgentCampaigns.campaigns.length) % config.urgentCampaigns.campaigns.length);
                if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
                campaignTimerRef.current = setInterval(() => {
                  setCurrentCampaignSlide((prev) => (prev + 1) % config.urgentCampaigns.campaigns.length);
                }, config.urgentCampaigns.autoSlideInterval);
              }}
              aria-label="Previous campaign"
              className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-50 backdrop-blur-sm border border-gray-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                setCurrentCampaignSlide((prev) => (prev + 1) % config.urgentCampaigns.campaigns.length);
                if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
                campaignTimerRef.current = setInterval(() => {
                  setCurrentCampaignSlide((prev) => (prev + 1) % config.urgentCampaigns.campaigns.length);
                }, config.urgentCampaigns.autoSlideInterval);
              }}
              aria-label="Next campaign"
              className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-50 backdrop-blur-sm border border-gray-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
              {config.urgentCampaigns.campaigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCampaignSlide(index);
                    if (campaignTimerRef.current) clearInterval(campaignTimerRef.current);
                    campaignTimerRef.current = setInterval(() => {
                      setCurrentCampaignSlide((prev) => (prev + 1) % config.urgentCampaigns.campaigns.length);
                    }, config.urgentCampaigns.autoSlideInterval);
                  }}
                  aria-label={`Go to campaign ${index + 1}`}
                  className={cn(
                    "h-4 rounded-full transition-all duration-500 border-2",
                    index === currentCampaignSlide
                      ? "w-16 bg-gray-700 border-gray-700 shadow-lg"
                      : "w-4 bg-white/70 border-gray-300 hover:bg-white hover:border-gray-400"
                  )}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="py-12 bg-stone-950 border-y border-stone-800">
        <Container>
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8">
            <div className="shrink-0 text-center xl:text-left">
              <p className="text-[#f4c430] font-black text-[10px] uppercase tracking-[0.4em] mb-2 leading-none">{config.sacredJourney.badge}</p>
              <h2 className="text-xl md:text-2xl xl:text-3xl font-black uppercase tracking-tighter text-white leading-none">{config.sacredJourney.title}</h2>
            </div>

            <div className="flex flex-wrap justify-center xl:flex-nowrap items-start gap-4 md:gap-5 xl:gap-8">
              {config.sacredJourney.timeline.map((item, i) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <div key={i} className="flex flex-col items-center xl:items-start max-w-[120px] md:max-w-[130px] xl:max-w-[140px] group">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[#f4c430]/20 flex items-center justify-center border border-[#f4c430]/50 group-hover:bg-[#f4c430] transition-all">
                        <IconComponent size={10} className="md:w-3 md:h-3 text-[#f4c430] group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-white font-black text-base md:text-lg tracking-tighter leading-none">{item.year}</p>
                    </div>
                    <p className="text-stone-400 font-bold uppercase text-[8px] md:text-[9px] leading-tight tracking-wider text-center xl:text-left">{item.event}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ── TRANSPARENCY (NEW) ── */}
      <section className="py-10 bg-white border-y border-stone-100">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-stone-900 leading-[0.85] mb-6">
                {config.transparency.title} <br />
                <span className="text-[#158078]">{config.transparency.titleHighlight}</span>
              </h2>
              <p className="text-stone-800 font-medium text-lg leading-snug mb-8 max-w-md">
                {config.transparency.description}
              </p>
              <div className="space-y-4">
                {config.transparency.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between font-black uppercase text-[10px] tracking-widest mb-1.5 transform translate-y-0.5">
                      <span>{stat.label}</span>
                      <span>{stat.percentage}</span>
                    </div>
                    <div className="bg-stone-100 h-1.5 w-full rounded-full overflow-hidden">
                      <div className="bg-[#20b2aa] h-full rounded-full" style={{ width: stat.percentage }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-100 rotate-1 shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-stone-900">{config.transparency.trustSection.title}</h3>
              <p className="text-stone-600 font-medium mb-6">{config.transparency.trustSection.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {config.transparency.trustSection.badges.map((badge, index) => (
                  <div key={index} className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
                    <p className={`${badge.color || 'text-[#b45309]'} font-black text-2xl tracking-tighter`}>{badge.text}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-stone-700">{badge.subtext}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── MEDIA RECOGNITION (NEW) ── */}
      <section className="py-10 bg-white">
        <Container>
          <p className="text-center text-stone-600 font-black text-[10px] uppercase tracking-[0.4em] mb-8">{config.mediaRecognition.badge}</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {config.mediaRecognition.logos.map((logo) => (
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
              <p className="text-[#f4c430] font-black text-[10px] uppercase tracking-widest mb-2">{config.testimonials.badge}</p>
              <div className="relative">
                {config.testimonials.slides.map((t, i) => (
                  <div key={i} className={cn("transition-all duration-1000", i === currentTestimonial ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0")}>
                    <p className="text-white text-xl md:text-3xl font-black italic tracking-tighter leading-tight mb-6">&quot;{t.quote}&quot;</p>
                    <p className="text-stone-300 font-bold uppercase text-xs tracking-widest">— {t.author}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-10">
              {config.testimonials.slides.map((_, i) => (
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
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-stone-600 leading-none underline decoration-stone-200 decoration-1 underline-offset-[10px]">{config.governmentPartners.title}</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {config.governmentPartners.partners.map((gp) => (
              <div key={gp.name} className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-stone-900 border-b-2 border-stone-900 pb-1">{gp.name}</div>
                <p className="text-[8px] font-black uppercase tracking-widest mt-2 text-stone-800">{gp.label}</p>
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
              <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-900 border-b-4 border-[#f4c430] inline-block pb-1">{config.faq.title}</h2>
            </div>
            <div className="space-y-4">
              {config.faq.questions.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-[#20b2aa]/20 hover:bg-white transition-all group cursor-default">
                  <p className="font-black text-sm uppercase tracking-tighter text-stone-900 mb-2 group-hover:text-[#20b2aa] transition-colors">{faq.question}</p>
                  <p className="text-stone-600 text-sm font-medium leading-relaxed">{faq.answer}</p>
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