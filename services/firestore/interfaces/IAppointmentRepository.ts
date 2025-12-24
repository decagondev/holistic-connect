/**
 * Appointment Repository Interface
 * 
 * Defines the contract for appointment data operations in Firestore.
 * Follows SOLID principles: Interface Segregation and Dependency Inversion.
 */

import type {
  AppointmentDocument,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentStatus,
} from '@/types/firestore';
import type { Timestamp } from 'firebase/firestore';

/**
 * Options for listing appointments
 */
export interface ListAppointmentsOptions {
  /**
   * Filter by practitioner ID
   */
  practitionerId?: string;
  
  /**
   * Filter by client ID
   */
  clientId?: string;
  
  /**
   * Filter by status
   */
  status?: AppointmentStatus;
  
  /**
   * Filter by start time (appointments after this time)
   */
  startAfter?: Timestamp;
  
  /**
   * Filter by start time (appointments before this time)
   */
  startBefore?: Timestamp;
  
  /**
   * Limit number of results
   */
  limit?: number;
  
  /**
   * Start after this document ID (for pagination)
   */
  startAfterDocId?: string;
}

/**
 * Interface for appointment repository operations
 */
export interface IAppointmentRepository {
  /**
   * Create a new appointment in Firestore
   * 
   * @param input - Appointment data to create
   * @returns Promise resolving to the created appointment document
   * @throws Error if creation fails
   */
  createAppointment(input: CreateAppointmentInput): Promise<AppointmentDocument>;

  /**
   * Get appointment by ID
   * 
   * @param appointmentId - Appointment document ID
   * @returns Promise resolving to appointment document or null if not found
   */
  getAppointment(appointmentId: string): Promise<AppointmentDocument | null>;

  /**
   * Update appointment
   * 
   * @param appointmentId - Appointment document ID
   * @param input - Partial appointment data to update
   * @returns Promise resolving to the updated appointment document
   * @throws Error if appointment not found or update fails
   */
  updateAppointment(
    appointmentId: string,
    input: UpdateAppointmentInput
  ): Promise<AppointmentDocument>;

  /**
   * List appointments with optional filters
   * 
   * @param options - Filter and pagination options
   * @returns Promise resolving to array of appointment documents
   */
  listAppointments(options?: ListAppointmentsOptions): Promise<AppointmentDocument[]>;

  /**
   * Subscribe to appointments with realtime updates
   * 
   * @param options - Filter options
   * @param callback - Callback function called when appointments change
   * @returns Unsubscribe function
   */
  subscribeToAppointments(
    options: ListAppointmentsOptions,
    callback: (appointments: AppointmentDocument[]) => void
  ): () => void;

  /**
   * Cancel an appointment
   * 
   * @param appointmentId - Appointment document ID
   * @param cancelledBy - Who is cancelling ('client' or 'practitioner')
   * @returns Promise resolving to the updated appointment document
   */
  cancelAppointment(
    appointmentId: string,
    cancelledBy: 'client' | 'practitioner'
  ): Promise<AppointmentDocument>;
}

