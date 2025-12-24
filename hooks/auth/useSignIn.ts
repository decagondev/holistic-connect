/**
 * useSignIn hook
 * 
 * Handles email/password sign in with loading and error states.
 * Uses toast notifications for user feedback.
 */

'use client';

import { useState, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { userRepository } from '@/services/firestore/repositories/UserRepository';

/**
 * Hook return type
 */
interface UseSignInReturn {
  /**
   * Sign in with email and password
   */
  signIn: (email: string, password: string) => Promise<void>;
  
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
 * Hook for signing in with email and password
 * 
 * @returns {UseSignInReturn} Sign in function, loading state, and error
 */
export function useSignIn(): UseSignInReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully');
      
      // Check for redirect parameter in URL
      const redirectParam = typeof window !== 'undefined' 
        ? new URLSearchParams(window.location.search).get('redirect')
        : null;
      
      // If redirect param exists, use it; otherwise redirect based on role
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        // Fetch user role to determine dashboard
        try {
          const userDoc = await userRepository.getUser(userCredential.user.uid);
          // Redirect to general dashboard which will route based on role
          router.push('/dashboard');
        } catch (error: any) {
          // Handle offline errors or other errors - default to client dashboard
          if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
            console.warn('Firestore is offline, redirecting to client dashboard');
          } else {
            console.error('Failed to fetch user role:', error);
          }
          router.push('/client/dashboard');
        }
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let errorMessage = 'Failed to sign in. Please try again.';

      // Handle specific Firebase auth errors
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { signIn, loading, error };
}

