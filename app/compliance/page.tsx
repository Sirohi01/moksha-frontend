"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/Elements";
import { ShieldCheck, FileText, Download, CheckCircle2, Award, Scale, BarChart3, Globe, Loader2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { configService } from "@/services/configService";

interface Document {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: string;
  validityDate: string;
  documentType: string;
}

export default function CompliancePage() {
  const [config, setConfig] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pageConfig, docsRes] = await Promise.all([
          configService.getPageConfig('compliance'),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/compliance/documents`)
        ]);

        setConfig(pageConfig);

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          if (docsData.success) {
            setDocuments(docsData.data);
          }
        }
      } catch (err) {
        console.error("Failed to load compliance data:", err);
        setError("Unable to load compliance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'certificate': return ShieldCheck;
      case 'report': return BarChart3;
      case 'legal': return Scale;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
        <p className="text-stone-400 font-black text-xs uppercase tracking-widest">Verifying Compliance Data...</p>
      </div>
    );
  }

  const { hero, taxExemption } = config || {};

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7ab800]/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

        <Container className="relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 bg-[#7ab800] rounded-full shadow-[0_0_12px_rgba(122,184,0,0.6)]"></span>
              <span className="text-[11px] font-black text-stone-300 uppercase tracking-[0.3em] leading-none">{hero?.badge || "TRUST & ACCOUNTABILITY"}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10">
              {hero?.title || "AUDIT &"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ab800] to-[#a3d400]">
                {hero?.titleHighlight || "COMPLIANCE"}
              </span>
            </h1>
            <p className="text-stone-400 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl">
              {hero?.description || "Moksha Sewa operates with 100% legal compliance and transparency. We are a registered trust with deep accountability to the law and our donors."}
            </p>
          </div>
        </Container>
      </section>

      {/* Compliance Grid */}
      <section className="py-24 relative overflow-hidden">
        <Container>
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-[2.5rem] p-12 text-center max-w-2xl mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
              <p className="text-red-900 font-black uppercase tracking-tight text-xl mb-2">Something went wrong</p>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {documents.map((doc) => {
                const Icon = getIcon(doc.documentType);
                return (
                  <div key={doc._id} className="group relative bg-white p-10 rounded-[3rem] border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab800]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center mb-8 group-hover:bg-[#7ab800]/10 transition-colors border border-stone-100">
                      <Icon className="text-[#7ab800]" size={28} />
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-stone-900 leading-tight min-h-[3rem]">
                      {doc.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mb-10 text-stone-400 font-black text-[10px] uppercase tracking-widest bg-stone-50 px-5 py-2.5 rounded-full w-fit">
                      <span>VALID: {doc.validityDate}</span>
                      <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                      <span>{doc.fileSize}</span>
                    </div>

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-stone-950 text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#7ab800] transition-all shadow-lg active:scale-95"
                    >
                      <Download size={16} /> DOWNLOAD DOCUMENT
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-stone-100 rounded-[3rem] border border-dashed border-stone-300">
              <FileText className="w-16 h-16 text-stone-300 mx-auto mb-6" />
              <p className="text-stone-400 font-black uppercase tracking-widest text-sm">No compliance documents available yet.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Tax Exemption Section */}
      <section className="py-24 bg-stone-100">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-[4rem] p-10 md:p-20 border border-stone-200 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7ab800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />

            <div className="lg:w-3/5 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-[#7ab800] flex items-center justify-center mb-10 shadow-xl shadow-[#7ab800]/20">
                <Award className="text-white" size={40} />
              </div>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-stone-950">
                {taxExemption?.title || "TAX"} <br />
                <span className="text-[#7ab800]">{taxExemption?.titleHighlight || "EXEMPTION"}</span> FOR INDIAN DONORS
              </h2>
              <p className="text-stone-500 font-medium text-xl leading-relaxed mb-10 max-w-2xl">
                {taxExemption?.description || "All donations made to Moksha Sewa Foundation are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. We provide instant digital receipts for all contributions."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(taxExemption?.registrations || [
                  { label: "NGO DARPAN ID", value: "UP/2023/0345678" },
                  { label: "CSR REGISTRATION NO", value: "CSR00012345" }
                ]).map((reg: any, i: number) => (
                  <div key={i} className="flex flex-col gap-1 p-5 rounded-2xl bg-stone-50 border border-stone-100">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7ab800]">{reg.label}</span>
                    <span className="font-black text-sm text-stone-900 tracking-tight">{reg.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-2/5 w-full relative z-10">
              <div className="bg-stone-50/50 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-stone-200 shadow-inner">
                <h4 className="text-stone-950 font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#7ab800] rounded-full"></div>
                  WHY ACCOUNTABILITY MATTERS
                </h4>
                <ul className="space-y-6">
                  {(taxExemption?.points || [
                    "Ensures all funds are audited monthly.",
                    "Guarantee that mission remains non-profit.",
                    "Enables government tracking and safety.",
                    "Builds permanent trust with the public."
                  ]).map((item: string, i: number) => (
                    <li key={i} className="flex gap-5 items-start">
                      <span className="text-[#7ab800] font-black text-xl leading-none">0{i + 1}.</span>
                      <p className="text-stone-600 text-base font-semibold leading-snug">{item}</p>
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

