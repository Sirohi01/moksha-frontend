"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { layoutConfig } from "@/config/layout.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function SocialFloating() {
    const { config, loading, error } = usePageConfig('layout', layoutConfig);
    const activeConfig = config || layoutConfig;
    const socialLinks = activeConfig.socialFloating.socialLinks;
    return (
        <>
            {/* --- Right Side: Social Media Sidebar --- */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
            {/* Gallery Button */}
                <Link
                    href={activeConfig.socialFloating.gallery.href}
                    className="group relative flex items-center justify-center w-11 h-11 bg-[#f4c430] text-white rounded-xl shadow-lg border border-[#f4c430] transition-all duration-300 hover:-translate-x-1.5 hover:bg-[#eab308] hover:shadow-[#f4c430]/20"
                    aria-label={activeConfig.socialFloating.gallery.label}
                >
                    {(() => {
                        const CameraIcon = getIcon("Camera");
                        return <CameraIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />;
                    })()}

                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 px-3 py-1.5 bg-stone-900/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-widest">
                        {activeConfig.socialFloating.gallery.tooltip}
                    </div>
                </Link>

                <div className="h-px bg-stone-200 mx-2" />
                                {socialLinks.map((social) => {
                    const SocialIcon = getIcon(social.icon);
                    return (
                    <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "group relative flex items-center justify-center w-11 h-11 bg-white/80 backdrop-blur-md border border-stone-200 text-stone-600 rounded-xl shadow-sm transition-all duration-300 hover:-translate-x-1.5 hover:text-white",
                            social.color
                        )}
                        aria-label={`Follow us on ${social.name}`}
                    >
                        <SocialIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />

                        {/* Tooltip */}
                        <div className="absolute right-full mr-3 px-3 py-1.5 bg-stone-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-widest">
                            {social.name}
                        </div>
                    </a>
                )})}
            </div>
        </>
    );
}
