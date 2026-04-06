"use client";
import { Container } from "@/components/ui/Elements";
import Image from 'next/image';
import { getSafeSrc, getAlt } from '@/lib/utils';
import { impactConfig } from "@/config/impact.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function Impact() {
  // Use dynamic config with fallback to static config
  const { config: dynamicConfig, seo, loading: configLoading } = usePageConfig('impact', impactConfig);
  const config = dynamicConfig || impactConfig;
  const impactStats = config.impactStats.stats.map(stat => ({
    icon: getIcon(stat.icon),
    number: stat.number,
    label: stat.label,
    color: stat.color,
    description: stat.description
  }));

  const yearlyData = config.growthTimeline.yearlyData;

  const testimonials = config.testimonials.testimonials;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-stone-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-gray-900">
                  {config.hero.title} <span className="text-amber-700">{config.hero.highlightText}</span>
                </h1>
                <p className="text-xl font-medium max-w-2xl leading-relaxed text-gray-700 mb-8">
                  {config.hero.description}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                  <div className="text-2xl font-black text-amber-700">{config.hero.keyStats.livesHonored.number}</div>
                  <div className="text-sm text-gray-600">{config.hero.keyStats.livesHonored.label}</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                  <div className="text-2xl font-black text-amber-700">{config.hero.keyStats.cities.number}</div>
                  <div className="text-sm text-gray-600">{config.hero.keyStats.cities.label}</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                  <div className="text-2xl font-black text-amber-700">{config.hero.keyStats.years.number}</div>
                  <div className="text-sm text-gray-600">{config.hero.keyStats.years.label}</div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <h3 className="text-lg font-black text-gray-900 mb-3">{config.hero.missionImpact.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {config.hero.missionImpact.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">{config.hero.missionImpact.features.freeService}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">{config.hero.missionImpact.features.available247}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={config.hero.actions.joinMission.href}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-all text-center"
                >
                  {config.hero.actions.joinMission.text}
                </a>
                <a
                  href={config.hero.actions.supportWork.href}
                  className="border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all text-center"
                >
                  {config.hero.actions.supportWork.text}
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl relative">
                <Image
                  src={getSafeSrc(config.hero.image)}
                  alt={getAlt(config.hero.image, seo, config.hero.imageAlt || "Mission Impact")}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100 rounded-full opacity-30"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-stone-200 rounded-full opacity-40"></div>

              {/* Floating stats */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="text-lg font-black text-amber-700">{config.hero.floatingStats.volunteers.number}</div>
                <div className="text-xs text-gray-600">{config.hero.floatingStats.volunteers.label}</div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="text-lg font-black text-green-600">{config.hero.floatingStats.compliance.number}</div>
                <div className="text-xs text-gray-600">{config.hero.floatingStats.compliance.label}</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-br from-stone-50 to-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              {config.impactStats.title}
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {config.impactStats.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl border border-stone-200 hover:shadow-xl transition-all duration-500 text-center relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-stone-100 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>

                  <div className="text-4xl md:text-5xl font-black text-amber-700 mb-3 group-hover:scale-105 transition-transform">
                    {stat.number}
                  </div>

                  <div className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-4">
                    {stat.label}
                  </div>

                  {/* Add descriptive text for each stat */}
                  <div className="text-xs text-gray-500 leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional impact metrics */}
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-stone-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-amber-700 font-black text-lg">{config.impactStats.additionalMetrics.freeService.symbol}</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">{config.impactStats.additionalMetrics.freeService.title}</div>
                <div className="text-xs text-gray-500">{config.impactStats.additionalMetrics.freeService.description}</div>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-green-700 font-black text-lg">{config.impactStats.additionalMetrics.certified.symbol}</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">{config.impactStats.additionalMetrics.certified.title}</div>
                <div className="text-xs text-gray-500">{config.impactStats.additionalMetrics.certified.description}</div>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-blue-700 font-black text-lg">{config.impactStats.additionalMetrics.available247.symbol}</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">{config.impactStats.additionalMetrics.available247.title}</div>
                <div className="text-xs text-gray-500">{config.impactStats.additionalMetrics.available247.description}</div>
              </div>

              <div className="group">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-purple-700 font-black text-lg">{config.impactStats.additionalMetrics.withDignity.symbol}</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">{config.impactStats.additionalMetrics.withDignity.title}</div>
                <div className="text-xs text-gray-500">{config.impactStats.additionalMetrics.withDignity.description}</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Growth Timeline */}
      <section className="py-12 bg-stone-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-4">
                {config.growthTimeline.title}
              </h2>
              <div className="w-20 h-1 bg-amber-700 mb-6"></div>
              <p className="text-gray-600 mb-8">
                {config.growthTimeline.description}
              </p>

              <div className="grid grid-cols-2 gap-6">
                {config.growthTimeline.highlightedYears.map((data, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-stone-200 hover:shadow-lg transition-all">
                    <div className="text-lg font-black text-amber-700 mb-2">{data.year}</div>
                    <div className="space-y-1 text-sm">
                      <div className="font-bold text-gray-900">{data.rites} Rites</div>
                      <div className="text-gray-600">{data.cities} Cities</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl relative">
                <Image
                  src={getSafeSrc(config.growthTimeline.image)}
                  alt={getAlt(config.growthTimeline.image, seo, config.growthTimeline.imageAlt || "Growth Timeline")}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-100 rounded-full opacity-20"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              {config.testimonials.title}
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-lg transition-all duration-500 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={getSafeSrc(testimonial.image)}
                      alt={getAlt(testimonial.image, seo, testimonial.author || "Testimonial Author")}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain bg-stone-50"
                    />
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                <div className="text-amber-700 text-2xl mb-3">&quot;</div>
                <p className="text-gray-700 italic leading-relaxed text-sm">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-amber-800">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                {config.callToAction.title}
              </h2>
              <p className="text-lg mb-6 text-white/90">
                {config.callToAction.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={config.callToAction.actions.joinMission.href}
                  className="bg-amber-100 hover:bg-white text-amber-800 px-6 py-3 rounded-lg font-black uppercase tracking-widest transition-all text-center"
                >
                  {config.callToAction.actions.joinMission.text}
                </a>
                <a
                  href={config.callToAction.actions.supportWork.href}
                  className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-6 py-3 rounded-lg font-black uppercase tracking-widest transition-all text-center"
                >
                  {config.callToAction.actions.supportWork.text}
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl relative">
                <Image
                  src={getSafeSrc(config.callToAction.image)}
                  alt={getAlt(config.callToAction.image, seo, config.callToAction.imageAlt || "Call to Action")}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
