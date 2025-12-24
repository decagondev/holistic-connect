/**
 * usePractitioner hook
 * 
 * Fetches a single practitioner profile by ID from Firestore.
 */

'use client';

import { useState, useEffect } from 'react';
import { practitionerRepository } from '@/services/firestore/repositories/PractitionerRepository';
import type { PractitionerDocument } from '@/types/firestore';

/**
 * Hook return type
 */
interface UsePractitionerReturn {
  /**
   * Practitioner document from Firestore
   */
  practitioner: PractitionerDocument | null;
  
  /**
   * Whether the practitioner profile is being loaded
   */
  loading: boolean;
  
  /**
   * Error message if loading failed
   */
  error: string | null;
  
  /**
   * Refresh the practitioner profile
   */
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching a practitioner profile by ID
 * 
 * @param practitionerId - Practitioner's Firebase Auth UID
 * @returns {UsePractitionerReturn} Practitioner document, loading state, error, and refresh function
 */
export function usePractitioner(practitionerId: string | null): UsePractitionerReturn {
  const [practitioner, setPractitioner] = useState<PractitionerDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPractitioner = async () => {
    if (!practitionerId) {
      setPractitioner(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const practitionerDoc = await practitionerRepository.getPractitioner(practitionerId);
      setPractitioner(practitionerDoc);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load practitioner profile';
      setError(errorMessage);
      console.error('Error fetching practitioner profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractitioner();
  }, [practitionerId]);

  return {
    practitioner,
    loading,
    error,
    refresh: fetchPractitioner,
  };
}

