/**
 * useSignOut hook
 * 
 * Handles user sign out with loading and error states.
 * Uses toast notifications for user feedback.
 */

'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * Hook return type
 */
interface UseSignOutReturn {
  /**
   * Sign out current user
   */
  signOut: () => Promise<void>;
  
  /**
   * Whether sign out is in progress
   */
  loading: boolean;
  
  /**
   * Error message if sign out failed
   */
  error: string | null;
}

/**
 * Hook for signing out
 * 
 * @returns {UseSignOutReturn} Sign out function, loading state, and error
 */
export function useSignOut(): UseSignOutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut: authSignOut } = useAuth();
  const router = useRouter();

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authSignOut();
      toast.success('Signed out successfully');
      router.push('/'); // Redirect to home
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      const errorMessage = error.message || 'Failed to sign out. Please try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authSignOut, router]);

  return { signOut, loading, error };
}

