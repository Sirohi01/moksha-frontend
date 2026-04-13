import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ArrowUpRight, Send } from "lucide-react";
import { Container } from "@/components/ui/Elements";
import { layoutConfig } from "@/config/layout.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { intelligenceAPI, newsletterAPI } from "@/lib/api";
import { getSafeSrc } from "@/lib/utils";

export default function Footer() {
  const { config } = usePageConfig('layout', layoutConfig);
  const activeConfig = config || layoutConfig;
  const footerLinks = activeConfig.footer.links;

  const handleTrack = (platform: string) => {
    intelligenceAPI.trackInteraction(platform, window.location.pathname).catch(() => {});
  };

  return (
    <footer className="bg-gray-800 text-white border-t border-white/5">
      {/* 24/7 Response Bar - Tightened */}
      <div className="bg-red-600/5 border-b border-white/5 py-3 relative group">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
              <p className="text-white font-black text-[9px] uppercase tracking-[0.3em] leading-none">{activeConfig.footer.emergency.status}</p>
            </div>
            <Link 
              href={activeConfig.footer.emergency.reportLink.href} 
              onClick={() => handleTrack('report')}
              className="text-white font-black text-[11px] uppercase tracking-widest hover:text-red-400 transition-all flex items-center gap-2 py-2 px-3 min-h-[44px]"
            >
              {activeConfig.footer.emergency.reportLink.text} <ArrowUpRight size={12} />
            </Link>
          </div>
        </Container>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 pb-10">
        {/* Main Grid - Reduced gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 lg:items-start text-left">
          {/* Brand Column - More compact */}
          <div className="lg:col-span-2 lg:pr-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={getSafeSrc(activeConfig.footer.brand.logo.src)}
                    alt={activeConfig.footer.brand.logo.alt}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-white leading-none block tracking-tight italic">{activeConfig.footer.brand.title}</span>
                  <span className="text-[9px] text-[#7ab800] font-black uppercase tracking-[0.4em] block leading-none mt-1">{activeConfig.footer.brand.subtitle}</span>
                </div>
              </div>
            </div>
            <p className="text-white text-sm leading-relaxed mb-8 font-medium max-w-xs">
              {activeConfig.footer.brand.description}
            </p>
            <div className="space-y-4">
              <a 
                href={activeConfig.footer.contact.phone.number} 
                onClick={() => handleTrack('call')}
                className="flex items-center gap-4 text-white hover:text-[#7ab800] transition-all group/call"
              >
                <Phone size={14} className="text-[#7ab800]" />
                <span className="text-xs font-black tracking-[0.2em] font-mono">{activeConfig.footer.contact.phone.display}</span>
              </a>
              <a 
                href={activeConfig.footer.contact.email.address} 
                onClick={() => handleTrack('support')}
                className="flex items-center gap-4 text-white hover:text-[#7ab800] transition-all group/mail"
              >
                <Mail size={14} className="text-[#7ab800]" />
                <span className="text-xs font-black tracking-[0.2em] lowercase font-mono">{activeConfig.footer.contact.email.display}</span>
              </a>
            </div>
          </div>

          {/* Links Columns - Spacing fixed */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.25em] mb-8 relative">
                {category}
                <span className="absolute -bottom-2.5 left-0 w-3 h-[1.5px] bg-[#7ab800]/60" />
              </h3>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white hover:text-[#7ab800] text-sm font-semibold transition-all hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Dispatch Portal: Ultra-Compact Footer Integration */}
        <div className="mt-6 py-4 border-t border-white/5 relative overflow-hidden group/news">
          <div className="absolute inset-0 bg-[#7ab800]/5 opacity-0 group-hover/news:opacity-100 transition-opacity duration-1000"></div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex-1 space-y-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="w-2 h-2 bg-[#7ab800] rounded-full shadow-[0_0_15px_rgba(122,184,0,0.6)] animate-pulse"></div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em]">The Sacred Digest</h3>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none italic">
                Deploys weekly to <span className="text-[#7ab800]">your inbox.</span>
              </h3>
              <p className="text-white/70 text-[12px] font-medium leading-relaxed max-w-xl mx-auto lg:ml-0">
                Join a global network of souls dedicated to the restoration of dignity. Mission reports, breakthroughs, and stories of service.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  const btn = form.querySelector('button');
                  const span = btn?.querySelector('span');
                  if (!email || !btn) return;
                  
                  try {
                    btn.disabled = true;
                    if (span) span.innerText = 'SYNCING...';
                    await newsletterAPI.subscribe(email, 'footer_portal');
                    form.reset();
                    if (span) span.innerText = 'SUBSCRIBED';
                    btn.classList.replace('bg-[#7ab800]', 'bg-teal-600');
                    setTimeout(() => { 
                      if (span) span.innerText = 'SUBSCRIBE'; 
                      btn.disabled = false;
                      btn.classList.replace('bg-teal-600', 'bg-[#7ab800]');
                    }, 5000);
                  } catch (err: any) {
                    if (span) span.innerText = 'FAILED';
                    btn.disabled = false;
                    setTimeout(() => { if (span) span.innerText = 'SUBSCRIBE'; }, 3000);
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 p-2 bg-white/5 rounded-[2.5rem] border border-white/10 focus-within:border-[#7ab800]/40 focus-within:ring-8 focus-within:ring-[#7ab800]/5 transition-all max-w-md mx-auto shadow-3xl"
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder="DEPLOY EMAIL ADDRESS"
                  className="bg-transparent border-none outline-none text-[12px] font-medium tracking-widest text-white px-8 py-4 w-full placeholder:text-white/60 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.3em]"
                  required
                />
                <button 
                  type="submit"
                  className="bg-[#7ab800] text-black px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-[#8cd100] transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-[#7ab800]/20"
                >
                  <span>SUBSCRIBE</span> <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Deep Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7ab800] animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7ab800]">{activeConfig.footer.bottom.missionStatus}</p>
            </div>
            <p className="text-white text-[9px] font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {activeConfig.footer.bottom.copyright}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {activeConfig.footer.bottom.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white hover:text-[#7ab800] text-[9px] font-black uppercase tracking-[0.15em] transition-colors">{link.label}</Link>
            ))}
            <div className="flex items-center gap-6 ml-2">
              {activeConfig.footer.bottom.socialPlatforms.map((platform, i) => {
                const Icon = getIcon(platform);
                const socialLink = activeConfig.socialFloating?.socialLinks?.find(link =>
                  link.name.toLowerCase().includes(platform.toLowerCase())
                );
                const href = socialLink?.url || `https://${platform.toLowerCase()}.com/MokshaSewa`;

                return (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleTrack(platform.toLowerCase())}
                    aria-label={`Visit our ${platform} page`}
                    className="text-white hover:text-[#7ab800] transition-all transform hover:-translate-y-1"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
