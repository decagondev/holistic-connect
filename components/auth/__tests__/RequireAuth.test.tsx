/**
 * Tests for RequireAuth component
 */

import { render, screen, waitFor } from '@testing-library/react';
import { RequireAuth } from '../RequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

// Mock dependencies
jest.mock('@/hooks/useAuth');
jest.mock('next/navigation');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('RequireAuth', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as any);
    mockUsePathname.mockReturnValue('/protected');
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'test-uid', email: 'test@example.com' } as any,
      loading: false,
      role: 'client',
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      sendPasswordReset: jest.fn(),
    });

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should show loading state while checking authentication', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      role: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      sendPasswordReset: jest.fn(),
    });

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      role: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      sendPasswordReset: jest.fn(),
    });

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=%2Fprotected');
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should use custom redirect path when provided', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      role: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      sendPasswordReset: jest.fn(),
    });

    render(
      <RequireAuth redirectTo="/custom-path">
        <div>Protected Content</div>
      </RequireAuth>
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=%2Fcustom-path');
    });
  });

  it('should render custom fallback when provided', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      role: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      sendPasswordReset: jest.fn(),
    });

    render(
      <RequireAuth fallback={<div>Custom Loading...</div>}>
        <div>Protected Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Checking authentication...')).not.toBeInTheDocument();
  });
});

