/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Compass,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  Radio,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { AboutView } from './AboutView';
import { AdminLogin } from './AdminLogin';
import { ArticlesView } from './ArticlesView';
import { MessagesView } from './MessagesView';
import { OverviewView } from './OverviewView';
import { ProjectsView } from './ProjectsView';
import { SettingsView } from './SettingsView';

interface AdminLayoutProps {
  onBackToWorld: () => void;
}

type AdminTab = 'overview' | 'projects' | 'articles' | 'about' | 'messages' | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToWorld }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { messages, settings } = useContent();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono text-xs">
        Loading admin authorization...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin onBackToWorld={onBackToWorld} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col sm:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full sm:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {settings.siteTitle || 'Ocean Portfolio'}
              </div>
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Admin Helm
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects (Gallery)</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Journal (Library)</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>About Me (Studio)</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4" />
                <span>Messages (Signal)</span>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer actions: return to 3D scene & Sign out */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={onBackToWorld}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-teal-500" />
            <span>Return to 3D Ocean</span>
          </button>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <div className="px-3 pt-2 text-[10px] text-slate-400 font-mono truncate">
            {user.email}
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        {activeTab === 'overview' && (
          <OverviewView
            onNavigateTab={setActiveTab}
            onNewProject={() => setActiveTab('projects')}
            onNewArticle={() => setActiveTab('articles')}
          />
        )}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'articles' && <ArticlesView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};
