"use client";
import React, { useState } from "react";
import { Container } from "@/components/ui/Elements";
import Image from "next/image";
import { getSafeSrc, getAlt } from "@/lib/utils";
import { testimonialsConfig } from "@/config/testimonials.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import VideoModal from "@/components/ui/VideoModal";
import { formsAPI } from "@/lib/api";

export default function Testimonials() {
  const { config, seo, loading: configLoading, error: configError } = usePageConfig('testimonials', testimonialsConfig);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const response = await formsAPI.getPublicTestimonials();
        console.log('Testimonials API Response:', response);
        if (response && response.success) {
          console.log('Loaded Testimonials:', response.data.length);
          setTestimonials(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);
  
  if (configLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (configError) {
    console.error('Failed to load Testimonials page config:', configError);
  }
 
  // Use fallback config if dynamic config is null
  const activeConfig = config || testimonialsConfig;
  const stats = activeConfig.stats;
 
  // Combined testimonials: dynamically loaded ones first, then fill from config if empty
  const displayTestimonials = (testimonials && testimonials.length > 0) ? testimonials.map(t => ({
    name: t.name || 'Anonymous',
    quote: t.message || 'No message provided',
    rating: Number(t.experienceRating) || 5,
    role: (t.feedbackType || 'User').replace('_', ' '),
    location: 'Verified User'
  })) : activeConfig.testimonialsGrid.testimonials;

  const StarIcon = getIcon('Star');
  const QuoteIcon = getIcon('Quote');
  const HeartIcon = getIcon('Heart');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-stone-50">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-gray-900">
              {activeConfig.hero.title && <span>{activeConfig.hero.title} </span>}
              <span className="text-amber-700">{activeConfig.hero.highlightText}</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed text-gray-700">
              {activeConfig.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-stone-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-amber-700 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              {activeConfig.testimonialsGrid.title}
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-amber-700 text-amber-700" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <QuoteIcon className="w-8 h-8 text-amber-700 opacity-20 absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic leading-relaxed pl-6">
                    {testimonial.quote}
                  </p>
                </div>

                <div className="border-t border-stone-100 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                       <HeartIcon className="w-6 h-6 text-amber-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-gray-900 uppercase tracking-widest text-sm text-left">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-xs uppercase tracking-widest text-left">
                        {testimonial.role}
                      </div>
                      <div className="text-gray-400 text-xs text-left">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 bg-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              {activeConfig.videoTestimonials.title}
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {activeConfig.videoTestimonials.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeConfig.videoTestimonials.videos.map((video, index) => (
              <div 
                key={index} 
                className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => video.youtubeId && setSelectedVideo({ id: video.youtubeId, title: video.title })}
              >
                <Image 
                  src={getSafeSrc(video.thumbnail)}
                  alt={getAlt(video.thumbnail, seo, video.alt || "Testimonial Video")}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-left">
                    <div className="font-black text-sm text-gray-900">{video.title}</div>
                    <div className="text-xs text-gray-600">{video.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoModal
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
            youtubeId={selectedVideo.id}
            title={selectedVideo.title}
        />
      )}

      {/* Call to Action */}
      <section className="py-16 bg-amber-800">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
              {activeConfig.callToAction.title}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {activeConfig.callToAction.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={activeConfig.callToAction.actions.shareStory.href}
                className="bg-amber-100 hover:bg-white text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                {activeConfig.callToAction.actions.shareStory.text}
              </a>
              <a 
                href={activeConfig.callToAction.actions.joinMission.href}
                className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                {activeConfig.callToAction.actions.joinMission.text}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}