import { Container } from "@/components/ui/Elements";
import { TrendingUp, Users, MapPin, Heart, Calendar, Award } from "lucide-react";
import Image from 'next/image';

export default function Impact() {
  const impactStats = [
    { icon: Heart, number: "2,840+", label: "Sacred Rites Completed", color: "text-red-500" },
    { icon: MapPin, number: "38+", label: "Cities Actively Served", color: "text-blue-500" },
    { icon: Users, number: "400+", label: "Trained Volunteers", color: "text-[#20b2aa]" },
    { icon: Calendar, number: "8+", label: "Years of Service", color: "text-orange-500" },
    { icon: Award, number: "100%", label: "Legal Compliance", color: "text-green-500" },
    { icon: TrendingUp, number: "24/7", label: "Emergency Response", color: "text-purple-500" }
  ];

  const yearlyData = [
    { year: "2018", rites: 45, cities: 1, volunteers: 5 },
    { year: "2019", rites: 180, cities: 3, volunteers: 25 },
    { year: "2020", rites: 520, cities: 8, volunteers: 60 },
    { year: "2021", rites: 890, cities: 15, volunteers: 120 },
    { year: "2022", rites: 1240, cities: 22, volunteers: 200 },
    { year: "2023", rites: 1680, cities: 30, volunteers: 300 },
    { year: "2024", rites: 2150, cities: 35, volunteers: 380 },
    { year: "2025", rites: 2840, cities: 38, volunteers: 400 }
  ];

  const testimonials = [
    {
      quote: "Moksha Seva gave my father the dignified farewell he deserved when we had nowhere else to turn.",
      author: "Priya Sharma, Delhi",
      role: "Beneficiary Family"
    },
    {
      quote: "Working with Moksha Seva has been the most fulfilling experience of my life. Every soul matters.",
      author: "Rajesh Kumar, Volunteer",
      role: "5 Years of Service"
    },
    {
      quote: "Their transparency and dedication to traditional rites is unmatched in humanitarian work.",
      author: "Dr. Anita Verma",
      role: "Social Worker"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-stone-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-gray-900">
                  Our <span className="text-amber-700">Impact</span>
                </h1>
                <p className="text-xl font-medium max-w-2xl leading-relaxed text-gray-700 mb-8">
                  Measuring the difference we make in ensuring dignity for every soul's final journey across India
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                  <div className="text-2xl font-black text-amber-700">2,840+</div>
                  <div className="text-sm text-gray-600">Lives Honored</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                  <div className="text-2xl font-black text-amber-700">38+</div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                  <div className="text-2xl font-black text-amber-700">8+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <h3 className="text-lg font-black text-gray-900 mb-3">Our Mission Impact</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Every number represents a family we've supported, a community we've served, and a life we've honored with dignity and respect.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">100% Free Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">24/7 Available</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/volunteer" 
                  className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-all text-center"
                >
                  Join Our Mission
                </a>
                <a 
                  href="/donate" 
                  className="border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all text-center"
                >
                  Support Our Work
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/gallery/image2.png" 
                  alt="Our impact in serving communities" 
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100 rounded-full opacity-30"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-stone-200 rounded-full opacity-40"></div>
              
              {/* Floating stats */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="text-lg font-black text-amber-700">400+</div>
                <div className="text-xs text-gray-600">Volunteers</div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="text-lg font-black text-green-600">100%</div>
                <div className="text-xs text-gray-600">Compliance</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-br from-stone-50 to-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every number represents a life touched, a family supported, and dignity restored in the most sacred moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white p-8 rounded-2xl border border-stone-200 hover:shadow-xl transition-all duration-500 text-center relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-stone-100 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="text-4xl md:text-5xl font-black text-amber-700 mb-3 group-hover:scale-105 transition-transform">
                    {stat.number}
                  </div>
                  
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-4">
                    {stat.label}
                  </div>
                  
                  {/* Add descriptive text for each stat */}
                  <div className="text-xs text-gray-500 leading-relaxed">
                    {index === 0 && "Sacred rites performed with dignity and respect"}
                    {index === 1 && "Cities where we actively serve communities"}
                    {index === 2 && "Dedicated volunteers across India"}
                    {index === 3 && "Years of compassionate service"}
                    {index === 4 && "Adherence to legal and ethical standards"}
                    {index === 5 && "Round-the-clock emergency response"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional impact metrics */}
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-stone-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-amber-700 font-black text-lg">₹0</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">Free Service</div>
                <div className="text-xs text-gray-500">No cost to families in need</div>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-green-700 font-black text-lg">✓</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">80G Certified</div>
                <div className="text-xs text-gray-500">Tax exemption for donors</div>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-blue-700 font-black text-lg">∞</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">24/7 Available</div>
                <div className="text-xs text-gray-500">Always ready to serve</div>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-purple-700 font-black text-lg">♥</span>
                </div>
                <div className="text-lg font-black text-gray-900 mb-1">With Dignity</div>
                <div className="text-xs text-gray-500">Every soul honored equally</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Growth Timeline */}
      <section className="py-12 bg-stone-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-4">
                Our Growth Journey
              </h2>
              <div className="w-20 h-1 bg-amber-700 mb-6"></div>
              <p className="text-gray-600 mb-8">
                From humble beginnings in 2018 to serving 38+ cities today, our journey reflects 
                the growing trust communities place in our mission of dignity and compassion.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { year: "2018", rites: 45, cities: 1 },
                  { year: "2021", rites: 890, cities: 15 },
                  { year: "2024", rites: 2150, cities: 35 },
                  { year: "2025", rites: 2840, cities: 38 }
                ].map((data, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-stone-200 hover:shadow-lg transition-all">
                    <div className="text-lg font-black text-amber-700 mb-2">{data.year}</div>
                    <div className="space-y-1 text-sm">
                      <div className="font-bold text-gray-900">{data.rites} Rites</div>
                      <div className="text-gray-600">{data.cities} Cities</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/gallery/image3.png" 
                  alt="Our growth across cities" 
                  className="w-full h-full object-cover"
                  width={500}
                  height={375}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-100 rounded-full opacity-20"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              Voices of Impact
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-lg transition-all duration-500 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image 
                      src={`/gallery/image${(index % 3) + 4}.png`} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                
                <div className="text-amber-700 text-2xl mb-3">&quot;</div>
                <p className="text-gray-700 italic leading-relaxed text-sm">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-amber-800">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                Be Part of Our Impact
              </h2>
              <p className="text-lg mb-6 text-white/90">
                Every contribution, every volunteer hour, every shared story amplifies our impact in serving humanity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/volunteer" 
                  className="bg-amber-100 hover:bg-white text-amber-800 px-6 py-3 rounded-lg font-black uppercase tracking-widest transition-all text-center"
                >
                  Join Our Mission
                </a>
                <a 
                  href="/donate" 
                  className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-6 py-3 rounded-lg font-black uppercase tracking-widest transition-all text-center"
                >
                  Support Our Work
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/gallery/image1.png" 
                  alt="Join our mission" 
                  className="w-full h-full object-cover"
                  width={500}
                  height={375}
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}