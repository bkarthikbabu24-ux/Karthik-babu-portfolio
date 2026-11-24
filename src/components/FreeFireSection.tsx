import { useState } from 'react';
import { Check, Copy, Crosshair, Gamepad2, Shield } from 'lucide-react';
import {
  FF_PROFILE,
  SENSITIVITY_PRESETS,
  WEAPON_LOADOUT,
} from '../data/portfolioData';

export default function FreeFireSection() {
  const [mode, setMode] = useState<'br' | 'cs'>('br');
  const [presetId, setPresetId] = useState<string>(SENSITIVITY_PRESETS[0].id);
  const [copiedUid, setCopiedUid] = useState(false);

  const activeMode = FF_PROFILE.modes[mode];
  const activePreset =
    SENSITIVITY_PRESETS.find((p) => p.id === presetId) ?? SENSITIVITY_PRESETS[0];

  const handleCopyUid = async () => {
    try {
      await navigator.clipboard.writeText(FF_PROFILE.uid);
    } catch {
      // Visual confirmation fallback
    }
    setCopiedUid(true);
    window.setTimeout(() => setCopiedUid(false), 2000);
  };

  const sensitivityBars = [
    { label: 'General', value: activePreset.general },
    { label: 'Red Dot', value: activePreset.redDot },
    { label: '2x Scope', value: activePreset.scope2x },
    { label: '4x Scope', value: activePreset.scope4x },
    { label: 'Sniper Scope', value: activePreset.sniperScope },
    { label: 'Free Look', value: activePreset.freeLook },
  ];

  return (
    <section
      id="freefire"
      className="relative border-t border-[#8B5CF6]/15 bg-[#07060C]/80 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#C084FC]">Free Fire Gaming Profile</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Player profile &amp; tactical loadout
            </h2>
          </div>

          {/* Mode Switcher */}
          <div
            role="tablist"
            aria-label="Free Fire Game Mode"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#8B5CF6]/20 bg-[#0B0912]/90 p-1.5 backdrop-blur-md"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'br'}
              onClick={() => setMode('br')}
              className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] ${
                mode === 'br'
                  ? 'bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white shadow-[0_0_20px_rgba(147,51,234,0.45)]'
                  : 'text-[#A19BB8] hover:bg-[#7C3AED]/15 hover:text-white hover:shadow-[0_0_16px_rgba(168,85,247,0.35)]'
              }`}
            >
              Battle Royale
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'cs'}
              onClick={() => setMode('cs')}
              className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] ${
                mode === 'cs'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]'
                  : 'text-[#A19BB8] hover:bg-[#7C3AED]/15 hover:text-white hover:shadow-[0_0_16px_rgba(168,85,247,0.35)]'
              }`}
            >
              Clash Squad
            </button>
          </div>
        </div>

        {/* Identity Banner + Tactical Role Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Player Identity Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#8B5CF6]/20 bg-[#0B0912]/80 p-5 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.5)] sm:p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#A19BB8]">
                    {FF_PROFILE.server} &middot; {FF_PROFILE.setup}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {FF_PROFILE.ign}
                  </h3>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#A855F7]/40 bg-[#7C3AED]/20 text-[#C084FC] shadow-[0_0_18px_rgba(168,85,247,0.22)]">
                  <Gamepad2 className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#8B5CF6]/20 bg-[#07060C] px-4 py-3">
                <div>
                  <p className="text-xs text-[#A19BB8]">Player UID</p>
                  <p className="font-mono text-base font-semibold text-[#C084FC] tabular-nums">
                    {FF_PROFILE.uid}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUid}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#8B5CF6]/30 bg-[#0B0912] px-3.5 py-2 text-xs font-medium text-white whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#A855F7] hover:bg-[#7C3AED]/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
                >
                  {copiedUid ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#DDD6FE]" />
                      Copied UID
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy UID
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#8B5CF6]/15 pt-5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#A19BB8]">Squad / Guild</span>
                  <span className="font-medium text-white text-right">{FF_PROFILE.guild}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#A19BB8]">Primary Role</span>
                  <span className="font-medium text-white text-right">{FF_PROFILE.role}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#A19BB8]">Active Mode</span>
                  <span className="font-display font-semibold text-[#C084FC]">
                    {activeMode.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-[#8B5CF6]/30 bg-[#6D28D9]/15 px-4 py-3 text-xs text-[#EDE9FE]">
              <span className="flex items-center gap-2 font-medium text-white">
                <Shield className="h-4 w-4 text-[#C084FC]" />
                Custom Room &amp; Duo Ready
              </span>
              <span className="font-mono text-[#DDD6FE]">{activeMode.label}</span>
            </div>
          </div>

          {/* Mode Tactical Breakdown Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {[
              { label: 'Squad Role', value: activeMode.focusRole, accent: 'text-white' },
              { label: 'Preferred Maps', value: activeMode.preferredMap, accent: 'text-[#C084FC]' },
              { label: 'Drop & Lane Focus', value: activeMode.dropZone, accent: 'text-[#DDD6FE]' },
              { label: 'Primary Weapon Combo', value: activeMode.primaryCombo, accent: 'text-white' },
              { label: 'Utility & Cover Style', value: activeMode.utilityFocus, accent: 'text-[#C084FC]' },
              { label: 'Match Pacing', value: activeMode.paceStyle, accent: 'text-[#A78BFA]' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between rounded-2xl border border-[#8B5CF6]/20 bg-[#0B0912]/78 p-5 backdrop-blur-md transition-all duration-200 hover:border-[#A855F7]/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.16)]"
              >
                <p className="text-xs font-medium text-[#A19BB8]">{item.label}</p>
                <p className={`mt-3 font-display text-xl font-bold tracking-tight ${item.accent}`}>
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-[#7E7698]">{activeMode.label} Setup</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitivity Lab & Weapon Loadout */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-[#8B5CF6]/20 bg-[#0B0912]/80 p-5 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.45)] sm:p-6 lg:col-span-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Sensitivity &amp; HUD Presets
                </h3>
                <p className="mt-1 text-xs text-[#A19BB8]">{activePreset.playstyle}</p>
              </div>
              <span className="font-mono text-xs text-[#C084FC] tabular-nums">
                {activePreset.dpi} &middot; Fire {activePreset.fireButtonSize}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {SENSITIVITY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPresetId(preset.id)}
                  className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                    presetId === preset.id
                      ? 'bg-gradient-to-r from-[#6D28D9] to-[#A855F7] text-white shadow-[0_0_18px_rgba(168,85,247,0.45)]'
                      : 'border border-[#8B5CF6]/20 bg-[#07060C] text-[#A19BB8] hover:border-[#A855F7]/50 hover:text-white hover:shadow-[0_0_16px_rgba(168,85,247,0.3)]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3.5">
              {sensitivityBars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#D8D0EE]">{bar.label}</span>
                    <span className="font-mono font-semibold text-white tabular-nums">
                      {bar.value} / 200
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#DDD6FE] transition-all duration-300"
                      style={{ width: `${(bar.value / 200) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Weapon Loadout */}
          <div className="rounded-2xl border border-[#8B5CF6]/20 bg-[#0B0912]/80 p-5 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.45)] sm:p-6 lg:col-span-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Preferred Weapon Loadout
                </h3>
                <p className="mt-1 text-xs text-[#A19BB8]">
                  Go-to weapons across Battle Royale &amp; Clash Squad
                </p>
              </div>
              <Crosshair className="h-5 w-5 text-[#C084FC]" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {WEAPON_LOADOUT.map((weapon) => (
                <div
                  key={weapon.id}
                  className="rounded-xl border border-[#8B5CF6]/18 bg-[#07060C] p-4 transition-all duration-200 hover:border-[#A855F7]/55 hover:shadow-[0_0_20px_rgba(168,85,247,0.16)]"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-lg font-bold text-white">
                      {weapon.name}
                    </h4>
                    <span className="text-xs font-medium text-[#C084FC]">
                      {weapon.rangeFocus}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#A19BB8]">
                    {weapon.role} &middot; {weapon.signatureSkin}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-[#D8D0EE]">
                    {weapon.playStyle}
                  </p>

                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#DDD6FE]"
                      style={{ width: `${weapon.controlRating}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
