import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Elements";
import { layoutConfig } from "@/config/layout.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function Footer() {
  const { config } = usePageConfig('layout', layoutConfig);
  const activeConfig = config || layoutConfig;
  const footerLinks = activeConfig.footer.links;
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
            <Link href={activeConfig.footer.emergency.reportLink.href} className="text-white font-black text-[9px] uppercase tracking-widest hover:text-red-500 transition-all flex items-center gap-2">
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
                    src={activeConfig.footer.brand.logo.src}
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
              <a href={activeConfig.footer.contact.phone.number} className="flex items-center gap-4 text-white hover:text-[#7ab800] transition-all group/call">
                <Phone size={14} className="text-[#7ab800]" />
                <span className="text-xs font-black tracking-[0.2em] font-mono">{activeConfig.footer.contact.phone.display}</span>
              </a>
              <a href={activeConfig.footer.contact.email.address} className="flex items-center gap-4 text-white hover:text-[#7ab800] transition-all group/mail">
                <Mail size={14} className="text-[#7ab800]" />
                <span className="text-xs font-black tracking-[0.2em] lowercase font-mono">{activeConfig.footer.contact.email.display}</span>
              </a>
            </div>
          </div>

          {/* Links Columns - Spacing fixed */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.25em] mb-8 relative">
                {category}
                <span className="absolute -bottom-2.5 left-0 w-3 h-[1.5px] bg-[#7ab800]/60" />
              </h4>
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

        {/* Deep Bottom Bar - Tightened margin */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
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
