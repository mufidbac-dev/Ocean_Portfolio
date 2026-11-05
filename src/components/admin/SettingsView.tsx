/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Moon, Palette, Save, Sun, Sunrise } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const SettingsView: React.FC = () => {
  const { settings, saveSettings } = useContent();

  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [accentColor, setAccentColor] = useState(settings.accentColor || '#14b8a6');
  const [oceanTime, setOceanTime] = useState<'day' | 'golden' | 'night'>(
    settings.oceanTime || 'day'
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await saveSettings({
        siteTitle,
        ownerName,
        tagline,
        accentColor,
        oceanTime,
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
            General & 3D Environment Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure site branding, nautical atmosphere lighting presets, and accent tokens.
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
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="set-title"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Website Title
              </label>
              <input
                id="set-title"
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="set-owner"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Owner / Studio Name
              </label>
              <input
                id="set-owner"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="set-tagline"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Tagline / Subtitle
            </label>
            <input
              id="set-tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* 3D Ocean Atmosphere & Accent */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
            3D Ocean Lighting & Atmosphere
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Ocean Time Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Default Ocean Lighting Preset
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOceanTime('day')}
                  className={`p-3 rounded-2xl border text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    oceanTime === 'day'
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-700 dark:text-sky-300 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Sun className="w-5 h-5 text-sky-500" />
                  <span>Daylight</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOceanTime('golden')}
                  className={`p-3 rounded-2xl border text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    oceanTime === 'golden'
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-700 dark:text-amber-300 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Sunrise className="w-5 h-5 text-amber-500" />
                  <span>Golden Hour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOceanTime('night')}
                  className={`p-3 rounded-2xl border text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    oceanTime === 'night'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <span>Nightfall</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label
                htmlFor="set-accent"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Accent Highlight Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="set-accent"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
                <div
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
