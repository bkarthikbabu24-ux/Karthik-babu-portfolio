import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code2, Compass, Cpu, Crosshair } from 'lucide-react';
import { PORTFOLIO_IMAGES } from '../data/portfolioData';

interface AboutCard {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  body: string;
  focusLine: string;
  tone: 'violet' | 'neon';
  icon: typeof Cpu;
}

const ABOUT_CARDS: AboutCard[] = [
  {
    id: 'ai-tech',
    index: '01',
    title: 'Interest in AI & Technology',
    subtitle: 'Exploring intelligent tools & modern computing',
    body: 'I am deeply curious about how artificial intelligence and modern software shape the digital world. I enjoy learning how AI models work, experimenting with smart developer workflows, and following new breakthroughs in interactive computing and 3D graphics.',
    focusLine: 'Artificial Intelligence · Interactive Tech · Automation',
    tone: 'neon',
    icon: Cpu,
  },
  {
    id: 'web-journey',
    index: '02',
    title: 'Web Development Learning Journey',
    subtitle: 'Building step by step from fundamentals to 3D web',
    body: 'My web development journey is driven by hands-on curiosity—starting from core HTML, CSS, and JavaScript fundamentals and progressing into React, TypeScript, Tailwind CSS, and Three.js. Every project is an opportunity to practice cleaner code and smoother user experiences.',
    focusLine: 'React · TypeScript · Tailwind CSS · Three.js',
    tone: 'violet',
    icon: Code2,
  },
  {
    id: 'free-fire',
    index: '03',
    title: 'Interest in Free Fire Gaming',
    subtitle: 'Tactical teamwork, sharp reflexes & strategy',
    body: 'Gaming is where I unwind and sharpen my decision-making under pressure. In Free Fire, I enjoy studying weapon mechanics, sensitivity setups, gloo-wall timing, and smart squad coordination as KB・SHADOW—treating every match as a test of focus and strategy.',
    focusLine: 'Squad Tactics · Aim Discipline · Custom Rooms',
    tone: 'neon',
    icon: Crosshair,
  },
  {
    id: 'future-goals',
    index: '04',
    title: 'My Future Goals',
    subtitle: 'Growing into a skilled creative & full-stack builder',
    body: 'Looking ahead, my goal is to keep mastering full-stack engineering, AI integration, and real-time 3D web graphics. I want to build meaningful digital products, collaborate with creative teams, and bridge the gap between clean software and engaging gaming experiences.',
    focusLine: 'Full-Stack Mastery · AI-Powered Apps · 3D Web',
    tone: 'violet',
    icon: Compass,
  },
];

export default function AboutSection() {
  const [imgError, setImgError] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="about" className="relative border-t border-[#8B5CF6]/15 py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Top Row: Portrait + Introduction Glass Card */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Portrait Frame */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5"
          >
            <div className="group relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-[#8B5CF6]/25 bg-[#0B0912]/80 backdrop-blur-md shadow-[0_14px_42px_rgba(0,0,0,0.6)] transition-all duration-200 hover:border-[#A855F7]/65 hover:shadow-[0_0_32px_rgba(139,92,246,0.22)]">
              {!imgError ? (
                <img
                  src={PORTFOLIO_IMAGES.avatar}
                  alt="Karthik Babu — Aspiring Developer and Free Fire Gamer"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center bg-gradient-to-br from-[#1A0F2E] via-[#0B0912] to-[#050507] p-8 text-center">
                  <Code2 className="h-12 w-12 text-[#A855F7]" />
                  <p className="mt-4 font-display text-xl font-bold text-white">Karthik Babu</p>
                  <p className="mt-1 text-sm text-[#B8AED0]">Developer &amp; Gamer</p>
                </div>
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050507]/95 via-[#050507]/60 to-transparent"
              />
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#EDE9FE]">
                <span className="font-medium text-white">Karthik Babu</span>
                <span className="font-mono text-[#C084FC]">IGN: KB・SHADOW</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Introduction Black Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col justify-between rounded-2xl border border-[#8B5CF6]/25 bg-gradient-to-br from-[#120D20]/85 via-[#0B0912]/82 to-[#07060C]/90 p-6 backdrop-blur-md shadow-[0_14px_42px_rgba(0,0,0,0.55)] sm:p-8 lg:col-span-7"
          >
            <div>
              <p className="text-sm font-medium text-[#C084FC]">About Me &middot; Introduction</p>

              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Hi, I&apos;m{' '}
                <span className="bg-gradient-to-r from-[#DDD6FE] via-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(168,85,247,0.45)]">
                  Karthik Babu
                </span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-[#E2DCF5]">
                I am a passionate technology learner, web developer, and Free Fire gamer based in
                India. I love combining clean visual design with interactive 3D code on the web,
                creating modern digital experiences inspired by futuristic gaming interfaces.
              </p>

              <p className="mt-4 text-base leading-relaxed text-[#B8AED0]">
                Whether I am experimenting with Three.js animations, exploring how AI tools are
                transforming software, or refining my squad strategy in Free Fire, I approach both
                coding and gaming with curiosity, consistency, and attention to detail.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#8B5CF6]/15 pt-6">
              <div className="text-xs text-[#A19BB8]">
                Focus: <span className="text-white">3D Web</span> &middot;{' '}
                <span className="text-white">AI &amp; Tech</span> &middot;{' '}
                <span className="text-[#C084FC]">Free Fire</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('skills')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#A855F7] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 shadow-[0_0_16px_rgba(124,58,237,0.35)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_26px_rgba(168,85,247,0.7)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
                >
                  Explore Skills
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex min-h-[40px] items-center rounded-lg border border-[#8B5CF6]/30 bg-[#07060C]/90 px-4 py-2 text-xs font-semibold text-[#EDE9FE] whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#A855F7] hover:bg-[#6D28D9]/15 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]"
                >
                  Connect With Me
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom 2x2 Black Glassmorphism Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {ABOUT_CARDS.map((card, idx) => {
            const Icon = card.icon;
            const isNeon = card.tone === 'neon';

            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#8B5CF6]/20 bg-[#0B0912]/78 p-6 backdrop-blur-md transition-all duration-200 sm:p-7 ${
                  isNeon
                    ? 'hover:border-[#A855F7]/65 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                    : 'hover:border-[#8B5CF6]/65 hover:shadow-[0_0_30px_rgba(124,58,237,0.22)]'
                }`}
              >
                {/* Subtle violet ambient glow inside black glass card */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300 opacity-35 group-hover:opacity-70 ${
                    isNeon ? 'bg-[#A855F7]/28' : 'bg-[#7C3AED]/28'
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`font-mono text-xs font-medium ${
                          isNeon ? 'text-[#C084FC]' : 'text-[#A78BFA]'
                        }`}
                      >
                        {card.index}. {card.subtitle}
                      </p>
                      <h3 className="mt-1.5 font-display text-xl font-bold text-white sm:text-2xl">
                        {card.title}
                      </h3>
                    </div>

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                        isNeon
                          ? 'border-[#A855F7]/40 bg-[#A855F7]/12 text-[#C084FC]'
                          : 'border-[#7C3AED]/45 bg-[#7C3AED]/15 text-[#A78BFA]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#C4BBE0] sm:text-[15px]">
                    {card.body}
                  </p>
                </div>

                <div className="relative z-10 mt-6 border-t border-[#8B5CF6]/15 pt-4">
                  <p className="font-mono text-xs text-[#A19BB8]">{card.focusLine}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
