/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const OWNER_EMAIL = 'mufidbac@gmail.com';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const isOwnerEmail = currentUser.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          const adminDocSnap = await getDoc(adminDocRef);

          if (adminDocSnap.exists() || isOwnerEmail) {
            setIsAdmin(true);
            // If owner email logged in, ensure admin record exists
            if (isOwnerEmail && !adminDocSnap.exists()) {
              try {
                await setDoc(adminDocRef, {
                  email: currentUser.email,
                  role: 'admin',
                  createdAt: new Date().toISOString(),
                });
              } catch (e) {
                console.warn('Could not bootstrap admin doc', e);
              }
            }
          } else {
            setIsAdmin(false);
          }
        } catch {
          // If security rules or network block, fall back to owner email check
          setIsAdmin(currentUser.email?.toLowerCase() === OWNER_EMAIL.toLowerCase());
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setAuthError(msg);
      throw err;
    }
  };

  const signUp = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      // Auto register as admin if owner email
      if (cred.user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
        try {
          await setDoc(doc(db, 'admins', cred.user.uid), {
            email: cred.user.email,
            role: 'admin',
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Could not create admin doc', e);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      setAuthError(msg);
      throw err;
    }
  };

  const signOut = async () => {
    setAuthError(null);
    await fbSignOut(auth);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        authError,
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
