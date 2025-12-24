/**
 * Tests for useSignOut hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useSignOut } from '../useSignOut';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/hooks/useAuth');
jest.mock('sonner');
jest.mock('next/navigation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
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

describe('useSignOut', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sign out successfully', async () => {
    const mockSignOut = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-uid' } as any,
      loading: false,
      role: 'client',
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: mockSignOut,
      sendPasswordReset: jest.fn(),
    });

    const { result } = renderHook(() => useSignOut());

    await result.current.signOut();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith('Signed out successfully');
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle sign out error', async () => {
    const error = new Error('Sign out failed');
    const mockSignOut = jest.fn().mockRejectedValue(error);
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-uid' } as any,
      loading: false,
      role: 'client',
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: mockSignOut,
      sendPasswordReset: jest.fn(),
    });

    const { result } = renderHook(() => useSignOut());

    await result.current.signOut();

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Sign out failed');
      expect(result.current.error).toBe('Sign out failed');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should set loading state during sign out', async () => {
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    const mockSignOut = jest.fn().mockReturnValue(promise);
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-uid' } as any,
      loading: false,
      role: 'client',
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: mockSignOut,
      sendPasswordReset: jest.fn(),
    });

    const { result } = renderHook(() => useSignOut());

    const signOutPromise = result.current.signOut();

    expect(result.current.loading).toBe(true);

    resolvePromise!();
    await signOutPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});

