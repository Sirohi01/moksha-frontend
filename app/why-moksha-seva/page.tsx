import { Container } from "@/components/ui/Elements";
import Image from 'next/image';
import { whyMokshaSevaConfig } from "@/config/why-moksha-seva.config";
import { getIcon } from "@/config/icons.config";

export default function WhyMokshaSeva() {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-stone-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-gray-900">
                {whyMokshaSevaConfig.hero.title} <span className="text-amber-700">{whyMokshaSevaConfig.hero.titleHighlight}</span>
              </h1>
              <p className="text-xl md:text-2xl font-medium max-w-3xl leading-relaxed text-gray-700 mb-8">
                {whyMokshaSevaConfig.hero.description}
              </p>
              <div className="flex items-center gap-8">
                {whyMokshaSevaConfig.hero.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-black text-amber-700">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src={whyMokshaSevaConfig.hero.image} 
                  alt={whyMokshaSevaConfig.hero.imageAlt} 
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
            {whyMokshaSevaConfig.reasons.map((reason, index) => {
              const ReasonIcon = getIcon(reason.icon);
              return (
                <div key={index} className="bg-white p-8 rounded-2xl border border-stone-100 hover:shadow-xl transition-all duration-500 group">
                  <div className={`w-16 h-16 rounded-xl bg-stone-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${reason.color}`}>
                    <ReasonIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4 text-stone-900">
                    {reason.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-stone-100">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900 mb-4">
              {whyMokshaSevaConfig.impact.title}
            </h2>
            <div className="w-20 h-1 bg-amber-700 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {whyMokshaSevaConfig.impact.stats.map((stat, index) => (
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
              {whyMokshaSevaConfig.callToAction.title}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {whyMokshaSevaConfig.callToAction.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={whyMokshaSevaConfig.callToAction.buttons.volunteer.href} 
                className="bg-amber-100 hover:bg-white text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                {whyMokshaSevaConfig.callToAction.buttons.volunteer.text}
              </a>
              <a 
                href={whyMokshaSevaConfig.callToAction.buttons.donate.href} 
                className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg font-black uppercase tracking-widest transition-all"
              >
                {whyMokshaSevaConfig.callToAction.buttons.donate.text}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}