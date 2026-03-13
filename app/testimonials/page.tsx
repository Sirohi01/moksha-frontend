import { Container } from "@/components/ui/Elements";
import Image from "next/image";
import { Heart, Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Beneficiary Family",
      location: "Delhi",
      rating: 5,
      quote: "When my father passed away and we had no resources for proper rites, Moksha Seva stepped in like angels. They performed every ritual with such care and respect, following all Hindu traditions perfectly. I will be forever grateful.",
      image: "/gallery/image1.png"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Hospital Administrator",
      location: "Mumbai",
      rating: 5,
      quote: "We work closely with Moksha Seva for unclaimed bodies at our hospital. Their professionalism, speed of response, and adherence to legal protocols is exemplary. They treat every case with dignity.",
      image: "/gallery/image2.png"
    },
    {
      name: "Anita Verma",
      role: "Volunteer",
      location: "Varanasi",
      rating: 5,
      quote: "Being a volunteer with Moksha Seva for 3 years has been the most fulfilling experience of my life. Every soul we serve reminds me why this work is so sacred and important.",
      image: "/gallery/image3.png"
    },
    {
      name: "Suresh Patel",
      role: "Corporate Partner",
      location: "Ahmedabad",
      rating: 5,
      quote: "Our company has been supporting Moksha Seva for 2 years. Their transparency in fund utilization and regular impact reports give us complete confidence in their mission.",
      image: "/gallery/image4.png"
    },
    {
      name: "Maya Singh",
      role: "Social Worker",
      location: "Lucknow",
      rating: 5,
      quote: "I&apos;ve referred many families to Moksha Seva during their most difficult times. The compassion and support they provide goes beyond just the final rites - they truly care for the families.",
      image: "/gallery/image5.png"
    },
    {
      name: "Ramesh Gupta",
      role: "Government Official",
      location: "Patna",
      rating: 5,
      quote: "Moksha Seva has been an invaluable partner in our efforts to ensure dignified treatment of unclaimed bodies. Their systematic approach and documentation is commendable.",
      image: "/gallery/image6.png"
    }
  ];

  const stats = [
    { number: "2,840+", label: "Families Served" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "400+", label: "Volunteer Testimonials" },
    { number: "38+", label: "Cities Covered" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-stone-50">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-gray-900">
              <span className="text-amber-700">Testimonials</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed text-gray-700">
              Hear from the families, volunteers, and partners who have experienced our compassionate service
            </p>
          </div>
        </Container>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-stone-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Testimonials Grid */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              Stories of Gratitude
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-xl transition-all duration-500 group">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-700 text-amber-700" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-amber-700 opacity-20 absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic leading-relaxed pl-6">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author Info */}
                <div className="border-t border-stone-100 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <div className="font-black text-gray-900 uppercase tracking-widest text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-xs uppercase tracking-widest">
                        {testimonial.role}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 bg-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              Video Stories
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Watch heartfelt stories from families and volunteers who have experienced our compassionate service firsthand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((video, index) => (
              <div key={index} className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer">
                <Image 
                  src={`/gallery/image${index + 1}.png`} 
                  alt={`Video testimonial ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="font-black text-sm text-gray-900">Family Testimonial {index + 1}</div>
                    <div className="text-xs text-gray-600">2 minutes</div>
                  </div>
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
              Share Your Story
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Have you been touched by our service? We&apos;d love to hear your story and share it with others who might need hope.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-amber-100 hover:bg-white text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                Share Your Story
              </a>
              <a 
                href="/volunteer" 
                className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                Join Our Mission
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}