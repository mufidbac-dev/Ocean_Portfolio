/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  CheckCircle,
  FileText,
  FolderPlus,
  Image as ImageIcon,
  Mail,
  Plus,
  Radio,
  Sliders,
  User,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface OverviewViewProps {
  onNavigateTab: (tab: 'projects' | 'articles' | 'about' | 'messages' | 'settings') => void;
  onNewProject: () => void;
  onNewArticle: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigateTab,
  onNewProject,
  onNewArticle,
}) => {
  const { projects, articles, messages } = useContent();

  const publishedProjects = projects.filter((p) => p.isPublished).length;
  const publishedArticles = articles.filter((a) => a.isPublished).length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Command Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your ocean portfolio content, visitor inquiries, and site health in real time.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Projects KPI */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500">
              Gallery Works
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {projects.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {publishedProjects} Published
            </span>{' '}
            · {projects.length - publishedProjects} Drafts
          </div>
        </div>

        {/* Articles KPI */}
        <div
          onClick={() => onNavigateTab('articles')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-500/40 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500">
              Library Journals
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {articles.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {publishedArticles} Published
            </span>{' '}
            · {articles.length - publishedArticles} Drafts
          </div>
        </div>

        {/* Messages KPI */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-pink-500/40 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500">
              Signal Transmissions
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
            {messages.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {unreadMessages > 0 ? (
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {unreadMessages} Unread Inquiries
              </span>
            ) : (
              <span className="text-slate-400">All transmissions read</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h2 className="text-xs uppercase font-mono tracking-widest text-slate-500 font-semibold">
          Quick Content Actions
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onNewProject}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
          <button
            onClick={onNewArticle}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Write New Journal Essay</span>
          </button>
          <button
            onClick={() => onNavigateTab('about')}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Update Studio Bio & Process</span>
          </button>
          <button
            onClick={() => onNavigateTab('settings')}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Customize Site Appearance</span>
          </button>
        </div>
      </div>

      {/* Recent Inquiries Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            Recent Contact Inquiries
          </h2>
          <button
            onClick={() => onNavigateTab('messages')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            View All ({messages.length})
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            No inquiries received yet. Visitors can send transmissions from Signal Island.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
            {messages.slice(0, 4).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onNavigateTab('messages')}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {msg.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      · {msg.email}
                    </span>
                    {!msg.isRead && (
                      <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded-full font-bold">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    {msg.message}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono shrink-0">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
