# 3D Ocean Sailing Portfolio & Full Admin Dashboard

A dual-experience web application featuring an interactive 3D ocean voyage where visitors sail a sailboat between 4 thematic islands (Studio, Gallery, Library, Signal) to explore portfolio content, paired with a protected Admin Dashboard allowing the owner to manage content, media, articles, contact inquiries, and appearance settings in real-time via Firebase Auth and Firestore.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and interaction decisions have been confirmed and integrated into this blueprint:

- **Confirmed Decision 1 (Backend & Database)**: Firebase Firestore paired with Firebase Auth will serve as the database and authentication backbone, ensuring cloud persistence, robust security rules, and real-time updates.
- **Confirmed Decision 2 (3D Sailing Interaction)**: Dual mode navigation is enabled—visitors can steer the sailboat manually using keyboard controls (WASD / Arrow Keys) with wave physics, or click any island/dock button for smooth cinematic camera travel and auto-docking.
- **Confirmed Decision 3 (Admin Authentication)**: Email and password authentication with protected admin session management, restricted to authorized administrator accounts.
- **Confirmed Decision 4 (Asset & Visual Strategy)**: Zero external 404 dependencies—procedural Three.js geometry for the sailboat (composite 6-part hull, mast, canvas sail, rudder, brass lanterns), island terrains, procedural stylized ocean water shader, and built-in SVG/canvas textures.

---

## 1. Overview & Core Concept

- **What It Does**: Visitors enter an expansive turquoise ocean under daylight or twilight skies, sailing a procedural sailboat to 4 distinct archipelago islands:
  1. **Studio Island**: Biography, creative process, client showcase, and downloadable CV.
  2. **Gallery Island**: Visual showcase of curated creative projects with category filtering, case studies, and image carousels.
  3. **Library Island**: Essays, notes, and technical articles with rich reading layout.
  4. **Signal Island**: Direct contact portal, social channels, and interactive message inquiry dispatch.
  Meanwhile, the `/admin` route provides a private, responsive administrative workspace for managing all content without touching code.
- **Target Audience / Persona**: Design studios, potential enterprise clients, art directors, tech collaborators, and creative recruiters looking for an engaging interactive portfolio.
- **Key Value**: Merges the wonder of a playful 3D exploration experience with the utility and maintainability of an enterprise headless CMS and real-time database.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Visitor Voyage Flow**:
   - Landing: Visitor arrives on the deck of the sailboat in open turquoise sea; welcoming compass HUD indicates nearest islands.
   - Cruise & Dock: Visitor navigates using keyboard or clicks an island badge in the bottom dock; sailboat steers toward the dock, waves part, and a docking prompt triggers.
   - Island Exploration: Upon docking, an elegant slide-over panel reveals the island's content (Studio bio, Gallery case studies, Library journals, or Signal inquiry form) with smooth Framer Motion transitions.
   - Quick Travel: Visitors who prefer rapid reading can toggle "Fast Travel" from the floating dock without sailing manually.
2. **Contact Inquiry Flow**:
   - Visitor docks at Signal Island or clicks "Signal" in the dock.
   - Completes the contact form with validation; message is saved instantly to Firestore with real-time feedback.
3. **Admin Content Management Flow**:
   - Admin accesses `/admin/login`, inputs credentials, and is redirected to `/admin/dashboard`.
   - Admin can create new projects, edit rich text journals, update bio/clients, mark messages as read, and adjust site settings (accent color, site title, ocean daytime preset).
   - Updates reflect immediately across the public 3D application.

### Visual Identity & Theme
- **Color Palette & Atmospheric Mood**:
  - *Ocean Waters*: Shallow turquoise (`#14b8a6` / `#0d9488`) transitioning to deep sapphire navy (`#0f172a`).
  - *Canvas & Surfaces*: Sandstone parchment (`#f8fafc` / `#f1f5f9`), crisp white (`#ffffff`), and dark obsidian slate (`#020617`).
  - *Accents*: Sunlit amber (`#f59e0b`) and nautical brass (`#d97706`).
