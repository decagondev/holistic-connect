/**
 * useUpdateAppointment hook
 * 
 * Mutation hook for updating appointments in Firestore.
 * Handles loading and error states with toast notifications.
 */

'use client';

import { useState, useCallback } from 'react';
import { appointmentRepository } from '@/services/firestore/repositories/AppointmentRepository';
import { toast } from 'sonner';
import type { AppointmentDocument } from '@/types/firestore';
import type { UpdateAppointmentInput } from '@/types/firestore';

/**
 * Hook return type
 */
interface UseUpdateAppointmentReturn {
  /**
   * Update an appointment
   */
  updateAppointment: (appointmentId: string, input: UpdateAppointmentInput) => Promise<AppointmentDocument | null>;
  
  /**
   * Whether appointment update is in progress
   */
  loading: boolean;
  
  /**
   * Error message if update failed
   */
  error: string | null;
}

/**
 * Hook for updating appointments
 * 
 * @returns {UseUpdateAppointmentReturn} Update function, loading state, and error
 */
export function useUpdateAppointment(): UseUpdateAppointmentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAppointment = useCallback(async (
    appointmentId: string,
    input: UpdateAppointmentInput
  ): Promise<AppointmentDocument | null> => {
    setLoading(true);
    setError(null);

    try {
      const appointment = await appointmentRepository.updateAppointment(appointmentId, input);
      
      // Show success message based on what was updated
      if (input.status === 'confirmed') {
        toast.success('Appointment confirmed successfully!');
      } else if (input.status === 'cancelled') {
        toast.success('Appointment cancelled');
      } else {
        toast.success('Appointment updated successfully!');
      }
      
      return appointment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating appointment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateAppointment,
    loading,
    error,
  };
}

