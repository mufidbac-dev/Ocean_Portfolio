/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, Navigation, X } from 'lucide-react';
import { ISLANDS } from '../../config/islands';
import { IslandId } from '../../types/content';

interface ControlsOverlayProps {
  activeIsland: IslandId | null;
  onExploreActive: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  activeIsland,
  onExploreActive,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-20 flex flex-col gap-2.5 pointer-events-auto">
      {/* Brand Badge */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2.5 text-white shadow-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
          <Navigation className="w-4 h-4 rotate-45" />
        </div>
        <div>
          <h1 className="font-serif text-sm font-semibold tracking-wide text-white">
            Ocean Portfolio
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">
            Sail to 4 islands or fast-travel below
          </p>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="ml-2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
          title="Controls Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Docked Notification Banner */}
      {activeIsland && (
        <div className="bg-teal-950/90 border border-teal-500/40 text-teal-100 px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-semibold">
              Vessel Docked
            </div>
            <div className="text-xs font-semibold text-white">
              {ISLANDS[activeIsland].name}
            </div>
          </div>
          <button
            onClick={onExploreActive}
            className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Explore
          </button>
        </div>
      )}

      {/* Help Modal Popup */}
      {showHelp && (
        <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-white shadow-2xl w-72 text-xs flex flex-col gap-2.5 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-200">Sailing Instructions</span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-mono text-amber-300">W / ↑</span>
              <span>Hoist sails & accelerate</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-amber-300">S / ↓</span>
              <span>Drop anchor / reverse</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-amber-300">A / ←</span>
              <span>Steer port (left)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-amber-300">D / →</span>
              <span>Steer starboard (right)</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            💡 Tip: Click any island button in the bottom dock for smooth autopilot navigation.
          </div>
        </div>
      )}
    </div>
  );
};
