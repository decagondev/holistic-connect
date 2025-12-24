/**
 * Authentication types and interfaces for HolisticConnect
 * 
 * Defines user roles and extended user types that combine
 * Firebase User with application-specific properties.
 */

import type { User as FirebaseUser } from 'firebase/auth';

/**
 * User roles in the HolisticConnect platform
 */
export type UserRole = 'client' | 'practitioner';

/**
 * Extended user type that includes Firebase User properties
 * plus application-specific fields like role
 */
export interface AppUser extends FirebaseUser {
  /**
   * User's role in the platform (client or practitioner)
   */
  role?: UserRole;
  
  /**
   * User's display name (from Firebase or custom)
   */
  displayName?: string | null;
  
  /**
   * User's photo URL (from Firebase or custom)
   */
  photoURL?: string | null;
}

/**
 * Auth context state interface
 */
export interface AuthState {
  /**
   * Current authenticated user (null if not authenticated)
   */
  user: AppUser | null;
  
  /**
   * Whether auth state is currently being checked
   */
  loading: boolean;
  
  /**
   * User's role (derived from user.role or Firestore)
   */
  role: UserRole | null;
}

/**
 * Sign up form data
 */
export interface SignUpFormData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

/**
 * Sign in form data
 */
export interface SignInFormData {
  email: string;
  password: string;
}

