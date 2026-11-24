import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Pause, Play, RotateCcw, Target, X } from 'lucide-react';
import { HIGHLIGHT_CLIPS, type HighlightClip } from '../data/portfolioData';

export default function HighlightsSection() {
  const [selectedClip, setSelectedClip] = useState<HighlightClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);

  const openClip = (clip: HighlightClip) => {
    setSelectedClip(clip);
    setCurrentSec(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!selectedClip || !isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentSec((prev) => {
        if (prev >= selectedClip.durationSec) {
          setIsPlaying(false);
          return selectedClip.durationSec;
        }
        return prev + 1;
      });
    }, 350);
    return () => window.clearInterval(timer);
  }, [selectedClip, isPlaying]);

  useEffect(() => {
    if (!selectedClip) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedClip(null);
        setIsPlaying(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedClip]);

  const activeEvents = selectedClip
    ? selectedClip.events.filter((ev) => ev.timeSec <= currentSec)
    : [];

  return (
    <section id="highlights" className="relative border-t border-[#8B5CF6]/15 py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#C084FC]">Gaming Highlights</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Tactical plays &amp; replay breakdowns
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A19BB8]">
            Select any highlight card to open the interactive timeline player and inspect key
            movement and weapon transitions.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHT_CLIPS.map((clip, idx) => (
            <motion.article
              key={clip.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#8B5CF6]/20 bg-[#0B0912]/80 backdrop-blur-md transition-all duration-200 hover:border-[#A855F7]/65 hover:shadow-[0_0_30px_rgba(168,85,247,0.22)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#07060C]">
                <img
                  src={clip.image}
                  alt={clip.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0912] via-[#0B0912]/30 to-transparent"
                />

                <button
                  type="button"
                  onClick={() => openClip(clip)}
                  aria-label={`Play tactical breakdown for ${clip.title}`}
                  className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#8B5CF6]/50 bg-[#050507]/85 text-white transition-all duration-200 group-hover:scale-110 group-hover:border-[#C084FC] group-hover:bg-[#7C3AED]/85 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.75)]">
                    <Play className="ml-0.5 h-5 w-5" />
                  </span>
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <p className="text-xs text-[#A19BB8]">
                    {clip.map} &middot; {clip.mode}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {clip.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#C4BBE0]">
                    {clip.summary}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#8B5CF6]/15 pt-4 text-xs">
                  <span className="font-mono text-[#D8D0EE]">
                    {clip.tags.join(' · ')}
                  </span>

                  <button
                    type="button"
                    onClick={() => openClip(clip)}
                    className="min-h-[36px] rounded-md px-2 py-1 font-semibold text-[#C084FC] transition-all duration-200 hover:bg-[#7C3AED]/20 hover:text-white hover:shadow-[0_0_16px_rgba(168,85,247,0.45)] whitespace-nowrap shrink-0"
                  >
                    Inspect Replay
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Interactive Tactical Replay Modal */}
      {selectedClip && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="highlight-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => {
            setSelectedClip(null);
            setIsPlaying(false);
          }}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#8B5CF6]/35 bg-[#0B0912] p-5 shadow-[0_0_50px_rgba(124,58,237,0.28)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedClip(null);
                setIsPlaying(false);
              }}
              aria-label="Close highlight replay"
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B5CF6]/30 bg-[#07060C] text-[#D8D0EE] transition-all duration-200 hover:border-[#A855F7] hover:bg-[#7C3AED]/20 hover:text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.45)] sm:top-5 sm:right-5"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs font-medium text-[#C084FC]">
              Tactical Replay Breakdown &middot; {selectedClip.map} &middot; {selectedClip.mode}
            </p>
            <h3
              id="highlight-modal-title"
              className="mt-1.5 pr-12 font-display text-xl font-bold text-white sm:text-2xl"
            >
              {selectedClip.title}
            </h3>

            {/* Interactive Simulated Combat Feed Stage */}
            <div className="relative mt-5 overflow-hidden rounded-xl border border-[#8B5CF6]/20 bg-[#050507]">
              <div className="relative aspect-[16/9]">
                <img
                  src={selectedClip.image}
                  alt={selectedClip.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-55"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/35 to-transparent"
                />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white sm:top-4 sm:left-4 sm:right-4">
                  <span className="rounded-md border border-[#8B5CF6]/30 bg-[#050507]/88 px-2.5 py-1 tabular-nums">
                    00:{String(currentSec).padStart(2, '0')} / 00:
                    {String(selectedClip.durationSec).padStart(2, '0')}
                  </span>
                  <span className="rounded-md border border-[#8B5CF6]/30 bg-[#050507]/88 px-2.5 py-1 text-[#C084FC] tabular-nums">
                    {activeEvents.length} / {selectedClip.events.length} Phases
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 space-y-2 sm:bottom-4 sm:left-4 sm:right-4">
                  {activeEvents.length === 0 ? (
                    <div className="rounded-lg border border-[#8B5CF6]/20 bg-[#050507]/88 px-4 py-2.5 text-xs text-[#A19BB8]">
                      Press Play or scrub the timeline to step through each tactical phase.
                    </div>
                  ) : (
                    activeEvents.slice(-2).map((ev) => (
                      <div
                        key={`${ev.timeSec}-${ev.label}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-[#A855F7]/45 bg-[#0B0912]/95 px-3.5 py-2 sm:px-4 sm:py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <Target className="h-4 w-4 shrink-0 text-[#C084FC]" />
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {ev.label} &middot;{' '}
                              <span className="text-[#C084FC]">{ev.weapon}</span>
                            </p>
                            <p className="hidden text-xs text-[#A19BB8] sm:block">{ev.detail}</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-[#DDD6FE] tabular-nums shrink-0">
                          {ev.timeSec}s
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[#8B5CF6]/15 bg-[#07060C] px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSec >= selectedClip.durationSec) setCurrentSec(0);
                    setIsPlaying((p) => !p);
                  }}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#6D28D9] to-[#A855F7] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(168,85,247,0.65)]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Play
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentSec(0);
                    setIsPlaying(true);
                  }}
                  aria-label="Restart replay"
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#8B5CF6]/25 bg-[#0B0912] px-3 py-1.5 text-xs text-[#D8D0EE] transition-all duration-200 hover:border-[#A855F7] hover:text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.4)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restart
                </button>

                <input
                  type="range"
                  min={0}
                  max={selectedClip.durationSec}
                  value={currentSec}
                  aria-label="Scrub replay timeline"
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentSec(Number(e.target.value));
                  }}
                  className="h-2 min-w-[120px] flex-1 cursor-pointer accent-[#A855F7]"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {selectedClip.events.map((ev) => {
                const reached = currentSec >= ev.timeSec;
                return (
                  <button
                    key={ev.timeSec}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentSec(ev.timeSec);
                    }}
                    className={`rounded-xl border p-3.5 text-left transition-all duration-200 ${
                      reached
                        ? 'border-[#A855F7]/60 bg-[#130D24] shadow-[0_0_18px_rgba(168,85,247,0.18)]'
                        : 'border-[#8B5CF6]/18 bg-[#07060C] hover:border-[#A855F7]/45'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{ev.label}</span>
                      <span className="font-mono text-[#C084FC] tabular-nums">
                        {ev.timeSec}s
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#A19BB8]">
                      {ev.weapon} &middot; {ev.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
