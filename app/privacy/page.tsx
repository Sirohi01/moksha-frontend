"use client";
import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { Shield, Mail, ChevronRight } from "lucide-react";
import { privacyConfig } from "@/config/privacy.config";
import { getIcon } from "@/config/icons.config"; 
import { usePageConfig } from "@/hooks/usePageConfig";

export default function PrivacyPolicyPage() {
    const { config: dynamicConfig, loading } = usePageConfig('privacy', privacyConfig);
    const activeConfig = dynamicConfig || privacyConfig;

    if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center animate-pulse">Loading Narrative...</div>;

    const MessageIcon = activeConfig.footer?.title ? getIcon('Mail') : Mail;
    const SidebarIcon = activeConfig.sidebar?.icon ? getIcon(activeConfig.sidebar.icon) : Shield;

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">{activeConfig.hero.badge}</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">{activeConfig.hero.title} <br /><span className="text-[#7ab800]">{activeConfig.hero.subtitle}</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            {activeConfig.hero.description || "At Moksha Sewa, your trust is as sacred as our mission. We are committed to protecting the privacy of our donors, volunteers, and the individuals we serve."}
                        </p>
                    </div>
                </Container>
            </section>

            {/* Trust Indicators */}
            {activeConfig.trustIndicators && (
                <section className="py-8 bg-stone-100 border-b border-stone-200">
                    <Container>
                        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                            {(activeConfig.trustIndicators || []).map((indicator: any, idx: number) => {
                                const Icon = getIcon(indicator.icon);
                                return (
                                    <div key={idx} className="flex items-center gap-3 text-stone-600 font-black text-[10px] uppercase tracking-[0.3em]">
                                        <Icon className="w-5 h-5 text-[#7ab800]" /> {indicator.label}
                                    </div>
                                );
                            })}
                        </div>
                    </Container>
                </section>
            )}

            {/* Policy Content */}
            <section className="py-24">
                <Container>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-20">
                      {(activeConfig.sections || []).map((section: any, i: number) => {
                        const SectionIcon = section.icon ? getIcon(section.icon) : Shield;
                        return (
                          <div key={i} className="group">
                            <div className="flex items-center gap-4 mb-8">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-center justify-center text-[#7ab800] group-hover:bg-[#7ab800] group-hover:text-white transition-all duration-500">
                                <SectionIcon size={24} />
                              </div>
                              <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-800">{section.title}</h2>
                            </div>
                            <p className="text-stone-500 text-lg leading-relaxed font-medium pl-16 border-l-2 border-stone-100 group-hover:border-[#7ab800] transition-colors duration-500">
                              {section.content}
                            </p>
                          </div>
                        );
                      })}

                      <div className="pt-10 border-t border-stone-200">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-stone-800 mb-6">Updates to This Policy</h3>
                        <p className="text-stone-500 leading-relaxed mb-6">
                          We may update our Privacy Policy from time to time to reflect changes in legal
                          requirements or our operational practices. The &apos;Last Updated&apos; date at the bottom
                          of this page indicates when the latest changes were made.
                        </p>
                        <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Last Updated: {activeConfig.hero.lastUpdated}</p>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-32 space-y-8">
                        {activeConfig.sidebar && (
                          <div className="bg-white border border-stone-100 rounded-[3rem] p-10 shadow-sm overflow-hidden relative group">
                            <SidebarIcon className="text-[#7ab800] mb-8" size={48} />
                            <h3 className="text-xl font-black uppercase tracking-tighter text-stone-800 mb-4">{activeConfig.sidebar.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed mb-8">
                              {activeConfig.sidebar.content}
                            </p>
                            <Link href={activeConfig.sidebar.buttonHref}>
                              <button className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-800 hover:bg-[#7ab800] hover:text-white transition-all">
                                {activeConfig.sidebar.buttonText} <ChevronRight size={14} />
                              </button>
                            </Link>
                          </div>
                        )}

                        {activeConfig.footer && (
                          <div className="p-10 bg-stone-900 rounded-[3rem] text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/10 blur-3xl rounded-full" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#7ab800] mb-4">{activeConfig.footer.title}</h3>
                            <p className="text-stone-400 text-xs leading-relaxed mb-6">{activeConfig.footer.content}</p>
                            <p className="font-mono text-[11px] text-white">{activeConfig.footer.contactEmail}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Container>
            </section>

            {/* Final CTA */}
            {activeConfig.cta && (
                <section className="py-24 bg-stone-900 text-white border-t border-stone-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                    <Container>
                        <div className="max-w-4xl mx-auto text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">{activeConfig.cta.title}</h2>
                            <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                                {activeConfig.cta.description}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link href={activeConfig.cta.primaryButton.href}>
                                    <button className="px-10 py-5 bg-[#7ab800] text-black font-black text-xs uppercase tracking-[0.3em] rounded-full hover:bg-white transition-all shadow-2xl">
                                        {activeConfig.cta.primaryButton.text}
                                    </button>
                                </Link>
                                {activeConfig.cta.secondaryButton && (
                                    <Link href={activeConfig.cta.secondaryButton.href}>
                                        <button className="px-10 py-5 bg-transparent border-2 border-stone-700 text-white font-black text-xs uppercase tracking-[0.3em] rounded-full hover:border-[#7ab800] transition-all">
                                            {activeConfig.cta.secondaryButton.text}
                                        </button>
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

