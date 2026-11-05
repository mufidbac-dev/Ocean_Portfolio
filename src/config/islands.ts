/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IslandConfig, IslandId } from '../types/content';

export const ISLANDS: Record<IslandId, IslandConfig> = {
  studio: {
    id: 'studio',
    name: 'Studio Atoll',
    tagline: 'About Me, Vision, Creative Process & CV',
    coords: [-45, -35], // North-West
    color: '#0d9488',
    accent: '#2dd4bf',
    iconName: 'Compass',
    dockAngle: Math.PI * 0.25, // points southeast to center
    dockLength: 21,
    collisionRadius: 13.0,
    dockingPoint: [-29.5, -19.5],
  },
  gallery: {
    id: 'gallery',
    name: 'Gallery Arch',
    tagline: 'Selected Works, Campaigns & Spatial Projects',
    coords: [45, -35], // North-East
    color: '#3b82f6',
    accent: '#60a5fa',
    iconName: 'Image',
    dockAngle: -Math.PI * 0.25, // points southwest to center
    dockLength: 21,
    collisionRadius: 13.0,
    dockingPoint: [29.5, -19.5],
  },
  library: {
    id: 'library',
    name: 'Library Beacon',
    tagline: 'Essays, Technical Notes & Journal',
    coords: [-40, 45], // South-West
    color: '#f59e0b',
    accent: '#fbbf24',
    iconName: 'BookOpen',
    dockAngle: Math.PI * 0.75, // points northeast to center
    dockLength: 21,
    collisionRadius: 13.0,
    dockingPoint: [-24.5, 29.5],
  },
  signal: {
    id: 'signal',
    name: 'Signal Station',
    tagline: 'Contact Inquiries, Social Radios & Transmissions',
    coords: [45, 40], // South-East
    color: '#ec4899',
    accent: '#f472b6',
    iconName: 'Radio',
    dockAngle: -Math.PI * 0.75, // points northwest to center
    dockLength: 21,
    collisionRadius: 13.0,
    dockingPoint: [29.5, 24.5],
  },
};

// Radius of the glowing turquoise soft docking zone ring on the water
export const DOCK_TRIGGER_RADIUS = 7.5;
