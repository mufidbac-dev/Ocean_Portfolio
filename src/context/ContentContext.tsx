/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  DEFAULT_ABOUT,
  DEFAULT_ARTICLES,
  DEFAULT_PROJECTS,
  DEFAULT_SETTINGS,
} from '../config/defaultData';
import { handleFirestoreError, OperationType } from '../lib/errorHandling';
import { db } from '../lib/firebase';
import {
  AboutProfile,
  ArticleItem,
  ContactMessage,
  ProjectItem,
  SiteSettings,
} from '../types/content';
import { useAuth } from './AuthContext';

interface ContentContextType {
  settings: SiteSettings;
  about: AboutProfile;
  projects: ProjectItem[];
  articles: ArticleItem[];
  messages: ContactMessage[];
  loading: boolean;
  saveSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  saveAbout: (newAbout: Partial<AboutProfile>) => Promise<void>;
  createProject: (project: Omit<ProjectItem, 'id'>) => Promise<string>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (orderedProjects: ProjectItem[]) => Promise<void>;
  createArticle: (article: Omit<ArticleItem, 'id'>) => Promise<string>;
  updateArticle: (id: string, updates: Partial<ArticleItem>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  sendMessage: (msg: { name: string; email: string; message: string }) => Promise<void>;
  markMessageRead: (id: string, isRead: boolean) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [about, setAbout] = useState<AboutProfile>(DEFAULT_ABOUT);
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Settings listener
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'general'),
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snap.data() } as SiteSettings);
        }
      },
      (err) => {
        console.warn('Settings snapshot note:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // 2. About profile listener
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'about', 'profile'),
      (snap) => {
        if (snap.exists()) {
          setAbout({ ...DEFAULT_ABOUT, ...snap.data() } as AboutProfile);
        }
      },
      (err) => {
        console.warn('About snapshot note:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // 3. Projects listener (with resilient client-side sort)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        if (!snap.empty) {
          const list: ProjectItem[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ProjectItem);
          });
          list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setProjects(list);
        }
      },
      (err) => {
        console.warn('Projects snapshot note:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // 4. Articles listener
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'articles'),
      (snap) => {
        if (!snap.empty) {
          const list: ArticleItem[] = [];
          snap.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ArticleItem);
          });
          list.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
          setArticles(list);
        }
      },
      (err) => {
        console.warn('Articles snapshot note:', err.message);
      }
    );
    return () => unsub();
  }, []);

  // 5. Messages listener (only when admin is logged in)
  useEffect(() => {
    if (!isAdmin) {
      setMessages([]);
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'messages'),
      (snap) => {
        const list: ContactMessage[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as ContactMessage);
        });
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setMessages(list);
      },
      (err) => {
        console.warn('Messages snapshot note:', err.message);
      }
    );
    return () => unsub();
  }, [isAdmin]);

  // Operations with optimistic update
  const saveSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    setSettings(merged);
    const path = 'settings/general';
    try {
      await setDoc(doc(db, 'settings', 'general'), merged, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const saveAbout = async (newAbout: Partial<AboutProfile>) => {
    const merged = { ...about, ...newAbout, updatedAt: new Date().toISOString() };
    setAbout(merged);
    const path = 'about/profile';
    try {
      await setDoc(doc(db, 'about', 'profile'), merged, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const createProject = async (project: Omit<ProjectItem, 'id'>): Promise<string> => {
    const payload = {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const path = 'projects';
    try {
      const docRef = await addDoc(collection(db, 'projects'), payload);
      setProjects((prev) => [...prev, { id: docRef.id, ...payload }]);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>) => {
    const payload = { ...updates, updatedAt: new Date().toISOString() };
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...payload } : p))
    );
    const path = `projects/${id}`;
    try {
      await updateDoc(doc(db, 'projects', id), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const reorderProjects = async (orderedProjects: ProjectItem[]) => {
    setProjects(orderedProjects);
    try {
      for (let i = 0; i < orderedProjects.length; i++) {
        const item = orderedProjects[i];
        if (item.order !== i + 1) {
          await updateDoc(doc(db, 'projects', item.id), {
            order: i + 1,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.warn('Reorder batch sync warning:', err);
    }
  };

  const createArticle = async (article: Omit<ArticleItem, 'id'>): Promise<string> => {
    const payload = {
      ...article,
      publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
    const path = 'articles';
    try {
      const docRef = await addDoc(collection(db, 'articles'), payload);
      setArticles((prev) => [...prev, { id: docRef.id, ...payload }]);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateArticle = async (id: string, updates: Partial<ArticleItem>) => {
    const payload = { ...updates, updatedAt: new Date().toISOString() };
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...payload } : a))
    );
    const path = `articles/${id}`;
    try {
      await updateDoc(doc(db, 'articles', id), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    const path = `articles/${id}`;
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const sendMessage = async (msg: { name: string; email: string; message: string }) => {
    const payload = {
      name: msg.name.trim(),
      email: msg.email.trim(),
      message: msg.message.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const path = 'messages';
    try {
      await addDoc(collection(db, 'messages'), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const markMessageRead = async (id: string, isRead: boolean) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead } : m))
    );
    const path = `messages/${id}`;
    try {
      await updateDoc(doc(db, 'messages', id), { isRead });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const path = `messages/${id}`;
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        settings,
        about,
        projects,
        articles,
        messages,
        loading,
        saveSettings,
        saveAbout,
        createProject,
        updateProject,
        deleteProject,
        reorderProjects,
        createArticle,
        updateArticle,
        deleteArticle,
        sendMessage,
        markMessageRead,
        deleteMessage,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextType {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return ctx;
}
