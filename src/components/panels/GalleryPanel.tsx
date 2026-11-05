/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ProjectItem } from '../../types/content';

export const GalleryPanel: React.FC = () => {
  const { projects } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // Extract available published categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects
      .filter((p) => p.isPublished)
      .forEach((p) => {
        if (p.category) set.add(p.category);
      });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filter published projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => p.isPublished)
      .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
      .sort((a, b) => a.order - b.order);
  }, [projects, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Header & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-blue-600 dark:text-blue-400 font-semibold">
            Gallery Arch
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Curated Works & Spatial Studies
          </h1>
        </div>

        {/* Category Segmented Tabs (Functional Buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center text-slate-500 space-y-2">
          <p className="font-serif text-lg">No projects published in this category yet.</p>
          <p className="text-xs">Select "All" to browse the complete archive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-blue-500/50 hover:shadow-xl cursor-pointer flex flex-col"
            >
              {/* Media Thumbnail */}
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                <img
                  src={project.coverUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Meta & Typography */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span>{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.client}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{project.year}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Study Modal Detail */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
                  <span>{activeProject.category}</span>
                  <span>·</span>
                  <span>{activeProject.client}</span>
                  <span>·</span>
                  <span className="tabular-nums">{activeProject.year}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {activeProject.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cover Hero */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 dark:bg-slate-800">
              <img
                src={activeProject.coverUrl}
                alt={activeProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description Body */}
            <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {activeProject.description || activeProject.summary}
            </div>

            {/* Gallery Media Grid */}
            {activeProject.galleryUrls && activeProject.galleryUrls.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">
                  Additional Visual Artifacts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeProject.galleryUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800"
                    >
                      <img
                        src={url}
                        alt={`${activeProject.title} gallery ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
