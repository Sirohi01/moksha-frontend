"use client";
import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Elements";
import { Users, Mail, Phone, ChevronRight, BarChart3, Globe, ShieldCheck, ArrowLeft, Award, Calendar, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { useParams } from "next/navigation";

const profiles = {
  "saurabh-dev": {
    name: "Saurabh Dev",
    role: "Managing Trustee & Founder",
    email: "saurabh-dev@MokshaSewa.org",
    phone: "+91 98765 43210",
    location: "Delhi, India",
    joined: "2018",
    bio: "Saurabh founded Moksha Sewa in 2018 with a simple vision: no soul should depart this world without dignity. With over 15 years of experience in social work and humanitarian services, he has built a network of 400+ volunteers across 38 cities. His leadership has transformed how India treats its most vulnerable citizens in their final moments.",
    achievements: [
      "Founded Moksha Sewa and scaled to 38+ cities",
      "Performed 8,500+ dignified cremations",
      "Built volunteer network of 400+ Saathis",
      "Established partnerships with 50+ government bodies"
    ],
    expertise: ["Social Work", "Operations Management", "Volunteer Coordination", "Government Relations"],
    icon: Users
  },
  "dr-ananya-sharma": {
    name: "Dr. Ananya Sharma",
    role: "Medical Compliance Officer",
    email: "dr-ananya@MokshaSewa.org",
    phone: "+91 98765 43211",
    location: "Mumbai, India",
    joined: "2019",
    bio: "Dr. Ananya brings 20+ years of forensic medicine expertise to Moksha Sewa. She ensures all medical and legal protocols are followed meticulously, working closely with police departments and hospitals. Her guidance has been instrumental in establishing our credibility with government institutions.",
    achievements: [
      "Established medical compliance protocols",
      "Trained 100+ volunteers in legal procedures",
      "Created partnerships with 30+ hospitals",
      "Streamlined post-mortem clearance processes"
    ],
    expertise: ["Forensic Medicine", "Legal Compliance", "Medical Ethics", "Hospital Coordination"],
    icon: ShieldCheck
  },
  "pandit-ravi-shastri": {
    name: "Pandit Ravi Shastri",
    role: "Sacred Rites Advisor",
    email: "pandit-ravi@MokshaSewa.org",
    phone: "+91 98765 43212",
    location: "Varanasi, India",
    joined: "2018",
    bio: "Pandit Ravi Shastri is a renowned Vedic scholar with 35+ years of experience in performing sacred rituals. He ensures that every cremation conducted by Moksha Sewa adheres to traditional Hindu customs with complete authenticity and respect. His spiritual guidance forms the soul of our mission.",
    achievements: [
      "Performed 5,000+ traditional cremation ceremonies",
      "Trained 50+ priests in dignified rites",
      "Authored guidelines for sacred ceremonies",
      "Established ritual protocols for all cities"
    ],
    expertise: ["Vedic Rituals", "Hindu Traditions", "Spiritual Counseling", "Sacred Ceremonies"],
    icon: Users
  },
  "rajesh-khanna": {
    name: "Rajesh Khanna",
    role: "Operational Logistics Head",
    email: "rajesh@MokshaSewa.org",
    phone: "+91 98765 43213",
    location: "Delhi, India",
    joined: "2020",
    bio: "Rajesh brings 18 years of logistics and supply chain management experience from the corporate sector. He coordinates our 400+ volunteer force, manages ambulance operations, and ensures 24/7 response capability across all cities. His operational excellence has made our mission scalable and sustainable.",
    achievements: [
      "Built 24/7 response system across 38 cities",
      "Managed 400+ volunteer coordination",
      "Reduced response time to under 2 hours",
      "Established 15 regional operation centers"
    ],
    expertise: ["Logistics Management", "Operations", "Volunteer Coordination", "Crisis Response"],
    icon: BarChart3
  },
  "sunita-reddy": {
    name: "Sunita Reddy",
    role: "Legal & Transparency Lead",
    email: "sunita@MokshaSewa.org",
    phone: "+91 98765 43214",
    location: "Bangalore, India",
    joined: "2019",
    bio: "Sunita is a corporate lawyer with 22 years of experience in non-profit governance and compliance. She oversees all legal matters, ensures 80G compliance, manages government relations, and maintains our transparency dashboard. Her work has established Moksha Sewa as one of India's most transparent NGOs.",
    achievements: [
      "Secured 80G and 12A certifications",
      "Built public transparency dashboard",
      "Established partnerships with 40+ govt bodies",
      "Maintained 100% audit compliance record"
    ],
    expertise: ["Non-Profit Law", "Compliance", "Government Relations", "Transparency"],
    icon: ShieldCheck
  }
};

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const profile = profiles[id as keyof typeof profiles];

  if (!profile) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-stone-900 mb-4">PROFILE NOT FOUND</h1>
            <p className="text-stone-500 mb-8">The board member profile you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/board">
              <Button className="bg-[#7ab800] text-white px-10 py-5 font-black uppercase tracking-widest">
                BACK TO BOARD
              </Button>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-12 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <Container>
          <Link href="/board" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#7ab800] transition-colors mb-8 font-black text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> BACK TO BOARD
          </Link>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-32 h-32 rounded-[2rem] bg-[#7ab800]/20 border-4 border-[#7ab800]/30 flex items-center justify-center shrink-0">
              <profile.icon className="text-[#7ab800]" size={64} />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#7ab800]/10 border border-[#7ab800]/20 mb-4">
                <p className="text-[#7ab800] font-black text-[10px] uppercase tracking-[0.4em] leading-none">BOARD MEMBER</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-4">{profile.name}</h1>
              <p className="text-[#7ab800] text-xl font-black uppercase tracking-wider mb-6">{profile.role}</p>
              <div className="flex flex-wrap gap-6 text-stone-400">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="text-sm font-bold">{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="text-sm font-bold">Joined {profile.joined}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Bio */}
              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-sm">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-6 leading-none">ABOUT</h2>
                <p className="text-stone-600 font-medium text-lg leading-relaxed">{profile.bio}</p>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-sm">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-8 leading-none">KEY ACHIEVEMENTS</h2>
                <div className="space-y-4">
                  {profile.achievements.map((achievement, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-lg bg-[#7ab800]/10 flex items-center justify-center shrink-0 mt-1">
                        <Award className="text-[#7ab800]" size={16} />
                      </div>
                      <p className="text-stone-700 font-medium leading-relaxed">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-sm">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-stone-900 mb-8 leading-none">AREAS OF EXPERTISE</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.expertise.map((skill, i) => (
                    <div key={i} className="px-6 py-3 rounded-full bg-stone-50 border border-stone-200 text-stone-700 font-black text-xs uppercase tracking-wider">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="bg-[#7ab800] rounded-[2rem] p-8 text-white shadow-xl sticky top-8">
                <h3 className="text-xl font-black uppercase tracking-tighter mb-8 leading-none">GET IN TOUCH</h3>
                <div className="space-y-6">
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <Mail size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">EMAIL</p>
                      <p className="text-sm font-bold break-all">{profile.email}</p>
                    </div>
                  </a>
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <Phone size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">PHONE</p>
                      <p className="text-sm font-bold">{profile.phone}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm">
                <h3 className="text-lg font-black uppercase tracking-tighter text-stone-900 mb-4 leading-none">JOIN OUR MISSION</h3>
                <p className="text-stone-600 text-sm mb-6 leading-relaxed">Interested in joining our advisory board?</p>
                <Link href="/board/apply">
                  <Button className="w-full bg-[#7ab800] text-white py-4 font-black uppercase tracking-widest text-xs">
                    APPLY TO BOARD
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
