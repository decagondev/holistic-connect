/**
 * useAppointments hook
 * 
 * Fetches appointments with optional filters and supports realtime updates.
 * Can filter by practitionerId, clientId, status, and time range.
 */

'use client';

import { useState, useEffect } from 'react';
import { appointmentRepository } from '@/services/firestore/repositories/AppointmentRepository';
import type { AppointmentDocument } from '@/types/firestore';
import type { ListAppointmentsOptions } from '@/services/firestore/interfaces/IAppointmentRepository';

/**
 * Hook options
 */
interface UseAppointmentsOptions extends ListAppointmentsOptions {
  /**
   * Whether to use realtime updates (default: false)
   */
  realtime?: boolean;
}

/**
 * Hook return type
 */
interface UseAppointmentsReturn {
  /**
   * Array of appointment documents
   */
  appointments: AppointmentDocument[];
  
  /**
   * Whether the appointments are being loaded
   */
  loading: boolean;
  
  /**
   * Error message if loading failed
   */
  error: string | null;
  
  /**
   * Refresh the appointments list (only works if not using realtime)
   */
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching appointments with optional realtime updates
 * 
 * @param options - Filter options and realtime flag
 * @returns {UseAppointmentsReturn} Appointments array, loading state, error, and refresh function
 */
export function useAppointments(
  options?: UseAppointmentsOptions
): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<AppointmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useRealtime = options?.realtime ?? false;
  const listOptions: ListAppointmentsOptions = {
    practitionerId: options?.practitionerId,
    clientId: options?.clientId,
    status: options?.status,
    startAfter: options?.startAfter,
    startBefore: options?.startBefore,
    limit: options?.limit,
    startAfterDocId: options?.startAfterDocId,
  };

  const fetchAppointments = async () => {
    if (useRealtime) {
      // Realtime updates are handled by the subscription
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const appointmentsList = await appointmentRepository.listAppointments(listOptions);
      setAppointments(appointmentsList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load appointments';
      setError(errorMessage);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useRealtime) {
      // Set up realtime subscription
      setLoading(true);
      setError(null);

      const unsubscribe = appointmentRepository.subscribeToAppointments(
        listOptions,
        (updatedAppointments) => {
          setAppointments(updatedAppointments);
          setLoading(false);
        }
      );

      return () => {
        unsubscribe();
      };
    } else {
      // One-time fetch
      fetchAppointments();
    }
  }, [JSON.stringify(listOptions), useRealtime]);

  return {
    appointments,
    loading,
    error,
    refresh: fetchAppointments,
  };
}

