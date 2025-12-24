/**
 * useSignInWithGoogle hook
 * 
 * Handles Google sign in with popup, loading and error states.
 * Uses toast notifications for user feedback.
 */

'use client';

import { useState, useCallback } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { userRepository } from '@/services/firestore/repositories/UserRepository';

/**
 * Hook return type
 */
interface UseSignInWithGoogleReturn {
  /**
   * Sign in with Google
   */
  signInWithGoogle: () => Promise<void>;
  
  /**
   * Whether sign in is in progress
   */
  loading: boolean;
  
  /**
   * Error message if sign in failed
   */
  error: string | null;
}

/**
 * Hook for signing in with Google
 * 
 * @returns {UseSignInWithGoogleReturn} Sign in function, loading state, and error
 */
export function useSignInWithGoogle(): UseSignInWithGoogleReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Redirect immediately - don't wait for Firestore operations
      toast.success('Signed in with Google successfully');
      
      // Check for redirect parameter in URL
      const redirectParam = typeof window !== 'undefined' 
        ? new URLSearchParams(window.location.search).get('redirect')
        : null;
      
      // Redirect immediately to dashboard (don't wait for Firestore)
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push('/dashboard');
      }

      // Handle Firestore operations in the background (don't block redirect)
      // This will be handled by AuthContext, but we can also try to create profile here
      // if it doesn't exist, without blocking the user
      userRepository.userExists(user.uid)
        .then((exists) => {
          if (!exists) {
            // Create user profile with default 'client' role for Google sign-in
            return userRepository.createUserProfile({
              uid: user.uid,
              email: user.email!,
              role: 'client', // Default to client role for Google sign-in
              displayName: user.displayName || null,
              photoURL: user.photoURL || null,
              emailVerified: user.emailVerified,
            });
          }
        })
        .catch((profileError) => {
          // Log error but don't show to user - AuthContext will handle it
          console.warn('Background profile creation failed (non-blocking):', profileError);
        });
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let errorMessage = 'Failed to sign in with Google. Please try again.';

      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled.';
        // Don't show error toast for user cancellation
        setError(null);
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please sign in with your email and password.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (error.code !== 'auth/popup-closed-by-user') {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { signInWithGoogle, loading, error };
}