- **Typography**:
  - *Display / Headlines*: `Playfair Display` or `Fraunces` for editorial island titles and portfolio project names.
  - *Interface & Body*: `Plus Jakarta Sans` or `DM Sans` for legible UI, forms, and reading copy.
  - *Data & Telemetry*: `JetBrains Mono` for coordinates, nautical knots, and dates.
- **Control Layout**:
  - Bottom-pinned collapsible dock (`max-w-2xl`, bottom 20px) keeping 85%+ of the 3D viewport completely unobstructed.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural Three.js Models vs Heavy External 3D GLTF Files**:
  - *Chosen Approach*: Construct the sailboat, lighthouse, palms, docks, and rocky islets procedurally using Three.js compound geometries (`ExtrudeGeometry`, `LatheGeometry`, `CylinderGeometry`) and procedural water vertex shaders.
  - *Why*: Guarantees instant sub-second initial load, zero 404 network failures, lossless 60fps performance on all devices, and customizable materials without huge asset downloads.
- **Decision 2: Direct Firestore State Sync with Optimistic Caching**:
  - *Chosen Approach*: Store default fallback content bundled in the frontend, hydrating seamlessly from Firestore. If network is offline or database is newly provisioned, public visitors still experience a fully populated portfolio.
  - *Why*: Eliminates blank-screen states and ensures instant rendering for portfolio reviewers.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PORTFOLIO WEB APPLICATION                       │
│                                                                        │
│   ┌──────────────────────────────────┐ ┌───────────────────────────┐   │
│   │        Public 3D Experience      │ │      Admin Dashboard      │   │
│   │                                  │ │                           │   │
│   │  ┌────────────────────────────┐  │ │  ┌─────────────────────┐  │   │
│   │  │ Three.js Canvas Viewport   │  │ │  │ Auth Guard & Login  │  │   │
│   │  │ - Procedural Sailboat      │  │ │  └──────────┬──────────┘  │   │
│   │  │ - Stylized Ocean Shader    │  │ │             ▼             │   │
│   │  │ - 4 Procedural Islands     │  │ │  ┌─────────────────────┐  │   │
│   │  └─────────────┬──────────────┘  │ │  │ CRUD Manager Panels │  │   │
│   │                ▼                 │ │  │ - About / Profile   │  │   │
│   │  ┌────────────────────────────┐  │ │  │ - Projects (Gallery)│  │   │
│   │  │ Floating Bottom Dock       │  │ │  │ - Articles (Library)│  │   │
│   │  │ & Island Content Drawers   │  │ │  │ - Inquiries (Signal)│  │   │
│   │  │ (Studio, Gallery, etc.)    │  │ │  │ - Appearance Config │  │   │
│   │  └─────────────┬──────────────┘  │ │  └──────────┬──────────┘  │   │
│   └────────────────┼─────────────────┘ └─────────────┼─────────────┘   │
│                    ▼                                 ▼                 │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              Data Access Layer & Firebase SDK Hooks            │   │
│   │    (useProjects, useArticles, useSiteSettings, useInquiries)   │   │
│   └────────────────┬─────────────────────────────────┬─────────────┘   │
└────────────────────┼─────────────────────────────────┼─────────────────┘
                     ▼                                 ▼
