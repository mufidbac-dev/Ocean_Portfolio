/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Plus, Save, Trash2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ProcessStep } from '../../types/content';

export const AboutView: React.FC = () => {
  const { about, saveAbout } = useContent();

  const [fullName, setFullName] = useState(about.fullName);
  const [headline, setHeadline] = useState(about.headline);
  const [bio, setBio] = useState(about.bio);
  const [avatarUrl, setAvatarUrl] = useState(about.avatarUrl);
  const [cvUrl, setCvUrl] = useState(about.cvUrl);
  const [clients, setClients] = useState<string[]>(about.clients || []);
  const [newClient, setNewClient] = useState('');
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(
    about.processSteps || []
  );

  const [socialLinks, setSocialLinks] = useState({
    email: about.socialLinks.email || '',
    github: about.socialLinks.github || '',
    linkedin: about.socialLinks.linkedin || '',
    instagram: about.socialLinks.instagram || '',
    website: about.socialLinks.website || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Clients management
  const addClient = () => {
    if (newClient.trim() && !clients.includes(newClient.trim())) {
      setClients([...clients, newClient.trim()]);
      setNewClient('');
    }
  };

  const removeClient = (idx: number) => {
    setClients(clients.filter((_, i) => i !== idx));
  };

  // Process steps management
  const addStep = () => {
    const nextNum = processSteps.length + 1;
    setProcessSteps([
      ...processSteps,
      {
        id: `step-${Date.now()}`,
        stepNumber: nextNum,
        title: `Phase ${nextNum}: Title`,
        description: 'Describe this phase in the creative process...',
      },
    ]);
  };

  const updateStep = (idx: number, field: 'title' | 'description', val: string) => {
    const list = [...processSteps];
    list[idx] = { ...list[idx], [field]: val };
    setProcessSteps(list);
  };

  const removeStep = (idx: number) => {
    const list = processSteps.filter((_, i) => i !== idx);
    // renumber
    const renumbered = list.map((step, i) => ({ ...step, stepNumber: i + 1 }));
    setProcessSteps(renumbered);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await saveAbout({
        fullName,
        headline,
        bio,
        avatarUrl,
        cvUrl,
        clients,
        processSteps,
        socialLinks,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Studio Island & Biography
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your professional bio, design methodology, collaborator roster, and links.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {success ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Studio Content'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Biography */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Core Bio & Credentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="about-name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="about-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="about-cv"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Curriculum Vitae Link (PDF)
              </label>
              <input
                id="about-cv"
                type="text"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="about-headline"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Headline / Position
            </label>
            <input
              id="about-headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="about-avatar"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Profile Photo URL
            </label>
            <input
              id="about-avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="about-bio"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Full Biography
            </label>
            <textarea
              id="about-bio"
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm resize-none"
            />
          </div>
        </div>

        {/* Process Steps */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Creative Methodology Steps
            </h2>
            <button
              type="button"
              onClick={addStep}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {processSteps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-start"
              >
                <div className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 pt-2 shrink-0">
                  {String(step.stepNumber).padStart(2, '0')}.
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold"
                    placeholder="Step Title"
                  />
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => updateStep(idx, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs resize-none"
                    placeholder="Step Description"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="text-rose-500 hover:text-rose-700 p-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Clients & Collaborators */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Clients & Brand Collaborators
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              placeholder="e.g. Studio Monolith Tokyo"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={addClient}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {clients.map((c, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => removeClient(idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Social & Contact Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="soc-email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Direct Email
              </label>
              <input
                id="soc-email"
                type="email"
                value={socialLinks.email}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="soc-github"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                GitHub URL
              </label>
              <input
                id="soc-github"
                type="url"
                value={socialLinks.github}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="soc-linkedin"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                LinkedIn URL
              </label>
              <input
                id="soc-linkedin"
                type="url"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="soc-instagram"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Instagram URL
              </label>
              <input
                id="soc-instagram"
                type="url"
                value={socialLinks.instagram}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, instagram: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
