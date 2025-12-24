/**
 * useSignUp hook
 * 
 * Handles email/password sign up with loading and error states.
 * Creates user profile in Firestore with role (prep for Epic 4).
 * Uses toast notifications for user feedback.
 */

'use client';

import { useState, useCallback } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types/auth';

/**
 * Hook return type
 */
interface UseSignUpReturn {
  /**
   * Sign up with email, password, display name, and role
   */
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  
  /**
   * Whether sign up is in progress
   */
  loading: boolean;
  
  /**
   * Error message if sign up failed
   */
  error: string | null;
}

/**
 * Hook for signing up with email and password
 * 
 * @returns {UseSignUpReturn} Sign up function, loading state, and error
 */
export function useSignUp(): UseSignUpReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signUp = useCallback(async (email: string, password: string, displayName: string, role: UserRole) => {
    setLoading(true);
    setError(null);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // TODO: In Epic 4, create user document in Firestore with role
      // For now, we'll just show success and redirect
      // The Firestore user document creation will be handled in Epic 4

      // Send email verification
      try {
        const { sendEmailVerification } = await import('firebase/auth');
        await sendEmailVerification(user);
        toast.success('Account created! Please check your email to verify your account.');
      } catch (verificationError) {
        // If email verification fails, still show success but warn user
        console.warn('Failed to send verification email:', verificationError);
        toast.success('Account created successfully!');
      }
      
      router.push('/'); // Redirect to home or dashboard
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let errorMessage = 'Failed to create account. Please try again.';

      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
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

  return { signUp, loading, error };
}

