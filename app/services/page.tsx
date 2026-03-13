import type { Metadata } from "next";
import { SectionHeader, Container } from "@/components/ui/Elements";
import Button from "@/components/ui/Button";
import Image from 'next/image';
import {
  Flame, FileText, Users, Phone, MapPin, Heart,
  Clock, Shield, Camera, BookOpen, CheckCircle, UserCheck
} from "lucide-react";

export const metadata: Metadata = { title: "Services" };

const mainServices = [
  {
    icon: Flame,
    title: "Dignified Cremation Services",
    badge: "Core Service",
    badgeVariant: "primary" as const,
    desc: "We perform complete cremation rituals for unclaimed bodies, homeless individuals, and destitute families. Services include transportation, preparation, religious rites (per deceased's religion), and disposal of ashes in a sacred water body.",
    includes: [
      "Body transportation to cremation ground",
      "Ritual preparation and last rites",
      "Religious rites as per tradition",
      "Ash immersion ceremony",
    ],
  },
  {
    icon: FileText,
    title: "Documentation & Legal Support",
    badge: "Admin",
    badgeVariant: "secondary" as const,
    desc: "Full legal documentation including official death certificates, police NOC, case registration, and post-cremation certificates — all handled by our trained documentation team.",
    includes: [
      "Death certificate (official)",
      "Police NOC coordination",
      "Case registration & body ID",
      "Post-cremation certificate",
    ],
  },
  {
    icon: Users,
    title: "Family Support & Counseling",
    badge: "Support",
    badgeVariant: "primary" as const,
    desc: "For poor families who cannot afford funeral costs, we provide full support at no charge. We also assist in identifying government schemes and financial aid available.",
    includes: [
      "Free service for destitute families",
      "Grief counseling sessions",
      "Government scheme guidance",
      "Legal heir certificate help",
    ],
  },
  {
    icon: Camera,
    title: "Body Identification Services",
    badge: "Investigation",
    badgeVariant: "secondary" as const,
    desc: "We maintain a photographic and descriptive database to assist in identifying unclaimed bodies. We coordinate with hospitals, police, and social media to reunite families.",
    includes: [
      "Photographic documentation",
      "Database listing for 90 days",
      "Social media outreach",
      "DNA coordination (partner labs)",
    ],
  },
  {
    icon: BookOpen,
    title: "Awareness & Training Programs",
    badge: "Education",
    badgeVariant: "secondary" as const,
    desc: "We train police officers, hospital staff, and municipal workers on protocols for handling unclaimed bodies with dignity, proper documentation, and legal compliance.",
    includes: [
      "Police department training",
      "Hospital staff workshops",
      "Municipal worker orientation",
      "NGO capacity building",
    ],
  },
  {
    icon: Shield,
    title: "Government Liaison Services",
    badge: "Compliance",
    badgeVariant: "primary" as const,
    desc: "We act as a bridge between families and government authorities — helping navigate bureaucracy, apply for aid, and ensure legal rights are protected.",
    includes: [
      "Government scheme applications",
      "Compensation claim support",
      "Legal heir documentation",
      "Pension and welfare follow-up",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-stone-50">
        <Container>
          <div className="text-center">
            <p className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4">✦ Our Services ✦</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-6 text-gray-900">
              Our <span className="text-amber-700">Services</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed text-gray-700">
              End-to-end humanitarian services — from cremation to documentation to family support —
              all at no cost to destitute individuals and families.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-stone-100">
        <Container>
          <div className="space-y-12">
            {mainServices.map((service, idx) => {
              const Icon = service.icon;
              const isEven = idx % 2 === 0;
              return (
                <div key={service.title} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-start`}>
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-200">
                        <Icon className="w-8 h-8 text-amber-700" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 leading-tight">{service.title}</h2>
                        <span className="bg-amber-700 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                          {service.badge}
                        </span>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6 font-medium">{service.desc}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.includes.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-3 text-sm text-gray-700 bg-stone-50 p-3 rounded-lg">
                            <div className="w-2 h-2 bg-amber-700 rounded-full flex-shrink-0" />
                            <span className="font-medium">{item}</span>
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

      {/* Who Can Access Section */}
      <section className="py-12 bg-gradient-to-br from-amber-50 to-stone-100">
        <Container>
          <div className="text-center mb-8">
            <span className="text-amber-700 text-sm font-medium tracking-widest uppercase">✦ Eligibility ✦</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900">
              Who Can Access Our Services?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our services are completely free and available to anyone in need. We believe dignity in death is a fundamental right, not a privilege.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Eligibility criteria */}
            <div className="space-y-4">
              {[
                {
                  icon: UserCheck,
                  title: "Unclaimed Bodies",
                  desc: "Bodies reported by police, hospitals, or public with no family to claim them",
                  image: "/gallery/image1.png"
                },
                {
                  icon: Heart,
                  title: "Homeless Individuals",
                  desc: "People without family or support system who need dignified final rites",
                  image: "/gallery/image2.png"
                },
                {
                  icon: Users,
                  title: "Destitute Families",
                  desc: "Families who cannot afford cremation costs - we provide complete support",
                  image: "/gallery/image3.png"
                },
                {
                  icon: Shield,
                  title: "Hospital Referrals",
                  desc: "Bodies referred by government and private hospitals across our service areas",
                  image: "/gallery/image4.png"
                },
                {
                  icon: MapPin,
                  title: "Municipal Cases",
                  desc: "Cases reported by municipal authorities and local government bodies",
                  image: "/gallery/image5.png"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                          <Icon className="w-5 h-5 text-amber-700" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side - Contact and process */}
            <div className="space-y-6">
              {/* Main image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/gallery/image6.png"
                    alt="Moksha Seva services"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-amber-100 rounded-full opacity-30"></div>
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-stone-200 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
