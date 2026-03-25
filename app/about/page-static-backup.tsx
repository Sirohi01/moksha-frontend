"use client";
import type { Metadata } from "next";
import { SectionHeader, Container } from "@/components/ui/Elements";
import { Card } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import Image from 'next/image';
import { aboutConfig } from "@/config/about.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { cn } from "@/lib/utils";

// Note: Metadata will be handled differently in client components
// export const metadata: Metadata = { title: aboutConfig.metadata.title };

export default function AboutPage() {
  // Use dynamic config with fallback to static config
  const { config: dynamicConfig, loading, error } = usePageConfig('about', aboutConfig);

  // Use dynamic config if available, otherwise fallback to static
  const config = dynamicConfig || aboutConfig;

  // Show loading state
  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about page content...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Configuration Status Indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <section className="py-4 bg-blue-50 border-b">
          <Container>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  dynamicConfig ? "bg-green-500" : "bg-yellow-500"
                )}></div>
                <span className="font-medium">
                  About Page: {dynamicConfig ? "✅ Dynamic Config" : "⚠️ Static Fallback"}
                </span>
                {error && (
                  <span className="text-red-600 ml-2">
                    (Error: {error})
                  </span>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Hero */}
      <section className="relative py-16 bg-stone-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-300/20 rounded-full blur-xl"></div>
        </div>

        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <span className="text-amber-700 text-sm font-medium tracking-widest uppercase">{config.hero?.badge}</span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
                {config.hero?.title}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {config.hero?.description}
              </p>
              <div className="flex items-center gap-6">
                {config.hero?.stats?.map((stat, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-800">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                    {index < (config.hero?.stats?.length || 0) - 1 && (
                      <div className="w-px h-12 bg-amber-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-amber-100 rounded-2xl"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-lg">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={aboutConfig.hero.image}
                    alt={aboutConfig.hero.cardTitle}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">{aboutConfig.hero.cardTitle}</h3>
                  <p className="text-gray-600 text-sm">{aboutConfig.hero.cardDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-stone-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="spiritual" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const MissionIcon = getIcon(aboutConfig.missionVision.mission.icon);
                    return <MissionIcon className="w-5 h-5 text-amber-700" />;
                  })()}
                </div>
                <h2 className="font-serif text-xl font-bold text-gray-900">{aboutConfig.missionVision.mission.title}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {aboutConfig.missionVision.mission.description}
              </p>
            </Card>
            <Card variant="spiritual" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const VisionIcon = getIcon(aboutConfig.missionVision.vision.icon);
                    return <VisionIcon className="w-5 h-5 text-amber-700" />;
                  })()}
                </div>
                <h2 className="font-serif text-xl font-bold text-gray-900">{aboutConfig.missionVision.vision.title}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {aboutConfig.missionVision.vision.description}
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-12 bg-stone-50">
        <Container size="lg">
          <SectionHeader tag={aboutConfig.story.tag} title={aboutConfig.story.title} centered={false} />
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {aboutConfig.story.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-lg" : ""}>
                  {paragraph}
                </p>
              ))}

              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-stone-200">
                {aboutConfig.story.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-amber-700">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={aboutConfig.story.image}
                    alt={aboutConfig.story.imageAlt}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-12 bg-stone-100">
        <Container>
          <SectionHeader tag={aboutConfig.values.tag} title={aboutConfig.values.title} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutConfig.values.values.map((value) => {
              const Icon = getIcon(value.icon);
              return (
                <Card key={value.title} variant="elevated" padding="md" className="text-center hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                    <Icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-serif font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-12 bg-stone-50">
        <Container>
          <SectionHeader tag={aboutConfig.team.tag} title={aboutConfig.team.title} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutConfig.team.members.map((member) => (
              <Card key={member.name} variant="bordered" padding="md" className="flex items-start gap-4 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center text-stone-50 font-serif font-bold text-lg flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-amber-700 text-sm">{member.role}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {member.city} · {member.years} with Moksha Sewa
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Registrations */}
      <section className="py-16 bg-stone-100 border-t border-amber-200">
        <Container>
          <h2 className="font-serif text-2xl font-bold text-gray-900 text-center mb-8">
            {aboutConfig.certifications.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aboutConfig.certifications.certifications.map((cert, index) => (
              <div key={index} className="flex items-start gap-2 bg-stone-50 rounded-lg p-4 border border-amber-200 hover:border-amber-300 transition-colors">
                <CheckCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm">{cert.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
