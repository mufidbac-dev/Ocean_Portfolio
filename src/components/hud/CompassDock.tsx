/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Anchor,
  BookOpen,
  Compass,
  Image as ImageIcon,
  Moon,
  Radio,
  ShieldAlert,
  Sun,
  Sunrise,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ISLANDS } from '../../config/islands';
import { oceanAudio } from '../../lib/oceanAudio';
import { IslandId } from '../../types/content';

interface CompassDockProps {
  activeIsland: IslandId | null;
  targetIsland: IslandId | null;
  onSelectIsland: (id: IslandId) => void;
  oceanTime: 'day' | 'golden' | 'night';
  onChangeTime: (time: 'day' | 'golden' | 'night') => void;
  speedKnots: number;
  compassDeg: number;
  onOpenAdmin: () => void;
}

export const CompassDock: React.FC<CompassDockProps> = ({
  activeIsland,
  targetIsland,
  onSelectIsland,
  oceanTime,
  onChangeTime,
  speedKnots,
  compassDeg,
  onOpenAdmin,
}) => {
  const [isMuted, setIsMuted] = useState(!oceanAudio.getStatus());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSound = () => {
    const nextState = oceanAudio.toggle();
    setIsMuted(!nextState);
  };

  const getCompassDirection = (deg: number) => {
    const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(deg / 45) % 8;
    return cardinals[idx];
  };

  const islandIcon = (id: IslandId) => {
    switch (id) {
      case 'studio':
        return <Compass className="w-4 h-4" />;
      case 'gallery':
        return <ImageIcon className="w-4 h-4" />;
      case 'library':
        return <BookOpen className="w-4 h-4" />;
      case 'signal':
        return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-4 pointer-events-auto">
      {/* Collapse Toggle Handle */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs uppercase tracking-widest font-mono text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 px-3 py-1 rounded-t-lg border-t border-x border-slate-300 dark:border-slate-700 shadow-sm hover:bg-white transition-all flex items-center gap-1.5"
        >
          <span>{isCollapsed ? 'Show Navigation Dock' : 'Hide Dock'}</span>
        </button>
      </div>

      {!isCollapsed && (
        <div className="bg-slate-950/85 backdrop-blur-md text-white border border-slate-800 rounded-2xl p-2.5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Telemetry: Compass & Knots */}
          <div className="flex items-center gap-4 px-3 py-1 bg-slate-900/70 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Anchor className="w-3.5 h-3.5" />
              <span className="tabular-nums font-semibold">{speedKnots}</span>
              <span className="text-slate-400 text-[10px]">KTS</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-teal-400">
              <Compass className="w-3.5 h-3.5" />
              <span className="tabular-nums font-semibold">
                {String(compassDeg).padStart(3, '0')}°
              </span>
              <span className="text-slate-400 text-[10px] font-bold">
                {getCompassDirection(compassDeg)}
              </span>
            </div>
          </div>

          {/* 4 Island Fast-Travel Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {(Object.keys(ISLANDS) as IslandId[]).map((id) => {
              const island = ISLANDS[id];
              const isCurrent = activeIsland === id;
              const isSailingTo = targetIsland === id;

              return (
                <button
                  key={id}
                  onClick={() => onSelectIsland(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-teal-500 text-slate-950 font-semibold shadow-lg shadow-teal-500/20'
                      : isSailingTo
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 animate-pulse'
                      : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                  title={island.tagline}
                >
                  {islandIcon(id)}
                  <span>{island.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono uppercase bg-slate-950/40 text-slate-900 px-1 rounded">
                      Docked
                    </span>
                  )}
                  {isSailingTo && (
                    <span className="text-[10px] font-mono uppercase text-amber-300">
                      Sailing
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Sky presets, Audio & Admin */}
          <div className="flex items-center gap-2">
            {/* Sky Preset */}
            <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => onChangeTime('day')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  oceanTime === 'day' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Daylight"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeTime('golden')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  oceanTime === 'golden' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Golden Hour"
              >
                <Sunrise className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeTime('night')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  oceanTime === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Nightfall"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                !isMuted
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={isMuted ? 'Unmute procedural sea sound' : 'Mute sea sound'}
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Admin Dashboard Switcher */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Admin Dashboard"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
