/**
 * useUser hook
 * 
 * Fetches the current user's profile from Firestore.
 * Uses the authenticated user's UID from AuthContext.
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userRepository } from '@/services/firestore/repositories/UserRepository';
import type { UserDocument } from '@/types/firestore';

/**
 * Hook return type
 */
interface UseUserReturn {
  /**
   * User document from Firestore
   */
  user: UserDocument | null;
  
  /**
   * Whether the user profile is being loaded
   */
  loading: boolean;
  
  /**
   * Error message if loading failed
   */
  error: string | null;
  
  /**
   * Refresh the user profile
   */
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching current user profile from Firestore
 * 
 * @returns {UseUserReturn} User document, loading state, error, and refresh function
 */
export function useUser(): UseUserReturn {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!authUser?.uid) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userDoc = await userRepository.getUser(authUser.uid);
      setUser(userDoc);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
      setError(errorMessage);
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authUser?.uid]);

  return {
    user,
    loading,
    error,
    refresh: fetchUser,
  };
}