┌──────────────────────────────────────┐ ┌───────────────────────────────┐
│           Firebase Auth              │ │       Cloud Firestore         │
│  - Email/Password Admin Session      │ │  - /settings/general          │
│  - Protected Token Headers           │ │  - /about/profile             │
│  - Session Persistence               │ │  - /projects/{projectId}      │
│                                      │ │  - /articles/{articleId}      │
│                                      │ │  - /messages/{messageId}      │
│                                      │ │  - /admins/{adminUid}         │
└──────────────────────────────────────┘ └───────────────────────────────┘
```

---

### 1. Struktur Folder Project Lengkap

```text
/
├── index.html                           # Entry HTML & Meta headers
├── metadata.json                        # AI Studio app capabilities & metadata
├── package.json                         # Dependencies & build scripts
├── tsconfig.json                        # Strict TypeScript config
├── vite.config.ts                       # Vite bundler configuration
├── firebase-blueprint.json              # Firestore entities & collections IR
├── firestore.rules                      # ABAC Firestore security rules
├── src/
│   ├── main.tsx                         # App bootstrap
│   ├── App.tsx                          # Root router (Public 3D vs Admin)
│   ├── index.css                        # Tailwind v4 theme & custom utilities
│   │
│   ├── types/
│   │   ├── content.ts                   # Types for Projects, Articles, About, Messages, Settings
│   │   └── three.ts                     # Coordinates, Island anchors, Boat kinematics
│   │
│   ├── config/
│   │   ├── defaultData.ts               # Resilient seed data for instant zero-latency view
│   │   └── islands.ts                   # Island positions, collision radii, and themes
│   │
│   ├── lib/
│   │   ├── firebase.ts                  # Firebase app, auth, and firestore initialization
│   │   └── errorHandling.ts             # Strict FirestoreErrorInfo formatter
│   │
│   ├── context/
│   │   ├── AuthContext.tsx              # Admin authentication provider & session state
│   │   └── ContentContext.tsx           # Real-time Firestore sync & local state
│   │
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── OceanScene.tsx           # Main Three.js canvas & render loop
│   │   │   ├── Sailboat.tsx             # 6-part procedural sailboat model & helm kinematics
│   │   │   ├── OceanWater.tsx           # Stylized waves, vertex displacement & foam shader
│   │   │   ├── Islands.tsx              # Procedural terrain, lighthouses, palms, docks
│   │   │   ├── SkyAndAtmosphere.tsx     # Sunlight, hemisphere fill, horizon fog
│   │   │   └── AudioAmbience.tsx        # Procedural ocean breeze & gentle wave sound (Web Audio)
│   │   │
│   │   ├── hud/
│   │   │   ├── CompassDock.tsx          # Pinned bottom navigation dock (<15% viewport)
│   │   │   ├── ControlsOverlay.tsx      # WASD sailing guide & travel toggle
│   │   │   └── AudioToggle.tsx          # Mute/unmute procedural soundscape
│   │   │
│   │   ├── panels/
│   │   │   ├── IslandModalContainer.tsx # Sliding bottom/side drawer with backdrop
│   │   │   ├── StudioPanel.tsx          # About me, bio, process steps, clients, CV download
│   │   │   ├── GalleryPanel.tsx         # Project grid, category filter, detail modal
│   │   │   ├── LibraryPanel.tsx         # Journal articles list, reading view
│   │   │   └── SignalPanel.tsx          # Contact info, social links & message form
│   │   │
│   │   └── admin/
│   │       ├── AdminLayout.tsx          # Admin sidebar, header, and route outlet
│   │       ├── ProtectedRoute.tsx       # Auth route guard redirecting to /admin/login
│   │       ├── OverviewStats.tsx        # Project count, journal count, unread inquiries
│   │       ├── ProjectsManager.tsx      # Project list, reorder, publish toggle, delete
│   │       ├── ProjectEditorModal.tsx   # Project create/edit form (fields, categories, media)
│   │       ├── ArticlesManager.tsx      # Journal list & rich editor modal
│   │       ├── AboutEditor.tsx          # Bio, clients, process steps, social links editor
│   │       ├── MessagesInbox.tsx        # Visitor inquiries table with status & delete
│   │       └── SiteSettingsEditor.tsx   # Title, theme accent, ocean daylight presets
```

---

### 2. Desain Wireframe Admin Dashboard

#### A. Admin Overview & Inquiries (`/admin`)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ⚓ OCEAN PORTFOLIO ADMIN              [View Live 3D Site ↗]   [admin@site.com] ⎋ │
├───────────────┬─────────────────────────────────────────────────────────────────┤
│ ❖ Overview    │ Dashboard Overview                                              │
│ 📁 Projects   │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐           │
│ ✍ Journal     │ │  12 Projects  │ │  8 Articles   │ │  5 New Alerts │           │
│ 👤 About Me   │ │  10 Published │ │  6 Published  │ │  Inquiries    │           │
│ ✉ Messages(3) │ └───────────────┘ └───────────────┘ └───────────────┘           │
│ ⚙ Settings    │                                                                 │
│               │ Quick Actions:                                                  │
│               │ [+ New Project]  [+ Write Article]  [Edit Studio Bio]           │
│               │                                                                 │
│               │ Recent Contact Inquiries                                        │
│               │ ┌─────────────────────────────────────────────────────────────┐ │
│               │ │ From: Elena Rostova · elena@design.org · 2h ago    [Unread] │ │
│               │ │ "Looking to collaborate on our upcoming 3D brand campaign..."│
│               │ │ [Mark Read] [Delete]                                        │ │
│               │ └─────────────────────────────────────────────────────────────┘ │
└───────────────┴─────────────────────────────────────────────────────────────────┘
```

