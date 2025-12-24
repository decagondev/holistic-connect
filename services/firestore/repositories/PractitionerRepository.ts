/**
 * Practitioner Repository Implementation
 * 
 * Concrete implementation of IPractitionerRepository using Firestore.
 * Handles all practitioner profile operations in the practitioners collection.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { IPractitionerRepository, ListPractitionersOptions } from '../interfaces/IPractitionerRepository';
import type {
  PractitionerDocument,
  CreatePractitionerProfileInput,
  UpdatePractitionerProfileInput,
} from '@/types/firestore';

/**
 * Practitioner Repository implementation
 */
export class PractitionerRepository implements IPractitionerRepository {
  private readonly firestore: Firestore;
  private readonly collectionName = 'practitioners';

  constructor(firestore: Firestore = db) {
    this.firestore = firestore;
  }

  /**
   * Create a new practitioner profile in Firestore
   */
  async createPractitionerProfile(
    input: CreatePractitionerProfileInput
  ): Promise<PractitionerDocument> {
    const practitionerRef = doc(this.firestore, this.collectionName, input.uid);
    const practitionerDoc = await getDoc(practitionerRef);

    if (practitionerDoc.exists()) {
      throw new Error(`Practitioner profile already exists for UID: ${input.uid}`);
    }

    const now = serverTimestamp();
    
    // Default values
    const defaultPricing = {
      initialConsultation: 10000, // $100.00 in cents
      followUpSession: 8000, // $80.00 in cents
      currency: 'USD',
    };

    const defaultAvailabilityRules = {
      timezone: 'America/New_York',
      workingHours: {
        monday: { start: '09:00', end: '17:00', enabled: true },
        tuesday: { start: '09:00', end: '17:00', enabled: true },
        wednesday: { start: '09:00', end: '17:00', enabled: true },
        thursday: { start: '09:00', end: '17:00', enabled: true },
        friday: { start: '09:00', end: '17:00', enabled: true },
        saturday: { start: '09:00', end: '17:00', enabled: false },
        sunday: { start: '09:00', end: '17:00', enabled: false },
      },
    };

    const practitionerData: PractitionerDocument = {
      uid: input.uid,
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL ?? null,
      bio: input.bio ?? 'No bio available.',
      specialties: input.specialties ?? [],
      pricing: input.pricing ?? defaultPricing,
      availabilityRules: input.availabilityRules ?? defaultAvailabilityRules,
      sessionDuration: input.sessionDuration ?? 60, // Default 60 minutes
      createdAt: now as any,
      updatedAt: now as any,
      isActive: true,
    };

    await setDoc(practitionerRef, practitionerData);

    // Fetch the created document to return with actual timestamps
    const createdDoc = await getDoc(practitionerRef);
    if (!createdDoc.exists()) {
      throw new Error('Failed to create practitioner profile');
    }

    return createdDoc.data() as PractitionerDocument;
  }

  /**
   * Get practitioner profile by UID
   */
  async getPractitioner(practitionerId: string): Promise<PractitionerDocument | null> {
    const practitionerRef = doc(this.firestore, this.collectionName, practitionerId);
    const practitionerDoc = await getDoc(practitionerRef);

    if (!practitionerDoc.exists()) {
      return null;
    }

    return practitionerDoc.data() as PractitionerDocument;
  }

  /**
   * Update practitioner profile
   */
  async updatePractitioner(
    practitionerId: string,
    input: UpdatePractitionerProfileInput
  ): Promise<PractitionerDocument> {
    const practitionerRef = doc(this.firestore, this.collectionName, practitionerId);
    const practitionerDoc = await getDoc(practitionerRef);

    if (!practitionerDoc.exists()) {
      throw new Error(`Practitioner profile not found for UID: ${practitionerId}`);
    }

    const updateData: Partial<PractitionerDocument> = {
      ...input,
      updatedAt: serverTimestamp() as any,
    };

    await updateDoc(practitionerRef, updateData);

    // Fetch the updated document
    const updatedDoc = await getDoc(practitionerRef);
    if (!updatedDoc.exists()) {
      throw new Error('Failed to update practitioner profile');
    }

    return updatedDoc.data() as PractitionerDocument;
  }

  /**
   * List practitioners with optional filters
   */
  async listPractitioners(options?: ListPractitionersOptions): Promise<PractitionerDocument[]> {
    const practitionersRef = collection(this.firestore, this.collectionName);
    let q = query(practitionersRef);

    // Apply filters
    if (options?.isActive !== undefined) {
      q = query(q, where('isActive', '==', options.isActive));
    }

    if (options?.specialty) {
      q = query(q, where('specialties', 'array-contains', options.specialty));
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'));

    // Apply pagination
    if (options?.startAfter) {
      const startAfterDoc = await getDoc(doc(this.firestore, this.collectionName, options.startAfter));
      if (startAfterDoc.exists()) {
        q = query(q, startAfter(startAfterDoc as QueryDocumentSnapshot));
      }
    }

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit));
    } else {
      // Default limit to prevent large queries
      q = query(q, limit(50));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as PractitionerDocument);
  }

  /**
   * Check if practitioner profile exists
   */
  async practitionerExists(practitionerId: string): Promise<boolean> {
    const practitionerRef = doc(this.firestore, this.collectionName, practitionerId);
    const practitionerDoc = await getDoc(practitionerRef);
    return practitionerDoc.exists();
  }
}

/**
 * Default instance of PractitionerRepository
 */
export const practitionerRepository = new PractitionerRepository();

