import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Layers,
  Sparkles,
} from 'lucide-react';
import Hero3DCanvas, { type CameraPreset, type CoreMode } from './Hero3DCanvas';

export default function HeroSection() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');
  const [coreMode, setCoreMode] = useState<CoreMode>('overdrive');
  const [exploded, setExploded] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [corePulses, setCorePulses] = useState(0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-[#050507] pt-20 pb-44 sm:pt-24 sm:pb-32 lg:h-screen lg:min-h-[700px] lg:max-h-[960px]"
    >
      {/* Isolated WebGL Canvas Layer */}
      <Hero3DCanvas
        cameraPreset={cameraPreset}
        coreMode={coreMode}
        explodedFactor={exploded ? 1 : 0}
        onCoreClick={() => setCorePulses((c) => c + 1)}
      />

      {/* Matte-black contrast scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050507]/75 via-[#050507]/45 to-[#050507]/95 lg:bg-gradient-to-r lg:from-[#050507]/92 lg:via-[#050507]/58 lg:to-transparent lg:w-[64%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050507] to-transparent"
      />

      {/* Semantic Foreground Content */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="pointer-events-auto max-w-xl"
        >
          <p className="text-xs font-medium tracking-wide text-[#C084FC] sm:text-sm">
            Web &amp; 3D Developer &middot; Free Fire Gamer &middot; Interactive Systems
          </p>

          <h1
            className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            <span className="neon-name-glow inline-block bg-gradient-to-r from-[#EDE9FE] via-[#C084FC] to-[#7C3AED] bg-clip-text text-transparent">
              Karthik Babu
            </span>
          </h1>

          <p className="mt-2 font-display text-xl font-semibold tracking-tight text-[#EDE9FE] sm:text-2xl">
            Crafting 3D web experiences &amp; tactical gameplay.
          </p>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#C4B5FD]/80 sm:text-base">
            Building smooth Three.js interfaces, modern full-stack web apps, and leading squad
            rotations in Free Fire as{' '}
            <span className="font-mono text-sm font-medium text-[#C084FC]">KB・SHADOW</span>.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('projects')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#9333EA] px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 shadow-[0_0_22px_rgba(124,58,237,0.4)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_32px_rgba(168,85,247,0.75)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('freefire')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#8B5CF6]/35 bg-[#09080F]/92 px-5 py-2.5 text-sm font-semibold text-[#EDE9FE] whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#C084FC] hover:text-white hover:shadow-[0_0_24px_rgba(168,85,247,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]"
            >
              <Crosshair className="h-4 w-4 text-[#C084FC]" />
              Free Fire Profile
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-[#C4B5FD]/85 whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-[#7C3AED]/15 hover:text-white hover:shadow-[0_0_18px_rgba(139,92,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]"
            >
              About Me
              <ArrowDown className="h-3.5 w-3.5 text-[#A855F7]" />
            </button>
          </div>

          <p className="mt-5 text-xs text-[#9E94B8]">
            Drag to orbit the violet crystal &middot; Scroll to zoom &middot; Click the core
            {corePulses > 0 ? ` (${corePulses} burst${corePulses > 1 ? 's' : ''})` : ''}
          </p>
        </motion.div>
      </div>

      {/* Collapsible Bottom Control Dock (Zero backdrop-filter over WebGL) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex flex-col items-center px-3 sm:bottom-4">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="pointer-events-auto mb-2 inline-flex min-h-[34px] items-center gap-1.5 rounded-md border border-[#8B5CF6]/30 bg-[#09080F]/95 px-3 py-1 text-xs font-medium text-[#DDD6FE] transition-all duration-200 hover:border-[#C084FC] hover:text-white hover:shadow-[0_0_16px_rgba(168,85,247,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 text-[#C084FC]" />
              Show 3D Controls
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 text-[#C084FC]" />
              Hide 3D Controls
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="pointer-events-auto flex w-full max-w-[840px] flex-wrap items-center justify-center gap-2.5 rounded-xl border border-[#8B5CF6]/25 bg-[#09080F]/95 px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] sm:justify-between sm:px-4">
            {/* Camera View Selector */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="mr-1 hidden text-xs font-medium text-[#9E94B8] md:inline">
                Camera
              </span>
              {(
                [
                  { id: 'orbit', label: 'Hero Orbit' },
                  { id: 'closeup', label: 'Crystal Zoom' },
                  { id: 'overview', label: 'Arena Top' },
                ] as const
              ).map((cam) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => setCameraPreset(cam.id)}
                  className={`min-h-[34px] rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 sm:px-3 ${
                    cameraPreset === cam.id
                      ? 'bg-[#7C3AED] text-white shadow-[0_0_14px_rgba(124,58,237,0.55)]'
                      : 'bg-white/5 text-[#C4B5FD]/80 hover:bg-[#7C3AED]/20 hover:text-white hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>

            {/* Lighting Mode Selector */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="mr-1 hidden text-xs font-medium text-[#9E94B8] md:inline">
                Lighting
              </span>
              {(
                [
                  { id: 'overdrive', label: 'Overdrive' },
                  { id: 'pulse', label: 'Pulse' },
                  { id: 'stealth', label: 'Stealth' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCoreMode(m.id)}
                  className={`min-h-[34px] rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 sm:px-3 ${
                    coreMode === m.id
                      ? 'bg-[#9333EA] text-white shadow-[0_0_14px_rgba(168,85,247,0.55)]'
                      : 'bg-white/5 text-[#C4B5FD]/80 hover:bg-[#9333EA]/20 hover:text-white hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Exploded View Toggle */}
            <button
              type="button"
              onClick={() => setExploded((e) => !e)}
              className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 ${
                exploded
                  ? 'border-[#C084FC] bg-[#7C3AED]/25 text-[#EDE9FE] shadow-[0_0_16px_rgba(168,85,247,0.45)]'
                  : 'border-[#8B5CF6]/25 bg-white/5 text-[#DDD6FE] hover:border-[#A855F7] hover:text-white hover:shadow-[0_0_14px_rgba(168,85,247,0.35)]'
              }`}
            >
              {exploded ? (
                <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
              ) : (
                <Layers className="h-3.5 w-3.5 text-[#A855F7]" />
              )}
              {exploded ? 'Assemble Core' : 'Explode Core'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