#### B. Projects Editor (`/admin/projects`)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📁 Projects Management                           [+ Add New Project]            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Filter: [All Categories ▾] [All Statuses ▾]                     🔍 Search...     │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │  ⠿  [Cover]  PROJECT TITLE            CATEGORY    YEAR    STATUS   ACTIONS  │ │
│ ├─────────────────────────────────────────────────────────────────────────────┤ │
│ │  ⠿  [Img]    Nordic Horizon Archive   Campaign    2026   Published [✎] [🗑]  │ │
│ │  ⠿  [Img]    Subsea Kinetic Pavilion  Interiors   2025   Published [✎] [🗑]  │ │
│ │  ⠿  [Img]    Luminescence Study       Still Life  2025   Draft     [✎] [🗑]  │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Schema Database Detail + Contoh Query

#### Koleksi Firestore

1. **`settings/general`** (Singleton Document)
   - `siteTitle`: string (max 80 chars)
   - `ownerName`: string (max 60 chars)
   - `tagline`: string (max 150 chars)
   - `accentColor`: string (hex format, e.g. `#14b8a6`)
   - `oceanTime`: enum (`"day"` | `"golden"` | `"night"`)
   - `updatedAt`: timestamp

2. **`about/profile`** (Singleton Document)
   - `fullName`: string
   - `headline`: string
   - `bio`: string
   - `avatarUrl`: string
   - `cvUrl`: string
   - `clients`: list of strings (max 20 items)
   - `processSteps`: list of maps `{ stepNumber: number, title: string, description: string }`
   - `socialLinks`: map `{ github?: string, linkedin?: string, instagram?: string, email?: string }`
   - `updatedAt`: timestamp

3. **`projects/{projectId}`** (Entity Documents)
   - `title`: string (1–100 chars)
   - `slug`: string (regex `^[a-z0-9-]+$`)
   - `category`: string (e.g., `"Campaign"`, `"Interiors"`, `"Still Life"`, `"Interactive"`)
   - `year`: number (e.g. 2026)
   - `client`: string
   - `summary`: string
   - `description`: string
   - `coverUrl`: string
   - `galleryUrls`: list of strings (max 8 URLs)
   - `order`: number (for drag-and-drop / ordering)
   - `isPublished`: boolean
   - `createdAt`: timestamp
   - `updatedAt`: timestamp

4. **`articles/{articleId}`** (Entity Documents)
   - `title`: string
   - `slug`: string
   - `coverUrl`: string
   - `summary`: string
   - `content`: string (Markdown / HTML content)
   - `tags`: list of strings
   - `readTimeMinutes`: number
   - `isPublished`: boolean
   - `publishedAt`: timestamp
   - `updatedAt`: timestamp

5. **`messages/{messageId}`** (Inquiry Documents)
   - `name`: string
   - `email`: string
   - `message`: string (max 2000 chars)
   - `isRead`: boolean
   - `createdAt`: timestamp

6. **`admins/{adminUid}`** (RBAC Authorization Documents)
   - `email`: string
   - `role`: `"admin"`
   - `createdAt`: timestamp

#### Contoh Query Firestore (TypeScript SDK)

```typescript
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 1. Fetch published projects sorted by custom order for 3D Gallery Island
export async function getPublishedProjects() {
  const q = query(
    collection(db, 'projects'),
    where('isPublished', '==', true),
    orderBy('order', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// 2. Submit a contact inquiry from Signal Island
export async function submitInquiry(payload: { name: string; email: string; message: string }) {
  return await addDoc(collection(db, 'messages'), {
    ...payload,
    isRead: false,
    createdAt: serverTimestamp(),
  });
}

// 3. Admin fetch all inquiries sorted by newest
export async function getAdminMessages() {
  const q = query(
    collection(db, 'messages'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
```

