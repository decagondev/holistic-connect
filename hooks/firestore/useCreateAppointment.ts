/**
 * useCreateAppointment hook
 * 
 * Mutation hook for creating new appointments in Firestore.
 * Handles loading and error states with toast notifications.
 */

'use client';

import { useState, useCallback } from 'react';
import { appointmentRepository } from '@/services/firestore/repositories/AppointmentRepository';
import { toast } from 'sonner';
import type { AppointmentDocument } from '@/types/firestore';
import type { CreateAppointmentInput } from '@/types/firestore';

/**
 * Hook return type
 */
interface UseCreateAppointmentReturn {
  /**
   * Create a new appointment
   */
  createAppointment: (input: CreateAppointmentInput) => Promise<AppointmentDocument | null>;
  
  /**
   * Whether appointment creation is in progress
   */
  loading: boolean;
  
  /**
   * Error message if creation failed
   */
  error: string | null;
}

/**
 * Hook for creating appointments
 * 
 * @returns {UseCreateAppointmentReturn} Create function, loading state, and error
 */
export function useCreateAppointment(): UseCreateAppointmentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = useCallback(async (
    input: CreateAppointmentInput
  ): Promise<AppointmentDocument | null> => {
    setLoading(true);
    setError(null);

    try {
      const appointment = await appointmentRepository.createAppointment(input);
      toast.success('Appointment booked successfully!');
      return appointment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create appointment';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error creating appointment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createAppointment,
    loading,
    error,
  };
}

