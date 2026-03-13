"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Info, Heart, ShieldCheck, Users, Mail, Flame, ChevronDown, BarChart3, Bookmark, FileText, Map, Globe, Video, Megaphone, Target, Anchor, Tent, BookOpen, TrendingUp, Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Image from "next/image";
import SearchModal from "@/components/ui/SearchModal";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  {
    label: "About",
    icon: Info,
    subLinks: [
      { href: "/about", label: "About Us", icon: Info },
      { href: "/how-it-works", label: "How It Works", icon: FileText },
      { href: "/why-moksha-seva", label: "Why Choose Us", icon: Target },
      { href: "/our-reach", label: "Our Reach", icon: Map },
      { href: "/board", label: "Leadership", icon: Users },
    ]
  },
  {
    label: "Services",
    icon: Flame,
    subLinks: [
      { href: "/services", label: "Cremation Services", icon: Flame },
      { href: "/report", label: "Report Unclaimed Body", icon: Megaphone },
    ]
  },
  {
    label: "Campaigns",
    icon: Target,
    subLinks: [
      { href: "/campaigns", label: "All Campaigns", icon: Target },
      { href: "/campaigns/dignity-for-all", label: "Dignity For All", icon: Heart },
      { href: "/campaigns/adopt-a-city", label: "Adopt a City", icon: Globe },
      { href: "/campaigns/sacred-river", label: "Sacred River Initiative", icon: Anchor },
      { href: "/campaigns/home-for-saathis", label: "Saathi Shelter", icon: Tent },
    ]
  },
  {
    label: "Impact",
    icon: TrendingUp,
    subLinks: [
      { href: "/impact", label: "Our Impact", icon: TrendingUp },
      { href: "/stories", label: "Stories of Change", icon: Video },
      { href: "/remembrance", label: "Wall of Remembrance", icon: Bookmark },
      { href: "/testimonials", label: "Testimonials", icon: Heart },
      { href: "/gallery", label: "Gallery", icon: Video },
      { href: "/feedback", label: "Share Feedback", icon: MessageSquare },
    ]
  },
  {
    label: "Get Involved",
    icon: Users,
    subLinks: [
      { href: "/volunteer", label: "Volunteer", icon: Users },
      { href: "/corporate", label: "Corporate Partnerships", icon: Globe },
      { href: "/legacy-giving", label: "Legacy Giving", icon: Heart },
      { href: "/tribute", label: "In Memory Of", icon: Heart },
    ]
  },
  {
    label: "Trust",
    icon: ShieldCheck,
    subLinks: [
      { href: "/transparency", label: "Transparency Dashboard", icon: BarChart3 },
      { href: "/schemes", label: "Government Schemes", icon: BookOpen },
    ]
  },
  {
    label: "Contact",
    icon: Mail,
    subLinks: [
      { href: "/contact", label: "Contact Us", icon: Mail },
      { href: "/press", label: "Press Room", icon: Megaphone },
      { href: "/documentaries", label: "Documentaries", icon: Video },
    ]
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Close all dropdowns when pathname changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-stone-200/50 shadow-sm">
        <div className="max-w-full mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Left */}
            <Link href="/" className="flex items-center gap-4 group shrink-0 relative z-50">
              <div className="relative w-24 h-24 overflow-hidden rounded-full bg-white border-2 border-gray-200 group-hover:border-gray-300 transition-all duration-300 group-hover:scale-105 shadow-lg transform translate-y-6">
                <Image
                  src="/logo.png"
                  alt="Moksha Seva Logo"
                  fill
                  className="object-contain p-4 relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-sans text-xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[#f4c430] via-[#20b2aa] to-[#f4c430] bg-clip-text text-transparent group-hover:from-[#eab308] group-hover:via-[#1a9d94] group-hover:to-[#eab308] transition-all duration-300 group-hover:scale-[1.02] inline-block">
                  Moksha Seva
                </span>
                <span className="text-[11px] text-stone-500 font-normal leading-none uppercase tracking-wider block group-hover:text-stone-600 transition-colors duration-300">
                  Liberation Through Service
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden xl:flex items-center gap-0" aria-label="Main navigation">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3 py-3 text-sm font-medium transition-all flex items-center gap-2 hover:bg-stone-50/80 rounded-lg whitespace-nowrap",
                        pathname === link.href
                          ? "text-[#f4c430]"
                          : "text-stone-700 hover:text-[#f4c430]"
                      )}
                    >
                      <link.icon className={cn("w-4 h-4", pathname === link.href ? "text-[#f4c430]" : "text-stone-400")} />
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "px-3 py-3 text-sm font-medium transition-all flex items-center gap-2 hover:bg-stone-50/80 rounded-lg whitespace-nowrap",
                        link.subLinks?.some(sub => sub.href === pathname)
                          ? "text-[#f4c430]"
                          : "text-stone-700 group-hover:text-[#f4c430]"
                      )}
                    >
                      <link.icon className={cn("w-4 h-4", link.subLinks?.some(sub => sub.href === pathname) ? "text-[#f4c430]" : "text-stone-400")} />
                      {link.label}
                      <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {link.subLinks && (
                    <div className="absolute top-full left-0 pt-1 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                      <div className="bg-white border border-stone-200/60 shadow-xl rounded-xl p-1 min-w-[220px] backdrop-blur-sm">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                              pathname === sub.href
                                ? "bg-[#f4c430]/10 text-[#f4c430]"
                                : "text-stone-600 hover:bg-stone-50 hover:text-[#f4c430]"
                            )}
                          >
                            <sub.icon className="w-4 h-4 opacity-60" />
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Compact Navigation for medium screens (lg to xl) */}
            <nav className="hidden lg:flex xl:hidden items-center gap-0" aria-label="Compact navigation">
              {navLinks.slice(0, 5).map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.href ? (
                    <Link
                      href={link.href}
                      className={cn(
                        "px-2 py-3 text-xs font-medium transition-all flex items-center gap-1.5 hover:bg-stone-50/80 rounded-lg",
                        pathname === link.href
                          ? "text-[#f4c430]"
                          : "text-stone-700 hover:text-[#f4c430]"
                      )}
                    >
                      <link.icon className={cn("w-3.5 h-3.5", pathname === link.href ? "text-[#f4c430]" : "text-stone-400")} />
                      <span className="hidden lg:block">{link.label}</span>
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "px-2 py-3 text-xs font-medium transition-all flex items-center gap-1.5 hover:bg-stone-50/80 rounded-lg",
                        link.subLinks?.some(sub => sub.href === pathname)
                          ? "text-[#f4c430]"
                          : "text-stone-700 group-hover:text-[#f4c430]"
                      )}
                    >
                      <link.icon className={cn("w-3.5 h-3.5", link.subLinks?.some(sub => sub.href === pathname) ? "text-[#f4c430]" : "text-stone-400")} />
                      <span className="hidden lg:block">{link.label}</span>
                      <ChevronDown className="w-2.5 h-2.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                  )}

                  {/* Compact Dropdown */}
                  {link.subLinks && (
                    <div className="absolute top-full left-0 pt-1 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                      <div className="bg-white border border-stone-200/60 shadow-xl rounded-xl p-1 min-w-[200px] backdrop-blur-sm">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-xs",
                              pathname === sub.href
                                ? "bg-[#f4c430]/10 text-[#f4c430]"
                                : "text-stone-600 hover:bg-stone-50 hover:text-[#f4c430]"
                            )}
                          >
                            <sub.icon className="w-3.5 h-3.5 opacity-60" />
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* More menu for remaining items */}
              <div 
                className="relative group"
                onMouseEnter={() => setOpenDropdown('more')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="px-2 py-3 text-xs font-medium text-stone-700 hover:text-[#f4c430] transition-all flex items-center gap-1.5 hover:bg-stone-50/80 rounded-lg">
                  <Menu className="w-3.5 h-3.5" />
                  <span>More</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                <div className={cn(
                  "absolute top-full right-0 pt-1 transition-all duration-200",
                  openDropdown === 'more' 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-1 pointer-events-none"
                )}>
                  <div className="bg-white border border-stone-200/60 shadow-xl rounded-xl p-1 min-w-[200px] backdrop-blur-sm">
                    {navLinks.slice(5).map((link) => (
                      <div key={link.label}>
                        {link.href ? (
                          <Link
                            href={link.href}
                            onClick={() => setOpenDropdown(null)}
                            className={cn(
                              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-xs",
                              pathname === link.href
                                ? "bg-[#f4c430]/10 text-[#f4c430]"
                                : "text-stone-600 hover:bg-stone-50 hover:text-[#f4c430]"
                            )}
                          >
                            <link.icon className="w-3.5 h-3.5 opacity-60" />
                            <span>{link.label}</span>
                          </Link>
                        ) : (
                          <div className="px-2.5 py-1">
                            <div className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">{link.label}</div>
                            {link.subLinks?.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setOpenDropdown(null)}
                                className={cn(
                                  "flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all text-xs ml-2",
                                  pathname === sub.href
                                    ? "bg-[#f4c430]/10 text-[#f4c430]"
                                    : "text-stone-500 hover:bg-stone-50 hover:text-[#f4c430]"
                                )}
                              >
                                <sub.icon className="w-3 h-3 opacity-60" />
                                <span>{sub.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Actions - Right */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Donate Button */}
              <Link href="/donate">
                <Button size="sm" className="px-4 lg:px-6 py-2 text-sm font-normal bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400 transition-all duration-200 rounded-md">
                  Donate
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5 text-[#f4c430]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200/50 bg-white/95 backdrop-blur-md shadow-lg mt-1">
            <nav className="px-6 py-4 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-stone-100/50 last:border-none pb-3 last:pb-0">
                  {link.href ? (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all",
                        pathname === link.href ? "text-[#f4c430] bg-[#f4c430]/5" : "text-stone-700"
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all",
                          link.subLinks?.some(sub => sub.href === pathname) ? "text-[#f4c430]" : "text-stone-700"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </div>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", openDropdown === link.label && "rotate-180")} />
                      </button>
                      {openDropdown === link.label && (
                        <div className="mt-2 ml-7 space-y-1">
                          {link.subLinks?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                                pathname === sub.href ? "text-[#f4c430] bg-[#f4c430]/5" : "text-stone-500 hover:text-stone-700"
                              )}
                            >
                              <sub.icon className="w-4 h-4" />
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Search */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-3 text-stone-700 hover:text-[#f4c430] hover:bg-stone-50 rounded-lg text-sm font-medium transition-colors"
              >
                <Search className="w-4 h-4" />
                Search
                <span className="ml-auto text-xs text-stone-500">
                  Ctrl+K
                </span>
              </button>
              
              {/* Mobile CTA */}
              <div className="pt-4 mt-4 border-t border-stone-200/50">
                <Link href="/donate" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full py-3 text-sm font-normal bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400 rounded-md">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

