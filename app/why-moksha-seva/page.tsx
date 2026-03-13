import { Container } from "@/components/ui/Elements";
import { Heart, Shield, Users, Clock, Award, CheckCircle } from "lucide-react";
import Image from 'next/image';

export default function WhyMokshaSeva() {
  const reasons = [
    {
      icon: Heart,
      title: "COMPASSIONATE CARE",
      description: "Every soul deserves dignity in their final journey. We treat each case with utmost respect and traditional Hindu rites.",
      color: "text-red-500"
    },
    {
      icon: Shield,
      title: "TRUSTED LEGACY",
      description: "8+ years of dedicated service with 100% transparency and government partnerships across 38+ cities.",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "COMMUNITY DRIVEN",
      description: "400+ trained volunteers and local partnerships ensure we're always ready to serve when needed most.",
      color: "text-[#20b2aa]"
    },
    {
      icon: Clock,
      title: "24/7 AVAILABILITY",
      description: "Our helpline and emergency response team operates round the clock, ensuring no soul is left unclaimed.",
      color: "text-orange-500"
    },
    {
      icon: Award,
      title: "RECOGNIZED EXCELLENCE",
      description: "Featured in national media and recognized by government bodies for our humanitarian service.",
      color: "text-purple-500"
    },
    {
      icon: CheckCircle,
      title: "COMPLETE COMPLIANCE",
      description: "All services follow legal protocols with proper documentation and 80G tax-exempt donations.",
      color: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-stone-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-gray-900">
                Why Choose <span className="text-amber-700">Moksha Seva</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium max-w-3xl leading-relaxed text-gray-700 mb-8">
                When dignity matters most, trust the organization that has served with compassion for over 8 years
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-700">2,840+</div>
                  <div className="text-sm text-gray-600">Lives Honored</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-700">38+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-700">8+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/gallery/image0010.png" 
                  alt="Moksha Seva service" 
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-stone-200 rounded-full opacity-30"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Reasons */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-xl transition-all duration-500 group">
                <div className={`w-16 h-16 rounded-xl bg-stone-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${reason.color}`}>
                  <reason.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-stone-900">
                  {reason.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              Our Impact Speaks
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2,840+", label: "Sacred Rites Completed" },
              { number: "38+", label: "Cities Served" },
              { number: "400+", label: "Active Volunteers" },
              { number: "100%", label: "Legal Compliance" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-amber-700 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-amber-800">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
              Join Our Sacred Mission
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Be part of a movement that ensures every soul receives the dignity they deserve in their final journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/volunteer" 
                className="bg-amber-100 hover:bg-white text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                Become a Volunteer
              </a>
              <a 
                href="/donate" 
                className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                Support Our Cause
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}