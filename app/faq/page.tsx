"use client";
import { useState } from "react";
import { Container, SectionHeader } from "@/components/ui/Elements";
import { mockFAQs } from "@/lib/mockData";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const categories = ["All", "General", "Reporting", "Volunteering", "Donations", "Transparency", "Process"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>("1");

  const filtered = activeCategory === "All"
    ? mockFAQs
    : mockFAQs.filter((f) => f.category === activeCategory);

  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-20">
        <Container>
          <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">✦ Help Center ✦</span>
          <h1 className="font-serif text-4xl font-bold mt-3 mb-4">Frequently Asked Questions</h1>
          <p className="text-stone-300 text-lg max-w-2xl">
            Find answers to common questions about Moksha Sewa, our services, and how you can help.
          </p>
        </Container>
      </section>

      <section className="py-16 bg-cream-50">
        <Container size="lg">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                  ? "bg-saffron-600 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-saffron-400"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filtered.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-cream-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  aria-expanded={openId === faq.id}
                >
                  <span className="font-medium text-stone-800 pr-4">{faq.question}</span>
                  {openId === faq.id
                    ? <ChevronUp className="w-5 h-5 text-saffron-600 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
                  }
                </button>
                {openId === faq.id && (
                  <div className="px-6 pb-5 text-stone-600 text-sm leading-relaxed border-t border-cream-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="text-center mt-12 bg-saffron-50 rounded-2xl p-8 border border-saffron-100 max-w-2xl mx-auto">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              Still have questions?
            </h3>
            <p className="text-stone-600 text-sm mb-5">
              Our team is available 24/7 to help you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="tel:+919220147229">
                <button className="bg-saffron-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-saffron-700 transition-colors">
                  Call 9220147229
                </button>
              </a>
              <Link href="/contact">
                <button className="bg-white text-saffron-600 border border-saffron-300 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-saffron-50 transition-colors">
                  Send a Message
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
