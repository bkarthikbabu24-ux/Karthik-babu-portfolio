import { useState } from 'react';
import { motion } from 'motion/react';
import { SKILLS, type SkillItem } from '../data/portfolioData';

type SkillFilter = 'All' | SkillItem['category'];

const FILTER_TABS: SkillFilter[] = [
  'All',
  '3D & Frontend',
  'Backend & Systems',
  'Gaming & Tactics',
];

export default function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState<SkillFilter>('All');
  const [selectedSkillId, setSelectedSkillId] = useState<string>(SKILLS[0].id);

  const visibleSkills =
    activeFilter === 'All'
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeFilter);

  const activeSkill =
    visibleSkills.find((s) => s.id === selectedSkillId) ?? visibleSkills[0];

  return (
    <section
      id="skills"
      className="relative border-t border-[#8B5CF6]/15 bg-[#07060C]/80 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#C084FC]">My Skills</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Technical stack &amp; gaming mechanics
            </h2>
          </div>

          {/* Interactive Violet Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter skills by discipline"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#8B5CF6]/20 bg-[#0B0912]/90 p-1.5 backdrop-blur-md"
          >
            {FILTER_TABS.map((tab) => {
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(tab)}
                  className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] ${
                    active
                      ? 'bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]'
                      : 'text-[#A19BB8] hover:bg-[#7C3AED]/15 hover:text-white hover:shadow-[0_0_16px_rgba(168,85,247,0.35)]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Skill Grid + Focused Detail Drawer */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
            {visibleSkills.map((skill) => {
              const isSelected = activeSkill?.id === skill.id;
              return (
                <motion.button
                  key={skill.id}
                  type="button"
                  layout
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`group flex flex-col justify-between rounded-xl border p-5 text-left backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] ${
                    isSelected
                      ? 'border-[#A855F7] bg-[#130D24]/88 shadow-[0_0_28px_rgba(168,85,247,0.28)]'
                      : 'border-[#8B5CF6]/20 bg-[#0B0912]/78 hover:border-[#A855F7]/60 hover:bg-[#110C1E]/85 hover:shadow-[0_0_22px_rgba(139,92,246,0.28)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-[#A19BB8]">
                        {skill.category} &middot; {skill.tag}
                      </span>
                      <span className="font-mono text-sm font-semibold text-[#C084FC] tabular-nums">
                        {skill.focusLevel}%
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-semibold text-white">
                      {skill.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[#B8AED0]">
                      {skill.tools.join(' · ')}
                    </p>
                  </div>

                  <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6D28D9] via-[#A855F7] to-[#DDD6FE] transition-all duration-300"
                      style={{ width: `${skill.focusLevel}%` }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right Panel: Selected Skill Breakdown */}
          {activeSkill && (
            <div className="flex flex-col justify-between rounded-2xl border border-[#8B5CF6]/25 bg-[#0B0912]/82 p-6 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.5)] lg:col-span-4">
              <div>
                <p className="text-xs font-medium text-[#C084FC]">
                  Selected Capability &middot; {activeSkill.category}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  {activeSkill.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-4 border-y border-[#8B5CF6]/15 py-4">
                  <div>
                    <p className="text-xs text-[#A19BB8]">Focus Meter</p>
                    <p className="font-mono text-2xl font-semibold text-[#C084FC] tabular-nums">
                      {activeSkill.focusLevel}%
                    </p>
                  </div>
                  <div className="h-8 w-px bg-[#8B5CF6]/20" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-[#A19BB8]">Discipline</p>
                    <p className="font-display text-xl font-semibold text-white">
                      {activeSkill.tag}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[#D8D0EE]">
                  {activeSkill.summary}
                </p>
              </div>

              <div className="mt-8 border-t border-[#8B5CF6]/15 pt-5">
                <p className="text-xs font-medium text-[#A19BB8]">Core Stack &amp; Tools</p>
                <p className="mt-2 font-mono text-sm text-[#EDE9FE]">
                  {activeSkill.tools.join('  /  ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
