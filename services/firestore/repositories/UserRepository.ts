/**
 * User Repository Implementation
 * 
 * Concrete implementation of IUserRepository using Firestore.
 * Handles all user profile operations in the users collection.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { IUserRepository } from '../interfaces/IUserRepository';
import type {
  UserDocument,
  CreateUserProfileInput,
  UpdateUserProfileInput,
} from '@/types/firestore';

/**
 * User Repository implementation
 */
export class UserRepository implements IUserRepository {
  private readonly firestore: Firestore;
  private readonly collectionName = 'users';

  constructor(firestore: Firestore = db) {
    this.firestore = firestore;
  }

  /**
   * Create a new user profile in Firestore
   */
  async createUserProfile(input: CreateUserProfileInput): Promise<UserDocument> {
    const userRef = doc(this.firestore, this.collectionName, input.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      throw new Error(`User profile already exists for UID: ${input.uid}`);
    }

    const now = serverTimestamp();
    const userData: UserDocument = {
      uid: input.uid,
      email: input.email,
      role: input.role,
      displayName: input.displayName ?? null,
      photoURL: input.photoURL ?? null,
      createdAt: now as any, // serverTimestamp() returns a placeholder
      updatedAt: now as any,
      emailVerified: input.emailVerified ?? false,
      phoneNumber: input.phoneNumber ?? null,
      bio: input.bio ?? null,
    };

    await setDoc(userRef, userData);

    // Fetch the created document to return with actual timestamps
    const createdDoc = await getDoc(userRef);
    if (!createdDoc.exists()) {
      throw new Error('Failed to create user profile');
    }

    return createdDoc.data() as UserDocument;
  }

  /**
   * Get user profile by UID
   */
  async getUser(uid: string): Promise<UserDocument | null> {
    const userRef = doc(this.firestore, this.collectionName, uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as UserDocument;
  }

  /**
   * Update user profile
   */
  async updateUser(uid: string, input: UpdateUserProfileInput): Promise<UserDocument> {
    const userRef = doc(this.firestore, this.collectionName, uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error(`User profile not found for UID: ${uid}`);
    }

    const updateData: Partial<UserDocument> = {
      ...input,
      updatedAt: serverTimestamp() as any,
    };

    await updateDoc(userRef, updateData);

    // Fetch the updated document
    const updatedDoc = await getDoc(userRef);
    if (!updatedDoc.exists()) {
      throw new Error('Failed to update user profile');
    }

    return updatedDoc.data() as UserDocument;
  }

  /**
   * Check if user profile exists
   */
  async userExists(uid: string): Promise<boolean> {
    const userRef = doc(this.firestore, this.collectionName, uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  }
}

/**
 * Default instance of UserRepository
 */
export const userRepository = new UserRepository();

