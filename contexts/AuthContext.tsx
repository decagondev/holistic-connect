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
        // Cast to AppUser - role will be fetched from Firestore in Epic 4
        const appUser = firebaseUser as AppUser;
        setUser(appUser);
        
        // TODO: In Epic 4, fetch role from Firestore user document
        // For now, role will be set during signup and stored in Firestore
        // We'll fetch it in Epic 4 when we implement Firestore services
        setRole(null); // Will be populated from Firestore in Epic 4
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

