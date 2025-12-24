/**
 * Firestore document types for HolisticConnect
 * 
 * These types define the structure of documents stored in Firestore collections.
 * All types include timestamps and follow the data model defined in firestore-model.md
 */

import type { Timestamp } from 'firebase/firestore';
import type { UserRole } from './auth';

/**
 * User document structure
 * Collection: users/{userId}
 */
export interface UserDocument {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  emailVerified: boolean;
  phoneNumber?: string | null;
  bio?: string | null;
}

/**
 * Practitioner document structure
 * Collection: practitioners/{practitionerId}
 */
export interface PractitionerDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  bio: string;
  specialties: string[];
  pricing: {
    initialConsultation: number; // Price in cents
    followUpSession: number; // Price in cents
    currency: string; // Currency code (e.g., "USD", "GBP")
  };
  availabilityRules: {
    timezone: string; // IANA timezone (e.g., "America/New_York")
    workingHours: {
      [dayOfWeek: string]: { // "monday", "tuesday", etc.
        start: string; // "09:00" in 24-hour format
        end: string; // "17:00" in 24-hour format
        enabled: boolean;
      };
    };
    blockedDates?: Timestamp[];
    minBookingNotice?: number; // Minimum hours notice required
    maxBookingAdvance?: number; // Maximum days in advance
  };
  sessionDuration: number; // Default session duration in minutes
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  rating?: number; // Average rating (0-5) - future feature
  reviewCount?: number; // Total number of reviews - future feature
}

/**
 * Appointment status types
 */
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

/**
 * Payment status types (future feature)
 */
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

/**
 * Appointment document structure
 * Collection: appointments/{appointmentId}
 */
export interface AppointmentDocument {
  id: string;
  clientId: string;
  practitionerId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: AppointmentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  cancelledAt?: Timestamp | null;
  cancelledBy?: 'client' | 'practitioner' | null;
  notes?: string | null;
  practitionerNotes?: string | null;
  reminderSent?: boolean;
  reminderSentAt?: Timestamp | null;
  intakeFormCompleted?: boolean;
  intakeFormId?: string | null;
  sessionId?: string | null;
  paymentStatus?: PaymentStatus | null;
  paymentIntentId?: string | null;
}

/**
 * Session document structure (future feature)
 * Collection: sessions/{sessionId}
 */
export interface SessionDocument {
  id: string;
  appointmentId: string;
  clientId: string;
  practitionerId: string;
  sessionDate: Timestamp;
  notes: string;
  clientNotes?: string | null;
  recordingUrl?: string | null;
  recordingTranscription?: string | null;
  goals?: string[];
  homework?: string | null;
  nextSessionDate?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDraft: boolean;
}

/**
 * Intake form field types
 */
export type IntakeFormFieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number';

/**
 * Intake form field structure
 */
export interface IntakeFormField {
  id: string;
  type: IntakeFormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/**
 * Intake form document structure
 * Collection: intakeForms/{formId}
 */
export interface IntakeFormDocument {
  id: string;
  practitionerId: string;
  appointmentId?: string | null;
  type: 'template' | 'submitted';
  title: string;
  description?: string | null;
  fields: IntakeFormField[];
  responses?: {
    [fieldId: string]: string | string[] | number | boolean;
  };
  submittedBy?: string | null;
  submittedAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

/**
 * Create user profile input (for repository methods)
 */
export interface CreateUserProfileInput {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  phoneNumber?: string | null;
}

/**
 * Update user profile input (for repository methods)
 */
export interface UpdateUserProfileInput {
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
}

/**
 * Create practitioner profile input (for repository methods)
 */
export interface CreatePractitionerProfileInput {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  bio?: string;
  specialties?: string[];
  pricing?: {
    initialConsultation: number;
    followUpSession: number;
    currency: string;
  };
  availabilityRules?: {
    timezone: string;
    workingHours: {
      [dayOfWeek: string]: {
        start: string;
        end: string;
        enabled: boolean;
      };
    };
    blockedDates?: Timestamp[];
    minBookingNotice?: number;
    maxBookingAdvance?: number;
  };
  sessionDuration?: number;
}

/**
 * Update practitioner profile input (for repository methods)
 */
export interface UpdatePractitionerProfileInput {
  displayName?: string;
  photoURL?: string | null;
  bio?: string;
  specialties?: string[];
  pricing?: {
    initialConsultation: number;
    followUpSession: number;
    currency: string;
  };
  availabilityRules?: {
    timezone: string;
    workingHours: {
      [dayOfWeek: string]: {
        start: string;
        end: string;
        enabled: boolean;
      };
    };
    blockedDates?: Timestamp[];
    minBookingNotice?: number;
    maxBookingAdvance?: number;
  };
  sessionDuration?: number;
  isActive?: boolean;
}

/**
 * Create appointment input (for repository methods)
 */
export interface CreateAppointmentInput {
  clientId: string;
  practitionerId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  notes?: string | null;
}

/**
 * Update appointment input (for repository methods)
 */
export interface UpdateAppointmentInput {
  status?: AppointmentStatus;
  cancelledAt?: Timestamp | null;
  cancelledBy?: 'client' | 'practitioner' | null;
  notes?: string | null;
  practitionerNotes?: string | null;
  reminderSent?: boolean;
  reminderSentAt?: Timestamp | null;
  intakeFormCompleted?: boolean;
  intakeFormId?: string | null;
  sessionId?: string | null;
  paymentStatus?: PaymentStatus | null;
  paymentIntentId?: string | null;
}

