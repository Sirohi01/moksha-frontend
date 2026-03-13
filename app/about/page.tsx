import type { Metadata } from "next";
import { SectionHeader, Container } from "@/components/ui/Elements";
import { Card } from "@/components/ui/Card";
import { Users, Target, Eye, Heart, Award, CheckCircle } from "lucide-react";
import Image from 'next/image';

export const metadata: Metadata = { title: "About Moksha Seva" };

const values = [
  { icon: Heart, title: "Compassion First", desc: "Every individual, regardless of identity or status, deserves care and dignity in their final moments." },
  { icon: Eye, title: "Radical Transparency", desc: "All cases, finances, and operations are publicly documented. No hidden practices." },
  { icon: Users, title: "Community Powered", desc: "Our strength lies in our volunteer network, partner NGOs, and generous donors." },
  { icon: Award, title: "Accountability", desc: "We are accountable to every family, donor, and the public through open data." },
];

const team = [
  { name: "Suresh Narayan", role: "Founder & Director", city: "Delhi", years: "6 years" },
  { name: "Priya Iyer", role: "Operations Head", city: "Mumbai", years: "4 years" },
  { name: "Mohammed Rafiq", role: "Legal & Compliance", city: "Delhi", years: "5 years" },
  { name: "Kavitha Rajan", role: "Volunteer Coordinator", city: "Chennai", years: "3 years" },
  { name: "Arjun Bhatia", role: "Technology Lead", city: "Bangalore", years: "2 years" },
  { name: "Sunita Devi", role: "Community Outreach", city: "Lucknow", years: "4 years" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 bg-stone-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-300/20 rounded-full blur-xl"></div>
        </div>
        
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <span className="text-amber-700 text-sm font-medium tracking-widest uppercase">✦ Our Story ✦</span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
                About Moksha Seva
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Founded in 2018, Moksha Seva began with a simple conviction: that every human being —
                regardless of identity, wealth, or social status — deserves a respectful and dignified
                farewell.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-800">2,847</div>
                  <div className="text-sm text-gray-600">Lives Honored</div>
                </div>
                <div className="w-px h-12 bg-amber-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-800">38+</div>
                  <div className="text-sm text-gray-600">Cities Served</div>
                </div>
                <div className="w-px h-12 bg-amber-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-800">6</div>
                  <div className="text-sm text-gray-600">Years of Service</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-amber-100 rounded-2xl"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-lg">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <Image 
                    src="/gallery/image007.png" 
                    alt="Moksha Seva Service" 
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Serving with Dignity</h3>
                  <p className="text-gray-600 text-sm">Every soul deserves respect in their final journey</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-stone-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="spiritual" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-700" />
                </div>
                <h2 className="font-serif text-xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To ensure every unclaimed body and destitute individual receives a dignified cremation
                with proper rites, complete documentation, and public accountability — in partnership
                with police departments, hospitals, and municipal authorities.
              </p>
            </Card>
            <Card variant="spiritual" padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-700" />
                </div>
                <h2 className="font-serif text-xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A society where no person is left without dignified last rites — where technology,
                compassion, and civic duty unite to ensure that death does not discriminate, and
                neither does our response to it.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-12 bg-stone-50">
        <Container size="lg">
          <SectionHeader tag="Journey" title="How Moksha Seva Began" centered={false} />
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                In 2017, our founder Suresh Narayan witnessed an unclaimed body lying uncremated
                near a Delhi railway station for three days due to bureaucratic delays and lack of
                resources. That experience became the seed of Moksha Seva.
              </p>
              <p>
                Starting with just 5 volunteers and a small fund, the organization began documenting
                and coordinating cremations in partnership with Delhi Police. Within a year, we had
                performed 200 cremations and helped 50 families navigate government processes.
              </p>
              <p>
                Today, Moksha Seva operates in 38 cities with 412 active volunteers, and has
                performed 2,847 cremations — each one documented and publicly accessible. We work
                in formal partnership with 12 police districts, 8 hospitals, and 25 NGOs.
              </p>
              
              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-stone-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">2,847</div>
                  <div className="text-sm text-gray-600">Cremations Performed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">38</div>
                  <div className="text-sm text-gray-600">Cities Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">412</div>
                  <div className="text-sm text-gray-600">Active Volunteers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-700">8+</div>
                  <div className="text-sm text-gray-600">Years of Service</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <Image 
                    src="/gallery/image009.png" 
                    alt="Our Journey" 
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-12 bg-stone-100">
        <Container>
          <SectionHeader tag="Values" title="What We Stand For" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} variant="elevated" padding="md" className="text-center hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                    <Icon className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-serif font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{v.desc}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-12 bg-stone-50">
        <Container>
          <SectionHeader tag="Team" title="The People Behind Moksha Seva" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <Card key={member.name} variant="bordered" padding="md" className="flex items-start gap-4 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center text-stone-50 font-serif font-bold text-lg flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-amber-700 text-sm">{member.role}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {member.city} · {member.years} with Moksha Seva
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Registrations */}
      <section className="py-16 bg-stone-100 border-t border-amber-200">
        <Container>
          <h2 className="font-serif text-2xl font-bold text-gray-900 text-center mb-8">
            Official Registrations & Certifications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Registered NGO under Societies Act",
              "12A Income Tax Exemption",
              "80G Donation Tax Benefit",
              "FCRA Registered",
            ].map((cert) => (
              <div key={cert} className="flex items-start gap-2 bg-stone-50 rounded-lg p-4 border border-amber-200 hover:border-amber-300 transition-colors">
                <CheckCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm">{cert}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
