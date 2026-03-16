"use client";

import type { Metadata } from "next";
import { Container, SectionHeader } from "@/components/ui/Elements";
import { Clock } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { howItWorksConfig } from "@/config/how-it-works.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

// Note: Metadata needs to be handled differently in client components
// export const metadata: Metadata = { title: howItWorksConfig.metadata.title };

export default function HowItWorksPage() {
  // Use dynamic config with fallback to static config
  const { config: dynamicConfig, loading, error } = usePageConfig('how-it-works', howItWorksConfig);
  
  // Use dynamic config if available, otherwise fallback to static
  const config = dynamicConfig || howItWorksConfig;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading how it works content...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="py-20 bg-amber-800">
        <Container>
          <div className="text-center text-stone-50">
            <p className="text-amber-200 font-black text-[10px] uppercase tracking-[0.4em] mb-4">{howItWorksConfig.hero.badge}</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
              {howItWorksConfig.hero.title} <span className="text-amber-200">{howItWorksConfig.hero.titleHighlight}</span> Works
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              {howItWorksConfig.hero.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Timeline Process */}
      <section className="py-20 bg-stone-100">
        <Container>
          <div className="space-y-12">
            {howItWorksConfig.steps.map((step, idx) => {
              const Icon = getIcon(step.icon);
              return (
                <div key={step.step} className="relative">
                  {/* Connector Line */}
                  {idx < howItWorksConfig.steps.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-amber-600 to-transparent hidden md:block z-0" />
                  )}

                  <div className="flex gap-8 items-start relative z-10">
                    {/* Icon Circle */}
                    <div className="flex-shrink-0 w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center shadow-xl border-4 border-stone-50">
                      <Icon className="w-8 h-8 text-stone-50" />
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-stone-50 rounded-2xl border border-amber-200 p-8 shadow-lg hover:shadow-xl transition-all duration-500">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <span className="text-amber-700 font-black text-xs uppercase tracking-widest">{step.step}</span>
                          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 mt-1 leading-tight">{step.title}</h2>
                        </div>
                        <div className="flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-black px-4 py-2 rounded-full border border-amber-200">
                          <Clock className="w-4 h-4" />
                          <span className="uppercase tracking-widest">{step.timeline}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">{step.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.actions.map((action, actionIdx) => (
                          <div key={actionIdx} className="flex items-center gap-3 text-sm text-gray-700 bg-stone-100 p-3 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-amber-700 flex-shrink-0" />
                            <span className="font-medium">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-amber-700">
        <Container>
          <div className="text-center text-stone-50">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
              {howItWorksConfig.callToAction.title}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              {howItWorksConfig.callToAction.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={howItWorksConfig.callToAction.buttons.reportOnline.href}>
                <Button className="bg-stone-50 hover:bg-white text-amber-800 px-10 py-4 rounded-lg font-black uppercase tracking-widest transition-all shadow-lg">
                  {howItWorksConfig.callToAction.buttons.reportOnline.text}
                </Button>
              </Link>
              <a href={`tel:${howItWorksConfig.callToAction.buttons.callButton.phoneNumber}`}>
                <Button className="border-2 border-stone-50 text-stone-50 hover:bg-stone-50 hover:text-amber-800 px-10 py-4 rounded-lg font-black uppercase tracking-widest transition-all flex items-center gap-2">
                  {(() => {
                    const PhoneIcon = getIcon("Phone");
                    return <PhoneIcon className="w-5 h-5" />;
                  })()} {howItWorksConfig.callToAction.buttons.callButton.text}
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
