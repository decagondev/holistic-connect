/**
 * User Repository Interface
 * 
 * Defines the contract for user data operations in Firestore.
 * Follows SOLID principles: Interface Segregation and Dependency Inversion.
 */

import type { UserDocument, CreateUserProfileInput, UpdateUserProfileInput } from '@/types/firestore';

/**
 * Interface for user repository operations
 */
export interface IUserRepository {
  /**
   * Create a new user profile in Firestore
   * 
   * @param input - User profile data to create
   * @returns Promise resolving to the created user document
   * @throws Error if user already exists or creation fails
   */
  createUserProfile(input: CreateUserProfileInput): Promise<UserDocument>;

  /**
   * Get user profile by UID
   * 
   * @param uid - User's Firebase Auth UID
   * @returns Promise resolving to user document or null if not found
   */
  getUser(uid: string): Promise<UserDocument | null>;

  /**
   * Update user profile
   * 
   * @param uid - User's Firebase Auth UID
   * @param input - Partial user data to update
   * @returns Promise resolving to the updated user document
   * @throws Error if user not found or update fails
   */
  updateUser(uid: string, input: UpdateUserProfileInput): Promise<UserDocument>;

  /**
   * Check if user profile exists
   * 
   * @param uid - User's Firebase Auth UID
   * @returns Promise resolving to true if user exists, false otherwise
   */
  userExists(uid: string): Promise<boolean>;
}

