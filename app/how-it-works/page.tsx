import type { Metadata } from "next";
import { Container, SectionHeader } from "@/components/ui/Elements";
import { Phone, FileText, Search, Flame, Award, Clock, Users, Shield } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "How It Works" };

const steps = [
  {
    icon: Phone,
    step: "Step 1",
    title: "Report an Unclaimed Body",
    desc: "A body is reported through our 24/7 helpline, online form, by police, hospital staff, or a member of the public. Every report is logged with a unique Case ID.",
    timeline: "0–2 hours",
    actions: ["Report received via helpline/form/police", "Case ID generated instantly", "Notification sent to nearest volunteer team"],
  },
  {
    icon: Shield,
    step: "Step 2",
    title: "Police Coordination & Verification",
    desc: "Our team coordinates with the nearest police station within 2 hours of the report. Police file an FIR, and we register the case in our system.",
    timeline: "2–6 hours",
    actions: ["FIR filed with police", "Body transported to safe location", "Documentation begins"],
  },
  {
    icon: Search,
    step: "Step 3",
    title: "Identification Attempt",
    desc: "We make every effort to identify the deceased — using our database, social media outreach, Missing Persons helplines, and hospital records. Family is notified if found.",
    timeline: "24–72 hours",
    actions: ["Photo added to public database", "Social media outreach", "Hospital & missing persons cross-check", "DNA sample preserved"],
  },
  {
    icon: FileText,
    step: "Step 4",
    title: "Documentation & Legal Process",
    desc: "All necessary legal documentation is completed — death certificate application, NOC from police, case records, and next-of-kin search documentation.",
    timeline: "During 72-hour window",
    actions: ["Death certificate filed", "Police NOC obtained", "All documentation digitized", "Legal compliance verified"],
  },
  {
    icon: Flame,
    step: "Step 5",
    title: "Dignified Cremation",
    desc: "If the person remains unidentified after 72 hours (or if family requests), we conduct a full cremation with proper religious rites at an approved cremation ground.",
    timeline: "Within 72–96 hours",
    actions: ["Cremation with religious rites", "Ash immersion in sacred water body", "Volunteer team in attendance", "Video documentation for records"],
  },
  {
    icon: Award,
    step: "Step 6",
    title: "Certificate & Public Record",
    desc: "An official cremation certificate is issued. The case is published on our public Transparency Dashboard with all details — permanently accessible.",
    timeline: "Within 48 hours post-cremation",
    actions: ["Official certificate issued", "Record published on dashboard", "Case archived for 25 years", "Family can access records anytime"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="py-20 bg-amber-800">
        <Container>
          <div className="text-center text-stone-50">
            <p className="text-amber-200 font-black text-[10px] uppercase tracking-[0.4em] mb-4">✦ Our Sacred Process ✦</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
              How <span className="text-amber-200">Moksha Seva</span> Works
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              A transparent, humane, and legally compliant 6-step process — from the first report
              to a permanent public record.
            </p>
          </div>
        </Container>
      </section>

      {/* Timeline Process */}
      <section className="py-20 bg-stone-100">
        <Container>
          <div className="space-y-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
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
                      
                      <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">{step.desc}</p>
                      
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
              Have a Case to Report?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Our team is available 24/7. Every report is taken seriously and acted upon immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/report">
                <Button className="bg-stone-50 hover:bg-white text-amber-800 px-10 py-4 rounded-lg font-black uppercase tracking-widest transition-all shadow-lg">
                  Report Online
                </Button>
              </Link>
              <a href="tel:+911800123456">
                <Button className="border-2 border-stone-50 text-stone-50 hover:bg-stone-50 hover:text-amber-800 px-10 py-4 rounded-lg font-black uppercase tracking-widest transition-all flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Call 1800-123-456
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