---

### 4. Contoh Code Skeleton (Auth + CRUD Projects)

#### A. Auth Context & Login Hook (`src/context/AuthContext.tsx`)

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
```

#### B. Projects CRUD Service (`src/services/projectsService.ts`)

```typescript
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProjectItem } from '@/types/content';

const COLLECTION_NAME = 'projects';

export async function fetchAllProjects(): Promise<ProjectItem[]> {
  const snap = await getDocs(collection(db, COLLECTION_NAME));
  return snap.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  } as ProjectItem));
}

export async function createProject(data: Omit<ProjectItem, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProject(id: string, updates: Partial<ProjectItem>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
```

---

### 5. API / Service Layer Documentation

| Operation | Service Method | Arguments | Returns | Security / Access |
|---|---|---|---|---|
| **Get Public Settings** | `fetchSiteSettings()` | None | `SiteSettings` | Public Read (`allow read: if true`) |
| **Get Studio Bio** | `fetchAboutProfile()` | None | `AboutProfile` | Public Read (`allow read: if true`) |
| **List Published Projects** | `fetchPublishedProjects()` | `category?: string` | `ProjectItem[]` | Public Read (`allow list: if resource.data.isPublished == true`) |
| **List All Projects (Admin)**| `fetchAllProjectsAdmin()` | None | `ProjectItem[]` | Admin Only (`isAdmin()`) |
| **Create Project** | `createProject(payload)` | `ProjectInput` | `{ id: string }` | Admin Only (`isAdmin()`) |
| **Update Project** | `updateProject(id, payload)`| `id: string, ProjectInput`| `void` | Admin Only (`isAdmin()`) |
| **Delete Project** | `deleteProject(id)` | `id: string` | `void` | Admin Only (`isAdmin()`) |
| **Submit Contact Message** | `sendContactMessage(data)`| `{ name, email, message }`| `{ id: string }` | Public Create (`allow create: if isValidMessage()`) |
| **List Inquiries (Admin)** | `fetchInquiriesAdmin()` | None | `MessageItem[]` | Admin Only (`isAdmin()`) |
| **Mark Inquiry Read** | `markInquiryRead(id, isRead)`| `id: string, boolean` | `void` | Admin Only (`isAdmin()`) |
| **Delete Inquiry** | `deleteInquiry(id)` | `id: string` | `void` | Admin Only (`isAdmin()`) |

---

### 6. Tech Stack Integration Plan (Frontend & Backend)

1. **Three.js & Canvas Layer**:
   - `WebGLRenderer` configured with `ACESFilmicToneMapping`, `SRGBColorSpace`, and `RoomEnvironment`.
   - Procedural sailboat made of 6 structural parts (`THREE.Group`): hull with carved wood texture, deck boards, pine mast, billowed canvas sail, brass deck lanterns, and wooden helm rudder.
   - Dynamic ocean surface with vertex wave displacement and water foam edge shader.
   - Island terrain meshes positioned at designated nautical coordinates with docking buoys and soft contact shadows.
2. **Kinematics & Controls Layer**:
   - Dual-input engine:
     - *Keyboard Mode*: Smooth acceleration, angular damping, and sea drift based on delta time (`THREE.MathUtils.damp`).
     - *Autopilot / Docking Mode*: Exponential damping camera and boat lerp toward selected island dock on click.
3. **UI & Sheet Overlay Layer**:
   - Built with Tailwind CSS and Framer Motion.
   - Docked bottom menu with minimal viewport intrusion (<15%).
   - Seamless slide-in panels when docked at an island, preserving full interactivity with close/dock-away actions.
4. **Backend & Persistence (Firebase)**:
   - Firebase Authentication for admin email/password login.
   - Firestore database with `firebase-blueprint.json` schema and ABAC security rules in `firestore.rules`.
   - Built-in fallback data guaranteeing that the 3D scene renders rich portfolio projects even prior to database seeding.
5. **Admin Workspace**:
   - Self-contained `/admin` route with clear visual hierarchy, table filters, drag-and-drop project sorting, and instant live preview links back to the 3D world.
