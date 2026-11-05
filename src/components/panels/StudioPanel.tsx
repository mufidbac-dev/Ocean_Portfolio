/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpRight, CheckCircle2, Download, ExternalLink, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const StudioPanel: React.FC = () => {
  const { about } = useContent();

  return (
    <div className="space-y-10">
      {/* Hero Bio Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 space-y-4">
          <div className="text-xs uppercase font-mono tracking-widest text-teal-600 dark:text-teal-400 font-semibold">
            Studio & Philosophy
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {about.headline || 'Architecting spatial worlds, procedural mechanics and tactile digital products.'}
          </h1>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-3 whitespace-pre-line">
            {about.bio}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            {about.cvUrl && (
              <a
                href={about.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Curriculum Vitae (PDF)</span>
              </a>
            )}
            {about.socialLinks.email && (
              <a
                href={`mailto:${about.socialLinks.email}`}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <span>Direct Inquiries</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Profile Avatar Card with Fallback */}
        <div className="md:col-span-4 flex flex-col items-center sm:items-start">
          <div className="w-full aspect-square max-w-[280px] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg relative group">
            <img
              src={about.avatarUrl}
              alt={about.fullName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                // Graceful fallback to stylized gradient avatar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div>
                <div className="text-white font-serif font-bold text-base">
                  {about.fullName}
                </div>
                <div className="text-slate-300 text-xs">
                  Studio Master & Technologist
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Process Steps */}
      {about.processSteps && about.processSteps.length > 0 && (
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-teal-600 dark:text-teal-400 font-semibold">
                Methodology
              </div>
              <h2 className="font-serif text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Creative Process
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {about.processSteps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5 transition-all hover:border-teal-500/40"
              >
                <div className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                  {String(step.stepNumber || idx + 1).padStart(2, '0')}.
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Collaborators & Clients */}
      {about.clients && about.clients.length > 0 && (
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="text-xs uppercase font-mono tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
            Select Collaborators & Studios
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {about.clients.map((client, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
