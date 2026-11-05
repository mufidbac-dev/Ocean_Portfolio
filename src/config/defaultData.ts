/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AboutProfile, ArticleItem, ProjectItem, SiteSettings } from '../types/content';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'Ocean Archipelagos',
  ownerName: 'Mufid B. C.',
  tagline: 'Senior Creative Technologist & 3D Interactive Director',
  accentColor: '#14b8a6',
  oceanTime: 'day',
};

export const DEFAULT_ABOUT: AboutProfile = {
  fullName: 'Mufid B. C.',
  headline: 'Crafting spatial web experiences, procedural worlds & digital architecture.',
  bio: `Hello! I am a creative director and technical architect blending real-time 3D, generative systems, and thoughtful human-centered design. 

For over a decade, I have collaborated with design bureaus, architectural studios, and innovative technology brands to build tactile interactive products. My work investigates how digital spaces can feel calm, tactile, and natural—drawing inspiration from oceanic topographies, modernist pavilions, and generative procedural mechanics.

When not at the helm of code and 3D scenes, you will find me sailing coastal waters, studying marine ecology, and collecting vintage typography specimens.`,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  cvUrl: '#',
  clients: [
    'Aura Spatial Systems',
    'Nordic Maritime Lab',
    'Studio Monolith Tokyo',
    'Komorebi Sound Research',
    'Atelier Horizon Paris',
    'Helios Kinetic Media',
  ],
  processSteps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Cartography & Spatial Discovery',
      description: 'Mapping the narrative contours, spatial metaphors, and core functional constraints before writing a single line of shader code.',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Procedural Craft & PBR Lighting',
      description: 'Building custom multi-part geometry assemblies, zero-404 procedural materials, and balanced daylight/nightfall studio lighting rigs.',
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Kinematics & Micro-Interactions',
      description: 'Fine-tuning second-order dampings, spring camera physics, and tactile HUD overlays that respect the 3D viewport.',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Hardened Cloud Architecture',
      description: 'Integrating zero-trust Firestore database rules, real-time sync, and an accessible administrative control room.',
    },
  ],
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    email: 'mufidbac@gmail.com',
    website: 'https://mufid.dev',
  },
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'nordic-horizon',
    title: 'Nordic Horizon Archipelago',
    slug: 'nordic-horizon-archipelago',
    category: 'Campaign',
    year: 2026,
    client: 'Nordic Maritime Lab',
    summary: 'An interactive real-time 3D marine research vessel and ecological seabed explorer.',
    description: `Commissioned by Nordic Maritime Lab to visualise subsea biodiversity shifts across Scandinavian fjords. 

We developed a WebGL bathymetric terrain engine rendering over 40,000 procedural kelp clusters at solid 60fps on mobile browsers, pairing real-time scientific sonar data with cinematic ocean surface reflections and tactile audio synthesis.`,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    ],
    order: 1,
    isPublished: true,
  },
  {
    id: 'subsea-pavilion',
    title: 'Subsea Kinetic Pavilion',
    slug: 'subsea-kinetic-pavilion',
    category: 'Interiors',
    year: 2025,
    client: 'Atelier Horizon Paris',
    summary: 'Generative architectural visualizer simulating tidal daylight shifts through ocean glass.',
    description: `A study in submerged spatial architecture. Built for an international biennial pavilion showcase, this interactive space visualizes how ambient daylight filters through undulating seawater across varying depths.

Visitors manipulate sun elevation and tidal currents while observing procedural light caustics playing across travertine stone pillars.`,
    coverUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    order: 2,
    isPublished: true,
  },
  {
    id: 'luminescence-study',
    title: 'Bioluminescence Deep Still',
    slug: 'bioluminescence-deep-still',
    category: 'Still Life',
    year: 2025,
    client: 'Komorebi Sound Research',
    summary: 'Microscopic PBR procedural studies of abyssal marine organisms.',
    description: `A series of 8 high-fidelity procedural 3D sculptures capturing the organic translucency and soft radiance of deep-sea siphonophores. Built strictly using Three.js MeshPhysicalMaterial with custom scattering uniforms and ambient procedural oscillators.`,
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [],
    order: 3,
    isPublished: true,
  },
  {
    id: 'equatorial-voyage',
    title: 'Equatorial Trade Wind Odyssey',
    slug: 'equatorial-trade-wind-odyssey',
    category: 'Travel',
    year: 2024,
    client: 'Aura Spatial Systems',
    summary: 'A virtual sailing journey traversing historical maritime cartography and monsoon corridors.',
    description: `Drawing from 17th-century navigation logs and satellite meteorological archives, this narrative experience lets users pilot historic merchant schooners across the Indian Ocean under varying wind vectors.`,
    coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [],
    order: 4,
    isPublished: true,
  },
];

export const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'Crafting Tactile Water Waves in Three.js without External Textures',
    slug: 'crafting-tactile-water-waves-threejs',
    summary: 'How to build high-performance Gerstner ocean waves and crest foam using vertex shaders and mathematical noise.',
    content: `When building interactive 3D web spaces, external normal map textures frequently introduce network bottlenecks, 404 hazards, and noticeable tiling artifacts across endless horizons.

### The Power of Mathematical Wave Synthesis
By evaluating multiple sinusoidal Gerstner wave vectors directly on the GPU within the vertex shader, we obtain both analytical position displacements and exact normal vectors simultaneously.

\`\`\`glsl
vec3 gerstnerWave(vec4 wave, vec3 p, inout vec3 tangent, inout vec3 binormal) {
    float steepness = wave.z;
    float wavelength = wave.w;
    float k = 2.0 * 3.14159 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(wave.xy);
    float f = k * (dot(d, p.xz) - c * uTime);
    float a = steepness / k;
    
    tangent += vec3(-d.x * d.x * (steepness * sin(f)), d.x * (steepness * cos(f)), -d.x * d.y * (steepness * sin(f)));
    binormal += vec3(-d.x * d.y * (steepness * sin(f)), d.y * (steepness * cos(f)), -d.y * d.y * (steepness * sin(f)));
    return vec3(d.x * (a * cos(f)), a * sin(f), d.y * (a * cos(f)));
}
\`\`\`

### Damping & Buoyancy Calculations
To ensure our procedural sailboat bobs realistically, we evaluate the identical wave equation on the CPU at the boat's coordinates. This creates seamless coupling between visual water crests and physical vessel pitch and roll.`,
    coverUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80',
    tags: ['Three.js', 'GLSL', 'Math', 'WebGL'],
    readTimeMinutes: 5,
    isPublished: true,
    publishedAt: '2026-02-14',
  },
  {
    id: 'art-2',
    title: 'Spatial Portfolios: Beyond The Conventional Scroll',
    slug: 'spatial-portfolios-beyond-scroll',
    summary: 'Why spatial navigation invites deeper visitor contemplation than infinite vertical feeds.',
    content: `Most web portfolios reduce years of creative devotion into a hasty two-second vertical flick of a thumb. 

By grounding visitors in a world—where reaching an island requires an intentional voyage, and where distance gives weight to discovery—we invite genuine presence. The visitor transitions from a passive consumer to an explorer.`,
    coverUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design Philosophy', 'Spatial UX', 'Creative Direction'],
    readTimeMinutes: 4,
    isPublished: true,
    publishedAt: '2026-01-28',
  },
];
