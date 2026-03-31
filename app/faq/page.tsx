"use client";
import { useState } from "react";
import { Container, SectionHeader } from "@/components/ui/Elements";
import { mockFAQs } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const categories = ["All", "General", "Reporting", "Volunteering", "Donations", "Transparency", "Process"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>("1");

  const filtered = activeCategory === "All"
    ? mockFAQs
    : mockFAQs.filter((f) => f.category === activeCategory);

  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-20 relative overflow-hidden">
        {/* Background Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <Container>
          <span className="text-saffron-400 text-sm font-medium tracking-[0.3em] uppercase block mb-2">✦ Help Center ✦</span>
          <h1 className="font-serif text-5xl font-bold mt-3 mb-6">Frequently <br className="hidden md:block" /> Asked Questions</h1>
          <p className="text-stone-300 text-lg max-w-2xl leading-relaxed">
            Find clarity on our mission, sacred processes, and how you can join us in restoring dignity to the final journey.
          </p>
        </Container>
      </section>

      <section className="py-16 bg-cream-50 min-h-[60vh]">
        <Container size="lg">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tighter transition-all ${activeCategory === cat
                  ? "bg-stone-900 text-white shadow-lg"
                  : "bg-white text-stone-500 border border-cream-200 hover:border-saffron-400 hover:text-stone-800 shadow-sm"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filtered.map((faq) => (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openId === faq.id 
                  ? "border-saffron-200 shadow-xl shadow-saffron-600/5" 
                  : "border-cream-200 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-8 py-5 text-left group"
                  aria-expanded={openId === faq.id}
                >
                  <span className={`font-bold text-lg transition-colors ${openId === faq.id ? "text-stone-900" : "text-stone-700 group-hover:text-stone-900"}`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full transition-all ${openId === faq.id ? "bg-saffron-100 rotate-180" : "bg-stone-50 group-hover:bg-stone-100"}`}>
                    <ChevronDown className={`w-5 h-5 transition-colors ${openId === faq.id ? "text-saffron-600" : "text-stone-400"}`} />
                  </div>
                </button>
                {openId === faq.id && (
                  <div className="px-8 pb-6 text-stone-600 text-base leading-relaxed animate-fade-in">
                    <div className="pt-2 border-t border-cream-50 italic">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-cream-200 shadow-2xl shadow-stone-200 relative overflow-hidden group">
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-50 rounded-bl-[100px] transition-all duration-500 group-hover:w-40 group-hover:h-40"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left flex-1">
                  <h3 className="font-serif text-3xl font-bold text-stone-900 mb-4">
                    Still Have Questions?
                  </h3>
                  <p className="text-stone-500 text-lg mb-0">
                    Our dedicated Force is available 24/7 to respond to any call for dignity.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <a href="tel:+919220147229" className="flex items-center gap-4 bg-saffron-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-saffron-700 transition-all hover:scale-105 active:scale-95 group/call">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover/call:rotate-12 transition-transform">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest font-black opacity-80 leading-tight">Call 24/7 Helpline</p>
                      <p className="text-xl font-bold whitespace-nowrap leading-tight">+91 92201 47229</p>
                    </div>
                  </a>
                  
                  <Link href="/contact" className="flex items-center gap-4 bg-stone-900 text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-black transition-all hover:scale-105 active:scale-95 group/msg">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover/msg:-rotate-12 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest font-black opacity-80 leading-tight">Response Team</p>
                      <p className="text-xl font-bold whitespace-nowrap leading-tight">Contact Us</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
