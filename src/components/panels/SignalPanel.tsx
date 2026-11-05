/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Radio,
  Send,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export const SignalPanel: React.FC = () => {
  const { about, sendMessage } = useContent();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMessage('Please complete all fields before transmitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await sendMessage({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to send message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
      {/* Left Transmission Info */}
      <div className="md:col-span-5 space-y-6">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-pink-600 dark:text-pink-400 font-semibold">
            Signal Station
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Initiate Direct Transmission
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Whether inquiring about upcoming commissions, collaborative 3D
            architectures, or speaking engagements, all signals are received
            directly into the studio desk.
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
            Connected Frequencies
          </div>
          <div className="flex flex-col gap-2.5">
            {about.socialLinks.email && (
              <a
                href={`mailto:${about.socialLinks.email}`}
                className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{about.socialLinks.email}</span>
              </a>
            )}
            {about.socialLinks.github && (
              <a
                href={about.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <Github className="w-4 h-4 text-slate-400" />
                <span>GitHub / Code Repositories</span>
              </a>
            )}
            {about.socialLinks.linkedin && (
              <a
                href={about.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-slate-400" />
                <span>LinkedIn / Professional Network</span>
              </a>
            )}
            {about.socialLinks.instagram && (
              <a
                href={about.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-slate-400" />
                <span>Instagram / Visual Sketches</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Right Contact Form */}
      <div className="md:col-span-7 bg-slate-50 dark:bg-slate-800/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              Signal Transmitted
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Thank you for reaching out. Your transmission has been logged into
              the studio dashboard and will receive a thoughtful reply shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-700 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Send Another Signal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">
              Dispatch Form
            </div>

            {errorMessage && (
              <div className="p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl">
                {errorMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="signal-name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Your Name
              </label>
              <input
                id="signal-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Maria Lindholm"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signal-email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Return Frequency (Email)
              </label>
              <input
                id="signal-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="maria@atelier.org"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signal-message"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Transmission Content
              </label>
              <textarea
                id="signal-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your inquiry, project scope, or greetings..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/40 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Transmitting Signal...' : 'Transmit Signal'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
