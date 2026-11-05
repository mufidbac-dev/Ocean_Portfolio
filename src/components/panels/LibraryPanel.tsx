/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Clock, Tag, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ArticleItem } from '../../types/content';

export const LibraryPanel: React.FC = () => {
  const { articles } = useContent();
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  const publishedArticles = articles.filter((a) => a.isPublished);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="text-xs uppercase font-mono tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
          Library Beacon
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Essays, Technical Notes & Research
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Inquiries into spatial design, WebGL performance, generative geometry, and marine aesthetics.
        </p>
      </div>

      {/* Articles List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {publishedArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="py-6 group flex flex-col md:flex-row md:items-baseline justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-4 rounded-2xl transition-all"
          >
            <div className="space-y-2 max-w-2xl">
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>{article.publishedAt || 'Recent'}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="tabular-nums">{article.readTimeMinutes || 4} min read</span>
                </span>
                {article.tags && article.tags.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{article.tags.join(', ')}</span>
                  </>
                )}
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {article.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="shrink-0 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Read Essay</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>{activeArticle.publishedAt || 'Recent'}</span>
                  <span>·</span>
                  <span>{activeArticle.readTimeMinutes || 4} min read</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {activeArticle.title}
                </h1>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeArticle.coverUrl && (
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 dark:bg-slate-800">
                <img
                  src={activeArticle.coverUrl}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Markdown reading prose */}
            <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line font-sans">
              {activeArticle.content}
            </div>

            {activeArticle.tags && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeArticle.tags.join(' · ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
