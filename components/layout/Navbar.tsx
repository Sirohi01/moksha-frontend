"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { cn, getSafeSrc } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Image from "next/image";
import SearchModal from "@/components/ui/SearchModal";
import { layoutConfig } from "@/config/layout.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";

export default function Navbar() {
  const { config, loading, error } = usePageConfig('layout', layoutConfig);
  const activeConfig = config || layoutConfig;
  const navLinks = activeConfig.navbar.navigation;
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
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Left */}
            <Link href="/" className="flex items-center gap-2 lg:gap-3 group shrink-0 relative z-50">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 overflow-hidden rounded-full bg-white border-2 border-gray-200 group-hover:border-gray-300 transition-all duration-300 group-hover:scale-105 shadow-md z-[1050]">
                <Image
                  src={getSafeSrc(activeConfig.navbar.logo.src)}
                  alt={activeConfig.navbar.logo.alt}
                  fill
                  className="object-contain p-1 relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-sans text-base lg:text-lg font-bold leading-tight tracking-tight bg-gradient-to-r from-[#b45309] via-[#20b2aa] to-[#b45309] bg-clip-text text-transparent group-hover:from-[#92400e] group-hover:via-[#1a9d94] group-hover:to-[#92400e] transition-all duration-300 inline-block">
                  {activeConfig.navbar.logo.title}
                </span>
                <span className="text-[10px] text-stone-500 font-normal leading-none uppercase tracking-wider block group-hover:text-stone-600 transition-colors duration-300">
                  {activeConfig.navbar.logo.subtitle}
                </span>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center min-w-0" aria-label="Main navigation">
              {navLinks.map((link) => {
                const LinkIcon = getIcon(link.icon);
                return (
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
                          "px-2 xl:px-3 py-3 text-[13px] xl:text-sm font-medium transition-all flex items-center gap-1 xl:gap-1.5 hover:bg-amber-50/50 rounded-lg whitespace-nowrap group/item",
                          pathname === link.href
                            ? "text-[#b45309]"
                            : "text-stone-600 hover:text-[#b45309]"
                        )}
                      >
                        <LinkIcon
                          className={cn("w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-all duration-300",
                            pathname === link.href ? "text-[#b45309]" : "text-stone-400 group-hover/item:text-[#b45309]"
                          )}
                          strokeWidth={2.2}
                        />
                        <span>{link.label}</span>
                      </Link>
                    ) : (
                      <button
                        className={cn(
                          "px-2 xl:px-3 py-3 text-[13px] xl:text-sm font-medium transition-all flex items-center gap-1 xl:gap-1.5 hover:bg-amber-50/50 rounded-lg whitespace-nowrap group/item",
                          link.subLinks?.some(sub => sub.href === pathname)
                            ? "text-[#b45309]"
                            : "text-stone-600 group-hover:text-[#b45309]"
                        )}
                      >
                        <LinkIcon
                          className={cn("w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-all duration-300",
                            link.subLinks?.some(sub => sub.href === pathname) ? "text-[#b45309]" : "text-stone-400 group-hover/item:text-[#b45309]"
                          )}
                          strokeWidth={2.2}
                        />
                        <span>{link.label}</span>
                        <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                      </button>
                    )}

                    {/* Dropdown Menu */}
                    {link.subLinks && (
                      <div className="absolute top-full left-0 pt-1 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                        <div className="bg-white border border-stone-200/60 shadow-xl rounded-xl p-1 min-w-[200px] backdrop-blur-sm">
                          {link.subLinks.map((sub) => {
                            const SubIcon = getIcon(sub.icon);
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group/subitem",
                                  pathname === sub.href
                                    ? "bg-amber-50 text-[#b45309]"
                                    : "text-stone-600 hover:bg-amber-50/80 hover:text-[#b45309]"
                                )}
                              >
                                <SubIcon className="w-4 h-4 opacity-70 group-hover/subitem:scale-110 transition-transform" strokeWidth={2.2} />
                                <span>{sub.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Actions - Right */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-100 shrink-0"
                aria-label={activeConfig.navbar.actions.search.label}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Donate Button */}
              <Link href="/donate" className="shrink-0">
                <Button size="sm" className="px-3 xl:px-5 py-1.5 text-[13px] xl:text-sm font-normal bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400 transition-all duration-200 rounded-md whitespace-nowrap">
                  {activeConfig.navbar.actions.donate.label}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-amber-50 transition-colors"
              aria-label={mobileOpen ? activeConfig.navbar.mobile.closeLabel : activeConfig.navbar.mobile.openLabel}
            >
              {mobileOpen ? <X className="w-5 h-5 text-[#b45309]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200/50 bg-white/95 backdrop-blur-md shadow-lg mt-1">
            <nav className="px-6 py-4 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const LinkIcon = getIcon(link.icon);
                return (
                  <div key={link.label} className="border-b border-stone-100/50 last:border-none pb-3 last:pb-0">
                    {link.href ? (
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-lg transition-all",
                          pathname === link.href ? "text-[#b45309] bg-amber-50" : "text-stone-700"
                        )}
                      >
                        <LinkIcon className="w-5 h-5" strokeWidth={2.2} />
                        {link.label}
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-4 text-base font-medium rounded-lg transition-all",
                            link.subLinks?.some(sub => sub.href === pathname) ? "text-[#b45309]" : "text-stone-700"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <LinkIcon className="w-5 h-5" strokeWidth={2.2} />
                            {link.label}
                          </div>
                          <ChevronDown className={cn("w-5 h-5 transition-transform", openDropdown === link.label && "rotate-180")} />
                        </button>
                        {openDropdown === link.label && (
                          <div className="mt-2 ml-7 space-y-1">
                            {link.subLinks?.map((sub) => {
                              const SubIcon = getIcon(sub.icon);
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex items-center gap-4 px-4 py-3 text-[0.95rem] rounded-lg transition-all",
                                    pathname === sub.href ? "text-[#b45309] bg-amber-50" : "text-stone-500 hover:text-stone-700"
                                  )}
                                >
                                  <SubIcon className="w-4.5 h-4.5" strokeWidth={2} />
                                  {sub.label}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Mobile Search */}
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-4 w-full px-4 py-4 text-stone-700 hover:text-[#f4c430] hover:bg-stone-50 rounded-lg text-base font-medium transition-colors"
              >
                <Search className="w-5 h-5" />
                {activeConfig.navbar.actions.search.label}
                <span className="ml-auto text-xs text-stone-500">
                  {activeConfig.navbar.actions.search.shortcut}
                </span>
              </button>

              {/* Mobile CTA */}
              <div className="pt-4 mt-4 border-t border-stone-200/50">
                <Link href="/donate" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full py-3 text-sm font-normal bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400 rounded-md">
                    {activeConfig.navbar.actions.donate.mobileLabel}
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