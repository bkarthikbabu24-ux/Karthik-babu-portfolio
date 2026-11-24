import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'freefire', label: 'Free Fire', href: '#freefire' },
  { id: 'highlights', label: 'Highlights', href: '#highlights' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'freefire', 'highlights', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let current = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#8B5CF6]/20 bg-[#050507]/95 shadow-[0_6px_28px_rgba(109,40,217,0.12)]">
      <div className="relative mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/65 to-transparent"
        />

        {/* Zone 1: Single-line Brand Wordmark with Deep Violet & Neon Purple Glow */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="group relative inline-flex items-center font-display text-xl font-bold tracking-wider whitespace-nowrap shrink-0 rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]"
        >
          <span className="bg-gradient-to-r from-[#DDD6FE] via-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.7)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(192,132,252,0.95)]">
            Karthik
          </span>
          <span className="ml-1.5 bg-gradient-to-r from-[#C084FC] via-[#9333EA] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(147,51,234,0.75)] transition-all duration-300 group-hover:drop-shadow-[0_0_22px_rgba(192,132,252,0.98)]">
            Babu
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#6D28D9] via-[#C084FC] to-[#7C3AED] opacity-80 blur-[1px] transition-opacity duration-300 group-hover:opacity-100"
          />
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A19BB8]"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#7C3AED] after:to-[#C084FC] after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7] rounded-sm ${
                  isActive
                    ? 'text-white after:w-full'
                    : 'hover:text-[#EDE9FE] after:w-0 hover:after:w-full'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#9333EA] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 shadow-[0_0_16px_rgba(124,58,237,0.35)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_26px_rgba(168,85,247,0.75)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
          >
            Contact Me
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B5CF6]/30 bg-[#0B0912] text-white transition-colors hover:border-[#A855F7] hover:shadow-[0_0_16px_rgba(168,85,247,0.45)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Black & Violet Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#8B5CF6]/20 bg-[#07060C] px-4 py-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#7C3AED]/20 text-white border border-[#8B5CF6]/30'
                      : 'text-[#C4B5FD]/80 hover:bg-[#7C3AED]/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-4 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.4)]"
            >
              Contact Me
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
