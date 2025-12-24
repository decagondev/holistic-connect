/**
 * Tests for useSignIn hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useSignIn } from '../useSignIn';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('firebase/auth');
jest.mock('sonner');
jest.mock('next/navigation');

const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.MockedFunction<
  typeof signInWithEmailAndPassword
>;
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

describe('useSignIn', () => {
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

  it('should sign in successfully with email and password', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
    };

    mockSignInWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser as any,
      operationType: 'signIn' as any,
      providerId: null,
    });

    const { result } = renderHook(() => useSignIn());

    await result.current.signIn('test@example.com', 'password123');

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(mockToast.success).toHaveBeenCalledWith('Signed in successfully');
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

    mockSignInWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser as any,
      operationType: 'signIn' as any,
      providerId: null,
    });

    const { result } = renderHook(() => useSignIn());

    await result.current.signIn('test@example.com', 'password123');

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle invalid credentials error', async () => {
    const error = {
      code: 'auth/invalid-credential',
      message: 'Invalid credentials',
    };

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignIn());

    await result.current.signIn('test@example.com', 'wrongpassword');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Invalid email or password.');
      expect(result.current.error).toBe('Invalid email or password.');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle user not found error', async () => {
    const error = {
      code: 'auth/user-not-found',
      message: 'User not found',
    };

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignIn());

    await result.current.signIn('nonexistent@example.com', 'password123');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('No account found with this email.');
      expect(result.current.error).toBe('No account found with this email.');
    });
  });

  it('should handle network error', async () => {
    const error = {
      code: 'auth/network-request-failed',
      message: 'Network error',
    };

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignIn());

    await result.current.signIn('test@example.com', 'password123');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Network error. Please check your connection.');
      expect(result.current.error).toBe('Network error. Please check your connection.');
    });
  });

  it('should set loading state during sign in', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockSignInWithEmailAndPassword.mockReturnValueOnce(promise as any);

    const { result } = renderHook(() => useSignIn());

    const signInPromise = result.current.signIn('test@example.com', 'password123');

    expect(result.current.loading).toBe(true);

    resolvePromise!({
      user: { uid: 'test-uid' } as any,
      operationType: 'signIn' as any,
      providerId: null,
    });

    await signInPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});

