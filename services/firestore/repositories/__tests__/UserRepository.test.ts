/**
 * Tests for UserRepository
 */

import { UserRepository } from '../UserRepository';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { UserDocument } from '@/types/firestore';

// Mock Firestore
jest.mock('firebase/firestore');
jest.mock('@/lib/firebase/client', () => ({
  db: {},
}));

const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;

describe('UserRepository', () => {
  let repository: UserRepository;
  const mockFirestore = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new UserRepository(mockFirestore);
  });

  describe('createUserProfile', () => {
    it('should create a new user profile', async () => {
      const input = {
        uid: 'test-uid',
        email: 'test@example.com',
        role: 'client' as const,
        displayName: 'Test User',
        photoURL: null,
        emailVerified: false,
      };

      const mockDocRef = { id: 'test-uid' };
      const mockDocSnapshot = {
        exists: () => false,
      };
      const createdDocSnapshot = {
        exists: () => true,
        data: () => ({
          uid: 'test-uid',
          email: 'test@example.com',
          role: 'client',
          displayName: 'Test User',
          photoURL: null,
          createdAt: { seconds: 1234567890, nanoseconds: 0 },
          updatedAt: { seconds: 1234567890, nanoseconds: 0 },
          emailVerified: false,
          phoneNumber: null,
          bio: null,
        }),
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc
        .mockResolvedValueOnce(mockDocSnapshot as any) // First call - check if exists
        .mockResolvedValueOnce(createdDocSnapshot as any); // Second call - get created doc

      const result = await repository.createUserProfile(input);

      expect(mockDoc).toHaveBeenCalledWith(mockFirestore, 'users', 'test-uid');
      expect(mockGetDoc).toHaveBeenCalledTimes(2);
      expect(mockSetDoc).toHaveBeenCalled();
      expect(result.uid).toBe('test-uid');
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe('client');
    });

    it('should throw error if user profile already exists', async () => {
      const input = {
        uid: 'existing-uid',
        email: 'existing@example.com',
        role: 'client' as const,
      };

      const mockDocRef = { id: 'existing-uid' };
      const mockDocSnapshot = {
        exists: () => true,
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      await expect(repository.createUserProfile(input)).rejects.toThrow(
        'User profile already exists for UID: existing-uid'
      );
    });
  });

  describe('getUser', () => {
    it('should return user document if exists', async () => {
      const uid = 'test-uid';
      const mockDocRef = { id: 'test-uid' };
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          uid: 'test-uid',
          email: 'test@example.com',
          role: 'client',
          displayName: 'Test User',
          photoURL: null,
          createdAt: { seconds: 1234567890, nanoseconds: 0 },
          updatedAt: { seconds: 1234567890, nanoseconds: 0 },
          emailVerified: false,
          phoneNumber: null,
          bio: null,
        }),
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await repository.getUser(uid);

      expect(result).not.toBeNull();
      expect(result?.uid).toBe('test-uid');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null if user document does not exist', async () => {
      const uid = 'non-existent-uid';
      const mockDocRef = { id: 'non-existent-uid' };
      const mockDocSnapshot = {
        exists: () => false,
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await repository.getUser(uid);

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const uid = 'test-uid';
      const input = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
      };

      const mockDocRef = { id: 'test-uid' };
      const existingDocSnapshot = {
        exists: () => true,
        data: () => ({
          uid: 'test-uid',
          email: 'test@example.com',
          role: 'client',
          displayName: 'Test User',
          photoURL: null,
          createdAt: { seconds: 1234567890, nanoseconds: 0 },
          updatedAt: { seconds: 1234567890, nanoseconds: 0 },
          emailVerified: false,
          phoneNumber: null,
          bio: null,
        }),
      };
      const updatedDocSnapshot = {
        exists: () => true,
        data: () => ({
          uid: 'test-uid',
          email: 'test@example.com',
          role: 'client',
          displayName: 'Updated Name',
          photoURL: null,
          createdAt: { seconds: 1234567890, nanoseconds: 0 },
          updatedAt: { seconds: 1234567891, nanoseconds: 0 },
          emailVerified: false,
          phoneNumber: null,
          bio: 'Updated bio',
        }),
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc
        .mockResolvedValueOnce(existingDocSnapshot as any) // Check if exists
        .mockResolvedValueOnce(updatedDocSnapshot as any); // Get updated doc

      const result = await repository.updateUser(uid, input);

      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(result.displayName).toBe('Updated Name');
      expect(result.bio).toBe('Updated bio');
    });

    it('should throw error if user document does not exist', async () => {
      const uid = 'non-existent-uid';
      const input = {
        displayName: 'Updated Name',
      };

      const mockDocRef = { id: 'non-existent-uid' };
      const mockDocSnapshot = {
        exists: () => false,
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      await expect(repository.updateUser(uid, input)).rejects.toThrow(
        'User profile not found for UID: non-existent-uid'
      );
    });
  });

  describe('userExists', () => {
    it('should return true if user exists', async () => {
      const uid = 'test-uid';
      const mockDocRef = { id: 'test-uid' };
      const mockDocSnapshot = {
        exists: () => true,
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await repository.userExists(uid);

      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const uid = 'non-existent-uid';
      const mockDocRef = { id: 'non-existent-uid' };
      const mockDocSnapshot = {
        exists: () => false,
      };

      mockDoc.mockReturnValue(mockDocRef as any);
      mockGetDoc.mockResolvedValueOnce(mockDocSnapshot as any);

      const result = await repository.userExists(uid);

      expect(result).toBe(false);
    });
  });
});

