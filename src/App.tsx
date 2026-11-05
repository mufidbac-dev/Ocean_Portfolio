/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { OceanScene } from './components/3d/OceanScene';
import { AdminLayout } from './components/admin/AdminLayout';
import { CompassDock } from './components/hud/CompassDock';
import { ControlsOverlay } from './components/hud/ControlsOverlay';
import { GalleryPanel } from './components/panels/GalleryPanel';
import { IslandModalContainer } from './components/panels/IslandModalContainer';
import { LibraryPanel } from './components/panels/LibraryPanel';
import { SignalPanel } from './components/panels/SignalPanel';
import { StudioPanel } from './components/panels/StudioPanel';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { IslandId } from './types/content';

function MainApp() {
  const { settings, saveSettings } = useContent();

  const [mode, setMode] = useState<'world' | 'admin'>('world');
  const [activeIsland, setActiveIsland] = useState<IslandId | null>(null);
  const [targetIsland, setTargetIsland] = useState<IslandId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [speedKnots, setSpeedKnots] = useState(0);
  const [compassDeg, setCompassDeg] = useState(0);

  // Sync hash routing e.g. #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setMode('admin');
      } else {
        setMode('world');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectIsland = useCallback((id: IslandId) => {
    if (activeIsland === id) {
      setIsModalOpen(true);
      return;
    }
    setTargetIsland(id);
    setIsModalOpen(false);
  }, [activeIsland]);

  const handleDock = useCallback((id: IslandId) => {
    setActiveIsland(id);
    setTargetIsland(null);
    setIsModalOpen(true);
  }, []);

  const handleUndock = useCallback(() => {
    setActiveIsland(null);
    setIsModalOpen(false);
  }, []);

  const handleClearTarget = useCallback(() => {
    setTargetIsland(null);
  }, []);

  const handleChangeTime = useCallback((time: 'day' | 'golden' | 'night') => {
    saveSettings({ oceanTime: time });
  }, [saveSettings]);

  if (mode === 'admin') {
    return (
      <AdminLayout
        onBackToWorld={() => {
          window.location.hash = '';
          setMode('world');
        }}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D WebGL Ocean Canvas */}
      <OceanScene
        oceanTime={settings.oceanTime || 'day'}
        activeIsland={activeIsland}
        onDock={handleDock}
        onUndock={handleUndock}
        targetIsland={targetIsland}
        onClearTarget={handleClearTarget}
        onSpeedChange={setSpeedKnots}
        onCompassChange={setCompassDeg}
      />

      {/* Top HUD Controls Guidance */}
      <ControlsOverlay
        activeIsland={activeIsland}
        onExploreActive={() => setIsModalOpen(true)}
      />

      {/* Floating Bottom Navigation Dock */}
      <CompassDock
        activeIsland={activeIsland}
        targetIsland={targetIsland}
        onSelectIsland={handleSelectIsland}
        oceanTime={settings.oceanTime || 'day'}
        onChangeTime={handleChangeTime}
        speedKnots={speedKnots}
        compassDeg={compassDeg}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setMode('admin');
        }}
      />

      {/* Island Content Slide-Over Drawer */}
      {isModalOpen && activeIsland && (
        <IslandModalContainer
          islandId={activeIsland}
          onClose={() => setIsModalOpen(false)}
        >
          {activeIsland === 'studio' && <StudioPanel />}
          {activeIsland === 'gallery' && <GalleryPanel />}
          {activeIsland === 'library' && <LibraryPanel />}
          {activeIsland === 'signal' && <SignalPanel />}
        </IslandModalContainer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <MainApp />
      </ContentProvider>
    </AuthProvider>
  );
}
