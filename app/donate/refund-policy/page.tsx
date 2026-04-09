"use client";
import React from "react";
import { Container } from "@/components/ui/Elements";
import { FileText, ChevronRight, Shield, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { refundConfig } from "@/config/refund.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { getIcon } from "@/config/icons.config";

export default function RefundPolicyPage() {
  const { config: dynamicConfig, loading } = usePageConfig('refund', refundConfig);
  const activeConfig = dynamicConfig || refundConfig;

  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center animate-pulse text-stone-400 font-serif">Syncing Financial Policies...</div>;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        <Container>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-amber-500 text-sm font-bold tracking-widest uppercase mb-4">
              <FileText className="w-4 h-4" />
              <span>{activeConfig.hero.badge}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
              {activeConfig.hero.title} <span className="text-amber-500">{activeConfig.hero.subtitle}</span>
            </h1>
            <p className="text-stone-400 text-xl max-w-3xl font-medium italic">
              {activeConfig.hero.description || "Complete information about donation refunds, cancellations, and our commitment to absolute transparency."}
            </p>
            {activeConfig.hero.lastUpdated && (
                <p className="text-stone-500 text-sm mt-6 font-bold uppercase tracking-widest">
                Last Updated: {activeConfig.hero.lastUpdated}
                </p>
            )}
          </div>
        </Container>
      </section>

      {/* Trust Indicators */}
      {activeConfig.trustIndicators && (
        <section className="py-6 bg-amber-50 border-b border-amber-100">
            <Container>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {activeConfig.trustIndicators.map((indicator: any, idx: number) => {
                    const Icon = indicator.icon ? getIcon(indicator.icon) : CheckCircle;
                    return (
                        <div key={idx} className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest">
                            <Icon className="w-5 h-5 text-amber-700" /> {indicator.label}
                        </div>
                    );
                })}
            </div>
            </Container>
        </section>
      )}

      {/* Main Content */}
      <section className="py-20 bg-stone-50">
        <Container size="lg">
          <div className="max-w-4xl mx-auto space-y-10">
            {activeConfig.sections.map((section: any, i: number) => (
              <div key={i} className="bg-white rounded-[2rem] border border-stone-200 shadow-sm p-10 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-2 h-8 bg-amber-700 rounded-full" />
                    <h2 className="font-serif text-2xl font-bold text-stone-800 uppercase tracking-tight">{section.title}</h2>
                </div>
                <div className="text-stone-600 leading-relaxed font-medium space-y-4 text-lg">
                  {section.content.split('\n').map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            ))}

            {activeConfig.footer && (
              <div className="bg-stone-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-all duration-500" />
                <div className="relative z-10">
                    <h2 className="font-serif text-2xl font-bold mb-4 uppercase tracking-tight text-amber-500">{activeConfig.footer.title}</h2>
                    <p className="text-stone-400 leading-relaxed mb-8 text-lg font-medium">
                    {activeConfig.footer.content}
                    </p>
                    <a href={`mailto:${activeConfig.footer.contactEmail}`} className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl">
                    {activeConfig.footer.contactEmail} <ChevronRight size={16} />
                    </a>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      {activeConfig.cta && (
        <section className="py-20 bg-stone-100 border-t border-stone-200">
            <Container>
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl font-bold mb-4 text-stone-900 uppercase tracking-tight">
                {activeConfig.cta.title}
                </h2>
                <p className="text-stone-600 mb-10 text-lg font-medium">
                {activeConfig.cta.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    href={activeConfig.cta.primaryButton?.href || "/donate"}
                    className="w-full sm:w-auto px-10 py-5 bg-stone-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-amber-700 transition-all shadow-2xl"
                >
                    {activeConfig.cta.primaryButton?.text || "Donate"}
                </Link>
                {activeConfig.cta.secondaryButton && (
                    <Link
                        href={activeConfig.cta.secondaryButton?.href || "/contact"}
                        className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-stone-200 text-stone-700 rounded-full font-black text-sm uppercase tracking-widest hover:border-amber-700 hover:text-amber-700 transition-all"
                    >
                        {activeConfig.cta.secondaryButton?.text || "Contact"}
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
