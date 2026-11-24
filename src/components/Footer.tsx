import type { MouseEvent } from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative border-t border-[#8B5CF6]/20 bg-[#050507]/95 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 text-xs text-[#A19BB8] sm:flex-row sm:px-6 lg:px-8">
        <p>
          &copy; {year}{' '}
          <span className="bg-gradient-to-r from-[#DDD6FE] to-[#A855F7] bg-clip-text font-semibold text-transparent">
            Karthik Babu
          </span>
          . All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'projects', label: 'Projects' },
            { id: 'freefire', label: 'Free Fire' },
            { id: 'contact', label: 'Contact' },
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              className="py-1 transition-colors hover:text-[#C084FC]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
