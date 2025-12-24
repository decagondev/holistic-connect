/**
 * Appointment Repository Implementation
 * 
 * Concrete implementation of IAppointmentRepository using Firestore.
 * Handles all appointment operations in the appointments collection.
 * Supports realtime subscriptions for live updates.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot,
  type Firestore,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type {
  IAppointmentRepository,
  ListAppointmentsOptions,
} from '../interfaces/IAppointmentRepository';
import type {
  AppointmentDocument,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '@/types/firestore';

/**
 * Appointment Repository implementation
 */
export class AppointmentRepository implements IAppointmentRepository {
  private readonly firestore: Firestore;
  private readonly collectionName = 'appointments';

  constructor(firestore: Firestore = db) {
    this.firestore = firestore;
  }

  /**
   * Create a new appointment in Firestore
   */
  async createAppointment(input: CreateAppointmentInput): Promise<AppointmentDocument> {
    const appointmentsRef = collection(this.firestore, this.collectionName);
    const now = serverTimestamp();

    const appointmentData: Omit<AppointmentDocument, 'id'> = {
      clientId: input.clientId,
      practitionerId: input.practitionerId,
      startTime: input.startTime,
      endTime: input.endTime,
      status: 'pending',
      createdAt: now as any,
      updatedAt: now as any,
      notes: input.notes ?? null,
      reminderSent: false,
      intakeFormCompleted: false,
    };

    const docRef = await addDoc(appointmentsRef, appointmentData);

    // Fetch the created document to return with actual timestamps and ID
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) {
      throw new Error('Failed to create appointment');
    }

    return {
      id: createdDoc.id,
      ...createdDoc.data(),
    } as AppointmentDocument;
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId: string): Promise<AppointmentDocument | null> {
    const appointmentRef = doc(this.firestore, this.collectionName, appointmentId);
    const appointmentDoc = await getDoc(appointmentRef);

    if (!appointmentDoc.exists()) {
      return null;
    }

    return {
      id: appointmentDoc.id,
      ...appointmentDoc.data(),
    } as AppointmentDocument;
  }

  /**
   * Update appointment
   */
  async updateAppointment(
    appointmentId: string,
    input: UpdateAppointmentInput
  ): Promise<AppointmentDocument> {
    const appointmentRef = doc(this.firestore, this.collectionName, appointmentId);
    const appointmentDoc = await getDoc(appointmentRef);

    if (!appointmentDoc.exists()) {
      throw new Error(`Appointment not found: ${appointmentId}`);
    }

    const updateData: Partial<AppointmentDocument> = {
      ...input,
      updatedAt: serverTimestamp() as any,
    };

    await updateDoc(appointmentRef, updateData);

    // Fetch the updated document
    const updatedDoc = await getDoc(appointmentRef);
    if (!updatedDoc.exists()) {
      throw new Error('Failed to update appointment');
    }

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as AppointmentDocument;
  }

  /**
   * List appointments with optional filters
   */
  async listAppointments(options?: ListAppointmentsOptions): Promise<AppointmentDocument[]> {
    const appointmentsRef = collection(this.firestore, this.collectionName);
    let q = query(appointmentsRef);

    // Apply filters
    if (options?.practitionerId) {
      q = query(q, where('practitionerId', '==', options.practitionerId));
    }

    if (options?.clientId) {
      q = query(q, where('clientId', '==', options.clientId));
    }

    if (options?.status) {
      q = query(q, where('status', '==', options.status));
    }

    if (options?.startAfter) {
      q = query(q, where('startTime', '>=', options.startAfter));
    }

    if (options?.startBefore) {
      q = query(q, where('startTime', '<=', options.startBefore));
    }

    // Order by start time (upcoming first)
    q = query(q, orderBy('startTime', 'asc'));

    // Apply pagination
    if (options?.startAfterDocId) {
      const startAfterDoc = await getDoc(
        doc(this.firestore, this.collectionName, options.startAfterDocId)
      );
      if (startAfterDoc.exists()) {
        q = query(q, startAfter(startAfterDoc as QueryDocumentSnapshot));
      }
    }

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit));
    } else {
      // Default limit to prevent large queries
      q = query(q, limit(100));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AppointmentDocument[];
  }

  /**
   * Subscribe to appointments with realtime updates
   */
  subscribeToAppointments(
    options: ListAppointmentsOptions,
    callback: (appointments: AppointmentDocument[]) => void
  ): () => void {
    const appointmentsRef = collection(this.firestore, this.collectionName);
    let q = query(appointmentsRef);

    // Apply filters (same as listAppointments)
    if (options.practitionerId) {
      q = query(q, where('practitionerId', '==', options.practitionerId));
    }

    if (options.clientId) {
      q = query(q, where('clientId', '==', options.clientId));
    }

    if (options.status) {
      q = query(q, where('status', '==', options.status));
    }

    if (options.startAfter) {
      q = query(q, where('startTime', '>=', options.startAfter));
    }

    if (options.startBefore) {
      q = query(q, where('startTime', '<=', options.startBefore));
    }

    // Order by start time
    q = query(q, orderBy('startTime', 'asc'));

    // Apply limit
    if (options.limit) {
      q = query(q, limit(options.limit));
    } else {
      q = query(q, limit(100));
    }

    // Set up realtime listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const appointments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AppointmentDocument[];
        callback(appointments);
      },
      (error) => {
        console.error('Error in appointments subscription:', error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(
    appointmentId: string,
    cancelledBy: 'client' | 'practitioner'
  ): Promise<AppointmentDocument> {
    const now = serverTimestamp();
    return this.updateAppointment(appointmentId, {
      status: 'cancelled',
      cancelledAt: now as any,
      cancelledBy,
    });
  }
}

/**
 * Default instance of AppointmentRepository
 */
export const appointmentRepository = new AppointmentRepository();

