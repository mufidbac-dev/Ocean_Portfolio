/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToWorld: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToWorld }) => {
  const { signIn, signUp, authError, clearError } = useAuth();
  const [email, setEmail] = useState('mufidbac@gmail.com');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      if (isRegisterMode) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch {
      // Error handled in auth context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToWorld}
          className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to 3D Ocean</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            {isRegisterMode ? 'Register Admin Account' : 'Admin Helm Access'}
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to manage portfolio projects, essays, bio, and site settings.
          </p>
        </div>

        {authError && (
          <div className="p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-900 rounded-xl">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1"
            >
              Admin Email
            </label>
            <div className="relative">
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="mufidbac@gmail.com"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="••••••••••••"
                required
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {submitting
                ? 'Authenticating...'
                : isRegisterMode
                ? 'Create Admin Account'
                : 'Sign In to Dashboard'}
            </span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              clearError();
            }}
            className="text-teal-400 hover:underline cursor-pointer"
          >
            {isRegisterMode
              ? 'Already registered? Sign in here'
              : 'First time setup? Create initial admin password'}
          </button>
        </div>
      </div>
    </div>
  );
};
