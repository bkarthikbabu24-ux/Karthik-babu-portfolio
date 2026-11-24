import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import FreeFireSection from './components/FreeFireSection';
import HighlightsSection from './components/HighlightsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 520);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050507] text-[#F5F3FF]">
      {/* Futuristic Animated Matte Black & Violet Ambient Background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-cyber-grid absolute -inset-12 opacity-65" />
        <div className="bg-aurora-orb absolute -top-32 left-[-10%] h-[440px] w-[440px] rounded-full bg-[#7C3AED]/16 blur-[130px]" />
        <div
          className="bg-aurora-orb absolute top-[40%] right-[-10%] h-[480px] w-[480px] rounded-full bg-[#9333EA]/14 blur-[140px]"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="bg-aurora-orb absolute bottom-[-10%] left-[22%] h-[400px] w-[400px] rounded-full bg-[#6D28D9]/14 blur-[130px]"
          style={{ animationDelay: '-11s' }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <FreeFireSection />
          <HighlightsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed right-4 bottom-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#8B5CF6]/35 bg-[#09080F]/95 text-[#E9D5FF] shadow-[0_0_22px_rgba(139,92,246,0.35)] transition-all duration-200 hover:border-[#C084FC] hover:text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7] sm:right-6 sm:bottom-6"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
