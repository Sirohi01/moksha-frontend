"use client";
import React from "react";
import { Container } from "@/components/ui/Elements";
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { termsConfig } from "@/config/terms.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function TermsPage() {
  const { config: dynamicConfig, loading } = usePageConfig('terms', termsConfig);
  const activeConfig = dynamicConfig || termsConfig;

  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center animate-pulse text-stone-400 font-serif">Loading Legal Framework...</div>;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-50 text-gray-900 py-16 border-b border-stone-200">
        <Container>
          <div className="flex items-center gap-2 text-amber-700 text-sm font-medium tracking-widest uppercase mb-3">
            <FileText className="w-4 h-4" />
            <span>{activeConfig.hero.badge}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {activeConfig.hero.title} <span className="text-amber-700">{activeConfig.hero.subtitle}</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            {activeConfig.hero.description || "Please read these terms and conditions carefully before using our services or making a donation."}
          </p>
          <p className="text-gray-500 text-sm mt-4 italic">
            Last Updated: {activeConfig.hero.lastUpdated}
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-stone-100/50">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-10">
            {(activeConfig.sections || []).map((section: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10 hover:shadow-md transition-shadow">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
                <div className="text-gray-600 leading-relaxed font-medium space-y-4">
                  {(section.content || "").split('\n').map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            ))}

            {activeConfig.footer && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-sm p-10">
                <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">{activeConfig.footer.title}</h2>
                <p className="text-stone-600 leading-relaxed mb-6 font-medium">
                  {activeConfig.footer.content}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href={`mailto:${activeConfig.footer.contactEmail}`} className="px-6 py-3 bg-white border border-amber-200 rounded-xl text-amber-700 font-bold hover:bg-amber-50 transition-colors shadow-sm">
                    {activeConfig.footer.contactEmail}
                  </a>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      {activeConfig.cta && (
        <section className="py-16 bg-stone-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full" />
            <Container>
            <div className="text-center max-w-2xl mx-auto relative z-10">
                <h2 className="font-serif text-3xl font-bold mb-4 uppercase tracking-tight">
                {activeConfig.cta.title}
                </h2>
                <p className="text-stone-400 mb-8 text-lg">
                {activeConfig.cta.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={activeConfig.cta.primaryButton.href}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-amber-700 text-white rounded-full font-bold hover:bg-amber-800 transition-all transform hover:scale-105 shadow-xl"
                    >
                        {activeConfig.cta.primaryButton.text} <ChevronRight size={18} />
                    </Link>
                    {activeConfig.cta.secondaryButton && (
                        <Link
                            href={activeConfig.cta.secondaryButton.href}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-white border-2 border-stone-700 text-stone-900 rounded-full font-bold hover:bg-amber-50 transition-all transform hover:scale-105"
                        >
                            {activeConfig.cta.secondaryButton.text}
                        </Link>
                    )}
                </div>
            </div>
            </Container>
        </section>
      )}
    </main>
  );
}
