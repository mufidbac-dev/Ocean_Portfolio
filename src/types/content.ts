/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IslandId = 'studio' | 'gallery' | 'library' | 'signal';

export interface IslandConfig {
  id: IslandId;
  name: string;
  tagline: string;
  coords: [number, number]; // [x, z] in 3D world space
  color: string;
  accent: string;
  iconName: string;
  dockAngle: number; // in radians
  dockLength: number; // length of wooden pier
  collisionRadius: number; // impassable terrain boundary
  dockingPoint: [number, number]; // center of the soft docking zone at pier head
}

export interface SiteSettings {
  siteTitle: string;
  ownerName: string;
  tagline: string;
  accentColor: string;
  oceanTime: 'day' | 'golden' | 'night';
  updatedAt?: string;
}

export interface ProcessStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface AboutProfile {
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  cvUrl: string;
  clients: string[];
  processSteps: ProcessStep[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    email?: string;
    website?: string;
  };
  updatedAt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: 'Campaign' | 'Interiors' | 'Still Life' | 'Interactive' | string;
  year: number;
  client: string;
  summary: string;
  description: string;
  coverUrl: string;
  galleryUrls: string[];
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl: string;
  tags: string[];
  readTimeMinutes: number;
  isPublished: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}
