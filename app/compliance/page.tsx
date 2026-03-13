"use client";
import React from "react";
import { Container } from "@/components/ui/Elements";
import { ShieldCheck, FileText, Download, CheckCircle2, Award, Scale } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CompliancePage() {
    const documents = [
        { name: "80G Tax Exemption Certificate", size: "1.2 MB", date: "2024-2027", icon: ShieldCheck },
        { name: "12A Registration Document", size: "0.8 MB", date: "Permanent", icon: FileText },
        { name: "Annual Audit Report 2023-24", size: "2.4 MB", date: "June 2024", icon: BarChart3 },
        { name: "FCRA Compliance Certificate", size: "1.5 MB", date: "Active", icon: Globe },
        { name: "Trust Deed & Bylaws", size: "3.1 MB", date: "Updated 2023", icon: Scale },
        { name: "NITI Aayog NGO Darpan Profile", size: "0.5 MB", date: "Verified", icon: CheckCircle2 },
    ];

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="bg-stone-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                <Container>
                    <div className="max-w-3xl">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-6">
                            <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">TRUST & ACCOUNTABILITY</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8">AUDIT & <span className="text-[#7ab800]">COMPLIANCE</span></h1>
                        <p className="text-stone-400 text-lg md:text-xl font-medium leading-relaxed">
                            Moksha Seva operates with 100% legal compliance and transparency.
                            We are a registered trust with deep accountability to the law and our donors.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Compliance Grid */}
            <section className="py-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {documents.map((doc, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center mb-6 group-hover:bg-[#7ab800]/10 transition-colors">
                                    <doc.icon className="text-[#7ab800]" size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-stone-800">{doc.name}</h3>
                                <div className="flex items-center gap-4 mb-8 text-stone-400 font-bold text-[10px] uppercase tracking-widest">
                                    <span>VALID: {doc.date}</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                </div>
                                <Button variant="outline" className="w-full py-4 text-[10px] font-black uppercase tracking-widest border-stone-200 hover:border-[#7ab800] hover:text-[#7ab800]">
                                    <Download size={14} className="mr-2" /> DOWNLOAD DOCUMENT
                                </Button>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Tax Exemption Section */}
            <section className="py-20 bg-stone-100">
                <Container>
                    <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-[3rem] p-8 md:p-16 border border-stone-200 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7ab800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                        <div className="lg:w-1/2">
                            <div className="w-16 h-16 rounded-2xl bg-[#7ab800] flex items-center justify-center mb-8 shadow-lg">
                                <Award className="text-white" size={32} />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85] mb-6 text-stone-800">TAX <span className="text-[#7ab800]">EXEMPTION</span> FOR INDIAN DONORS</h2>
                            <p className="text-stone-500 font-medium text-lg leading-relaxed mb-8">
                                All donations made to Moksha Seva Foundation are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. We provide instant digital receipts for all contributions.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#7ab800] flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={12} className="text-white" />
                                    </div>
                                    <span className="font-black text-[11px] uppercase tracking-widest text-stone-800">NGO DARPAN ID: UP/2023/0345678</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#7ab800] flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={12} className="text-white" />
                                    </div>
                                    <span className="font-black text-[11px] uppercase tracking-widest text-stone-800">CSR REGISTRATION NO: CSR00012345</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full lg:pl-12">
                            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
                                <h4 className="text-stone-800 font-black text-sm uppercase tracking-widest mb-6">WHY REGISTRATION MATTERS</h4>
                                <ul className="space-y-4">
                                    {[
                                        "Ensures all funds are audited monthly.",
                                        "Guarantee that mission remains non-profit.",
                                        "Enables government tracking and safety.",
                                        "Builds permanent trust with the public."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <span className="text-[#7ab800] font-black">0{i + 1}.</span>
                                            <p className="text-stone-500 text-sm font-medium leading-tight">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}

// Icons for the documents that were missing in the imports
import { BarChart3, Globe } from "lucide-react";
