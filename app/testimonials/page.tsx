import { Container } from "@/components/ui/Elements";
import Image from "next/image";
import { testimonialsConfig } from "@/config/testimonials.config";
import { getIcon } from "@/config/icons.config";

export default function Testimonials() {
  const testimonials = testimonialsConfig.testimonialsGrid.testimonials;
  const stats = testimonialsConfig.stats;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-stone-50">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-gray-900">
              {testimonialsConfig.hero.title && <span>{testimonialsConfig.hero.title} </span>}
              <span className="text-amber-700">{testimonialsConfig.hero.highlightText}</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed text-gray-700">
              {testimonialsConfig.hero.description}
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
              {testimonialsConfig.testimonialsGrid.title}
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-xl transition-all duration-500 group">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => {
                    const StarIcon = getIcon('Star');
                    return <StarIcon key={i} className="w-5 h-5 fill-amber-700 text-amber-700" />;
                  })}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  {(() => {
                    const QuoteIcon = getIcon('Quote');
                    return <QuoteIcon className="w-8 h-8 text-amber-700 opacity-20 absolute -top-2 -left-2" />;
                  })()}
                  <p className="text-gray-700 italic leading-relaxed pl-6">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author Info */}
                <div className="border-t border-stone-100 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      {(() => {
                        const HeartIcon = getIcon('Heart');
                        return <HeartIcon className="w-6 h-6 text-amber-700" />;
                      })()}
                    </div>
                    <div>
                      <div className="font-black text-gray-900 uppercase tracking-widest text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-xs uppercase tracking-widest">
                        {testimonial.role}
                      </div>
                      <div className="text-gray-400 text-xs">
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
              {testimonialsConfig.videoTestimonials.title}
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              {testimonialsConfig.videoTestimonials.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsConfig.videoTestimonials.videos.map((video, index) => (
              <div key={index} className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer">
                <Image 
                  src={video.thumbnail}
                  alt={video.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="font-black text-sm text-gray-900">{video.title}</div>
                    <div className="text-xs text-gray-600">{video.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-800">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
              {testimonialsConfig.callToAction.title}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {testimonialsConfig.callToAction.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={testimonialsConfig.callToAction.actions.shareStory.href}
                className="bg-amber-100 hover:bg-white text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                {testimonialsConfig.callToAction.actions.shareStory.text}
              </a>
              <a 
                href={testimonialsConfig.callToAction.actions.joinMission.href}
                className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                {testimonialsConfig.callToAction.actions.joinMission.text}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}