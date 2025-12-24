/**
 * Tests for useSignUp hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useSignUp } from '../useSignUp';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { userRepository } from '@/services/firestore/repositories/UserRepository';
import { practitionerRepository } from '@/services/firestore/repositories/PractitionerRepository';

// Mock dependencies
jest.mock('firebase/auth');
jest.mock('sonner');
jest.mock('next/navigation');
jest.mock('@/services/firestore/repositories/UserRepository');
jest.mock('@/services/firestore/repositories/PractitionerRepository');

const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.MockedFunction<
  typeof createUserWithEmailAndPassword
>;
const mockUpdateProfile = updateProfile as jest.MockedFunction<typeof updateProfile>;
const mockToast = toast as jest.Mocked<typeof toast>;
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);
const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;
const mockPractitionerRepository = practitionerRepository as jest.Mocked<typeof practitionerRepository>;

describe('useSignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock sendEmailVerification
    jest.spyOn(require('firebase/auth'), 'sendEmailVerification').mockResolvedValue(undefined);
  });

  it('should sign up successfully as client', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: false,
      photoURL: null,
    };

    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser as any,
      operationType: 'signIn' as any,
      providerId: null,
    });

    mockUpdateProfile.mockResolvedValueOnce(undefined);
    mockUserRepository.createUserProfile.mockResolvedValueOnce({
      uid: 'test-uid',
      email: 'test@example.com',
      role: 'client',
      displayName: 'Test User',
      photoURL: null,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      emailVerified: false,
      phoneNumber: null,
      bio: null,
    });

    const { result } = renderHook(() => useSignUp());

    await result.current.signUp('test@example.com', 'password123', 'Test User', 'client');

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' });
      expect(mockUserRepository.createUserProfile).toHaveBeenCalledWith({
        uid: 'test-uid',
        email: 'test@example.com',
        role: 'client',
        displayName: 'Test User',
        photoURL: null,
        emailVerified: false,
      });
      expect(mockPractitionerRepository.createPractitionerProfile).not.toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should sign up successfully as practitioner and create practitioner profile', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'practitioner@example.com',
      emailVerified: false,
      photoURL: null,
    };

    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser as any,
      operationType: 'signIn' as any,
      providerId: null,
    });

    mockUpdateProfile.mockResolvedValueOnce(undefined);
    mockUserRepository.createUserProfile.mockResolvedValueOnce({
      uid: 'test-uid',
      email: 'practitioner@example.com',
      role: 'practitioner',
      displayName: 'Dr. Test',
      photoURL: null,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      emailVerified: false,
      phoneNumber: null,
      bio: null,
    });

    mockPractitionerRepository.createPractitionerProfile.mockResolvedValueOnce({
      uid: 'test-uid',
      email: 'practitioner@example.com',
      displayName: 'Dr. Test',
      photoURL: null,
      bio: '',
      specialties: [],
      pricing: {
        initialConsultation: 0,
        followUpSession: 0,
        currency: 'USD',
      },
      availabilityRules: {
        timezone: 'UTC',
        workingHours: {},
      },
      sessionDuration: 60,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
      isActive: true,
    });

    const { result } = renderHook(() => useSignUp());

    await result.current.signUp('practitioner@example.com', 'password123', 'Dr. Test', 'practitioner');

    await waitFor(() => {
      expect(mockUserRepository.createUserProfile).toHaveBeenCalled();
      expect(mockPractitionerRepository.createPractitionerProfile).toHaveBeenCalledWith({
        uid: 'test-uid',
        email: 'practitioner@example.com',
        displayName: 'Dr. Test',
        photoURL: null,
      });
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle email already in use error', async () => {
    const error = {
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
    };

    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignUp());

    await result.current.signUp('existing@example.com', 'password123', 'Test User', 'client');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('An account with this email already exists.');
      expect(result.current.error).toBe('An account with this email already exists.');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle weak password error', async () => {
    const error = {
      code: 'auth/weak-password',
      message: 'Password is too weak',
    };

    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignUp());

    await result.current.signUp('test@example.com', '123', 'Test User', 'client');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Password is too weak. Please use a stronger password.');
      expect(result.current.error).toBe('Password is too weak. Please use a stronger password.');
    });
  });

  it('should continue signup even if profile creation fails', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: false,
      photoURL: null,
    };

    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser as any,
      operationType: 'signIn' as any,
      providerId: null,
    });

    mockUpdateProfile.mockResolvedValueOnce(undefined);
    mockUserRepository.createUserProfile.mockRejectedValueOnce(new Error('Profile creation failed'));

    const { result } = renderHook(() => useSignUp());

    await result.current.signUp('test@example.com', 'password123', 'Test User', 'client');

    await waitFor(() => {
      expect(mockToast.warning).toHaveBeenCalledWith(
        'Account created, but profile setup failed. Please complete your profile later.'
      );
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(result.current.loading).toBe(false);
    });
  });
});

