/**
 * usePractitionersList hook
 * 
 * Fetches a paginated or filtered list of practitioners from Firestore.
 */

'use client';

import { useState, useEffect } from 'react';
import { practitionerRepository } from '@/services/firestore/repositories/PractitionerRepository';
import type { PractitionerDocument } from '@/types/firestore';
import type { ListPractitionersOptions } from '@/services/firestore/interfaces/IPractitionerRepository';

/**
 * Hook return type
 */
interface UsePractitionersListReturn {
  /**
   * Array of practitioner documents
   */
  practitioners: PractitionerDocument[];
  
  /**
   * Whether the list is being loaded
   */
  loading: boolean;
  
  /**
   * Error message if loading failed
   */
  error: string | null;
  
  /**
   * Refresh the practitioners list
   */
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching a list of practitioners
 * 
 * @param options - Filter and pagination options
 * @returns {UsePractitionersListReturn} Practitioners array, loading state, error, and refresh function
 */
export function usePractitionersList(
  options?: ListPractitionersOptions
): UsePractitionersListReturn {
  const [practitioners, setPractitioners] = useState<PractitionerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPractitioners = async () => {
    setLoading(true);
    setError(null);

    try {
      const practitionersList = await practitionerRepository.listPractitioners(options);
      setPractitioners(practitionersList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load practitioners';
      setError(errorMessage);
      console.error('Error fetching practitioners list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPractitioners();
  }, [JSON.stringify(options)]); // Re-fetch when options change

  return {
    practitioners,
    loading,
    error,
    refresh: fetchPractitioners,
  };
}

