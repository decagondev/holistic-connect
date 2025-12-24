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
import { userRepository } from '@/services/firestore/repositories/UserRepository';
import { practitionerRepository } from '@/services/firestore/repositories/PractitionerRepository';
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

      // Create user profile in Firestore
      try {
        await userRepository.createUserProfile({
          uid: user.uid,
          email: user.email!,
          role,
          displayName: displayName || null,
          photoURL: user.photoURL || null,
          emailVerified: user.emailVerified,
        });

        // If practitioner, create practitioner profile
        if (role === 'practitioner') {
          try {
            await practitionerRepository.createPractitionerProfile({
              uid: user.uid,
              email: user.email!,
              displayName: displayName || user.email!.split('@')[0],
              photoURL: user.photoURL || null,
            });
          } catch (practitionerError) {
            // Log error but don't fail signup if practitioner profile creation fails
            console.error('Failed to create practitioner profile:', practitionerError);
            toast.warning('Account created, but practitioner profile setup failed. Please complete your profile later.');
          }
        }
      } catch (profileError) {
        // Log error but don't fail signup if profile creation fails
        console.error('Failed to create user profile:', profileError);
        toast.warning('Account created, but profile setup failed. Please complete your profile later.');
      }

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
      
      // Redirect to general dashboard which will route based on role
      router.push('/dashboard');
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

