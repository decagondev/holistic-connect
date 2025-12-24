/**
 * Practitioner Repository Interface
 * 
 * Defines the contract for practitioner data operations in Firestore.
 * Follows SOLID principles: Interface Segregation and Dependency Inversion.
 */

import type {
  PractitionerDocument,
  CreatePractitionerProfileInput,
  UpdatePractitionerProfileInput,
} from '@/types/firestore';

/**
 * Options for listing practitioners
 */
export interface ListPractitionersOptions {
  /**
   * Filter by active status
   */
  isActive?: boolean;
  
  /**
   * Filter by specialty (array-contains query)
   */
  specialty?: string;
  
  /**
   * Limit number of results
   */
  limit?: number;
  
  /**
   * Start after this document (for pagination)
   */
  startAfter?: string;
}

/**
 * Interface for practitioner repository operations
 */
export interface IPractitionerRepository {
  /**
   * Create a new practitioner profile in Firestore
   * 
   * @param input - Practitioner profile data to create
   * @returns Promise resolving to the created practitioner document
   * @throws Error if practitioner already exists or creation fails
   */
  createPractitionerProfile(input: CreatePractitionerProfileInput): Promise<PractitionerDocument>;

  /**
   * Get practitioner profile by UID
   * 
   * @param practitionerId - Practitioner's Firebase Auth UID
   * @returns Promise resolving to practitioner document or null if not found
   */
  getPractitioner(practitionerId: string): Promise<PractitionerDocument | null>;

  /**
   * Update practitioner profile
   * 
   * @param practitionerId - Practitioner's Firebase Auth UID
   * @param input - Partial practitioner data to update
   * @returns Promise resolving to the updated practitioner document
   * @throws Error if practitioner not found or update fails
   */
  updatePractitioner(
    practitionerId: string,
    input: UpdatePractitionerProfileInput
  ): Promise<PractitionerDocument>;

  /**
   * List practitioners with optional filters
   * 
   * @param options - Filter and pagination options
   * @returns Promise resolving to array of practitioner documents
   */
  listPractitioners(options?: ListPractitionersOptions): Promise<PractitionerDocument[]>;

  /**
   * Check if practitioner profile exists
   * 
   * @param practitionerId - Practitioner's Firebase Auth UID
   * @returns Promise resolving to true if practitioner exists, false otherwise
   */
  practitionerExists(practitionerId: string): Promise<boolean>;
}

