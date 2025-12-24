/**
 * Tests for useSignInWithGoogle hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSignInWithGoogle } from '../useSignInWithGoogle';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('firebase/auth');
jest.mock('sonner');
jest.mock('next/navigation');

const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<typeof signInWithPopup>;
const mockGoogleAuthProvider = GoogleAuthProvider as jest.MockedClass<typeof GoogleAuthProvider>;
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

describe('useSignInWithGoogle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location.search
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
      },
      writable: true,
    });
  });

  it('should sign in successfully with Google', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
    };

    const mockProvider = {
      addScope: jest.fn().mockReturnThis(),
    };

    mockGoogleAuthProvider.mockImplementation(() => mockProvider as any);
    mockSignInWithPopup.mockResolvedValueOnce({
      user: mockUser as any,
      operationType: 'signIn' as any,
      providerId: 'google.com',
    });

    const { result } = renderHook(() => useSignInWithGoogle());

    await result.current.signInWithGoogle();

    await waitFor(() => {
      expect(mockGoogleAuthProvider).toHaveBeenCalled();
      expect(mockProvider.addScope).toHaveBeenCalledWith('profile');
      expect(mockProvider.addScope).toHaveBeenCalledWith('email');
      expect(mockSignInWithPopup).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith('Signed in with Google successfully');
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle redirect parameter', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
    };

    Object.defineProperty(window, 'location', {
      value: {
        search: '?redirect=/dashboard',
      },
      writable: true,
    });

    const mockProvider = {
      addScope: jest.fn().mockReturnThis(),
    };

    mockGoogleAuthProvider.mockImplementation(() => mockProvider as any);
    mockSignInWithPopup.mockResolvedValueOnce({
      user: mockUser as any,
      operationType: 'signIn' as any,
      providerId: 'google.com',
    });

    const { result } = renderHook(() => useSignInWithGoogle());

    await result.current.signInWithGoogle();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle popup closed by user', async () => {
    const error = {
      code: 'auth/popup-closed-by-user',
      message: 'Popup closed',
    };

    const mockProvider = {
      addScope: jest.fn().mockReturnThis(),
    };

    mockGoogleAuthProvider.mockImplementation(() => mockProvider as any);
    mockSignInWithPopup.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignInWithGoogle());

    await result.current.signInWithGoogle();

    await waitFor(() => {
      expect(mockToast.error).not.toHaveBeenCalled();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle popup blocked error', async () => {
    const error = {
      code: 'auth/popup-blocked',
      message: 'Popup blocked',
    };

    const mockProvider = {
      addScope: jest.fn().mockReturnThis(),
    };

    mockGoogleAuthProvider.mockImplementation(() => mockProvider as any);
    mockSignInWithPopup.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignInWithGoogle());

    await result.current.signInWithGoogle();

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Popup was blocked. Please allow popups for this site.');
      expect(result.current.error).toBe('Popup was blocked. Please allow popups for this site.');
    });
  });

  it('should handle account exists with different credential error', async () => {
    const error = {
      code: 'auth/account-exists-with-different-credential',
      message: 'Account exists',
    };

    const mockProvider = {
      addScope: jest.fn().mockReturnThis(),
    };

    mockGoogleAuthProvider.mockImplementation(() => mockProvider as any);
    mockSignInWithPopup.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignInWithGoogle());

    await result.current.signInWithGoogle();

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'An account already exists with this email. Please sign in with your email and password.'
      );
      expect(result.current.error).toBe(
        'An account already exists with this email. Please sign in with your email and password.'
      );
    });
  });
});

