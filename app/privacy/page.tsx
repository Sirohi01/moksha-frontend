"use client";
import React from "react";
import { Container } from "@/components/ui/Elements";
import { Shield, Lock, Eye, FileText, ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
    const sections = [
        {
            title: "Data Collection",
            icon: Eye,
            content: "We collect only the most essential information required to fulfill our mission. This includes contact details provided during donation, volunteer registration, or while reporting an unclaimed body. We do not sell or trade your personal data with third-party commercial entities."
        },
        {
            title: "How We Use Data",
            icon: FileText,
            content: "Information collected is used strictly for operational purposes: verifying reports, processing donations, issuing tax-exemption certificates (80G), and maintaining the Wall of Remembrance. Your data helps us maintain absolute transparency in our audit trails."
        },
        {
            title: "Security Measures",
            icon: Lock,
            content: "We employ industry-standard encryption and secure server protocols to protect your sensitive information. Our 'Transparency Dashboard' anonymizes sensitive personal data while still providing public accountability for our mission's impact."
        }
    ];

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">LEGAL & TRUST</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">PRIVACY <br /><span className="text-[#7ab800]">AND POLICY</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            At Moksha Sewa, your trust is as sacred as our mission. We are committed to protecting
                            the privacy of our donors, volunteers, and the individuals we serve.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Policy Content */}
            <section className="py-24">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-20">
                            {sections.map((section, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-center justify-center text-[#7ab800] group-hover:bg-[#7ab800] group-hover:text-white transition-all duration-500">
                                            <section.icon size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-800">{section.title}</h2>
                                    </div>
                                    <p className="text-stone-500 text-lg leading-relaxed font-medium pl-16 border-l-2 border-stone-100 group-hover:border-[#7ab800] transition-colors duration-500">
                                        {section.content}
                                    </p>
                                </div>
                            ))}

                            <div className="pt-10 border-t border-stone-200">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-stone-800 mb-6">Updates to This Policy</h3>
                                <p className="text-stone-500 leading-relaxed mb-6">
                                    We may update our Privacy Policy from time to time to reflect changes in legal
                                    requirements or our operational practices. The &apos;Last Updated&apos; date at the bottom
                                    of this page indicates when the latest changes were made.
                                </p>
                                <p className="text-stone-400 text-xs font-black uppercase tracking-widest">Last Updated: March 2024</p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-white border border-stone-100 rounded-[3rem] p-10 shadow-sm overflow-hidden relative group">
                                    <Shield className="text-[#7ab800] mb-8" size={48} />
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-stone-800 mb-4">Institutional Trust</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed mb-8">
                                        Our legal framework is built to ensure that every rupee spent and every soul served
                                        is accounted for in the public interest.
                                    </p>
                                    <button className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-800 hover:bg-[#7ab800] hover:text-white transition-all">
                                        Read Compliance <ChevronRight size={14} />
                                    </button>
                                </div>

                                <div className="p-10 bg-stone-900 rounded-[3rem] text-white overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/10 blur-3xl rounded-full" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#7ab800] mb-4">Grievance Officer</h3>
                                    <p className="text-stone-400 text-xs leading-relaxed mb-6">If you have any concerns regarding your data, contact our Nodal Officer.</p>
                                    <p className="font-mono text-[11px] text-white">trust@MokshaSewa.org</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
