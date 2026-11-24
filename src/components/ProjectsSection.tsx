import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Code2, ExternalLink, X } from 'lucide-react';
import { PROJECTS, type ProjectItem } from '../data/portfolioData';

type ProjectFilter = 'All' | ProjectItem['category'];

const PROJECT_FILTERS: ProjectFilter[] = ['All', '3D & WebGL', 'Esports Tech', 'Full-Stack'];

export default function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filtered =
    filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  useEffect(() => {
    if (!activeProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject]);

  const jumpToTarget = (hashUrl: string) => {
    setActiveProject(null);
    const id = hashUrl.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="projects" className="relative border-t border-[#8B5CF6]/15 py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#C084FC]">My Projects</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Featured 3D &amp; gaming web builds
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#8B5CF6]/20 bg-[#0B0912]/90 p-1.5 backdrop-blur-md"
          >
            {PROJECT_FILTERS.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item)}
                  className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] ${
                    active
                      ? 'bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]'
                      : 'text-[#A19BB8] hover:bg-[#7C3AED]/15 hover:text-white hover:shadow-[0_0_16px_rgba(168,85,247,0.35)]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#8B5CF6]/20 bg-[#0B0912]/80 backdrop-blur-md transition-all duration-200 hover:border-[#A855F7]/65 hover:shadow-[0_0_32px_rgba(168,85,247,0.2)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#07060C]">
                {!brokenImages[project.id] ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [project.id]: true }))
                    }
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1A0F2E] via-[#0B0912] to-[#050507] p-6 text-center">
                    <Code2 className="h-10 w-10 text-[#A855F7]" />
                    <p className="mt-3 font-display text-lg font-semibold text-white">
                      {project.title}
                    </p>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B0912] via-[#0B0912]/45 to-transparent"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#A19BB8]">
                    <span>{project.category}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="tabular-nums">{project.year}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{project.role}</span>
                  </div>

                  <h3 className="mt-2 font-display text-xl font-bold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#C4BBE0]">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#8B5CF6]/15 pt-4">
                  <p className="font-mono text-xs text-[#A19BB8]">
                    {project.stack.join(' · ')}
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#8B5CF6]/30 bg-[#07060C]/90 px-3.5 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#A855F7] hover:bg-[#7C3AED]/25 hover:shadow-[0_0_22px_rgba(168,85,247,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC]"
                  >
                    Inspect Build
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Interactive Project Detail Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#8B5CF6]/35 bg-[#0B0912] p-5 shadow-[0_0_50px_rgba(124,58,237,0.28)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              aria-label="Close project details"
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B5CF6]/30 bg-[#07060C] text-[#D8D0EE] transition-all duration-200 hover:border-[#A855F7] hover:bg-[#7C3AED]/20 hover:text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C084FC] sm:top-5 sm:right-5"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs font-medium text-[#C084FC]">
              {activeProject.category} &middot; {activeProject.year} &middot; {activeProject.role}
            </p>
            <h3
              id="project-modal-title"
              className="mt-2 pr-12 font-display text-2xl font-bold text-white sm:text-3xl"
            >
              {activeProject.title}
            </h3>

            <div className="mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-[#8B5CF6]/20 bg-[#050507]">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C084FC]">
                  Overview
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-[#D8D0EE]">
                  {activeProject.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                  Technical Architecture
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-[#D8D0EE]">
                  {activeProject.architecture}
                </p>
              </div>

              <div className="rounded-xl border border-[#8B5CF6]/20 bg-[#07060C] p-4">
                <p className="text-xs text-[#A19BB8]">Design Goal</p>
                <p className="mt-1 text-sm font-medium text-white">{activeProject.highlight}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#8B5CF6]/15 pt-5">
              <p className="font-mono text-xs text-[#A19BB8]">
                {activeProject.stack.join(' · ')}
              </p>

              <button
                type="button"
                onClick={() => jumpToTarget(activeProject.liveUrl)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#A855F7] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(124,58,237,0.35)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(168,85,247,0.65)]"
              >
                Explore Related Section
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
