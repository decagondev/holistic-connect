/**
 * Auth Context Provider
 * 
 * Provides authentication state and methods throughout the application.
 * Uses Firebase Auth's onAuthStateChanged to track user authentication state.
 * 
 * @see https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { userRepository } from '@/services/firestore/repositories/UserRepository';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { AppUser, AuthState, UserRole } from '@/types/auth';

/**
 * Auth context value interface
 */
interface AuthContextValue extends AuthState {
  /**
   * Sign in with email and password
   * Implemented in granular hooks
   */
  signInEmail: (email: string, password: string) => Promise<void>;
  
  /**
   * Sign up with email and password
   * Implemented in granular hooks
   */
  signUpEmail: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  
  /**
   * Sign in with Google
   * Implemented in granular hooks
   */
  signInGoogle: () => Promise<void>;
  
  /**
   * Sign out current user
   */
  signOut: () => Promise<void>;
  
  /**
   * Send password reset email
   */
  sendPasswordReset: (email: string) => Promise<void>;
  
  /**
   * Send email verification
   */
  sendEmailVerification: () => Promise<void>;
  
  /**
   * Reload user data from Firebase
   */
  reloadUser: () => Promise<void>;
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider component
 * 
 * Wraps the application and provides authentication state and methods.
 * Tracks Firebase auth state changes and updates context accordingly.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  /**
   * Reload user data from Firebase
   */
  const reloadUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser as AppUser);
    }
  }, []);

  /**
   * Send password reset email
   */
  const sendPasswordReset = useCallback(async (email: string) => {
    await firebaseSendPasswordResetEmail(auth, email);
  }, []);

  /**
   * Send email verification
   */
  const sendEmailVerification = useCallback(async () => {
    if (auth.currentUser) {
      await firebaseSendEmailVerification(auth.currentUser);
    }
  }, []);

  /**
   * Sign out current user
   */
  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
    setRole(null);
  }, []);

  /**
   * Placeholder methods - actual implementation in granular hooks
   * These are kept here for interface consistency but will be overridden
   * by the actual hook implementations
   */
  const signInEmail = useCallback(async (_email: string, _password: string) => {
    throw new Error('signInEmail should be called from useSignIn hook');
  }, []);

  const signUpEmail = useCallback(async (_email: string, _password: string, _displayName: string, _role: UserRole) => {
    throw new Error('signUpEmail should be called from useSignUp hook');
  }, []);

  const signInGoogle = useCallback(async () => {
    throw new Error('signInGoogle should be called from useSignInWithGoogle hook');
  }, []);

  /**
   * Listen to auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Cast to AppUser
        const appUser = firebaseUser as AppUser;
        setUser(appUser);
        
        // Set default role immediately (don't block on Firestore)
        setRole('client');
        
        // Fetch role from Firestore user document in the background
        // This won't block the UI - we default to 'client' and update if needed
        userRepository.getUser(firebaseUser.uid)
          .then((userDoc) => {
            if (userDoc) {
              // If user has a role, use it; otherwise keep default 'client'
              if (userDoc.role) {
                setRole(userDoc.role);
              } else {
                // Legacy user without role - try to update document (non-blocking)
                const userRef = doc(db, 'users', firebaseUser.uid);
                updateDoc(userRef, { role: 'client' }).catch((updateError) => {
                  console.warn('Failed to update legacy user role:', updateError);
                });
              }
            }
          })
          .catch((error: any) => {
            // Handle offline errors gracefully - role already set to 'client' by default
            if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
              console.warn('Firestore is offline, using default client role');
            } else {
              console.warn('Failed to fetch user role from Firestore (non-blocking):', error);
            }
            // Role is already set to 'client' by default, so no action needed
          });
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    role,
    signInEmail,
    signUpEmail,
    signInGoogle,
    signOut,
    sendPasswordReset,
    sendEmailVerification,
    reloadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * 
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


