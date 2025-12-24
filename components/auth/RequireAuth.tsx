/**
 * RequireAuth Component
 * 
 * Client-side authentication guard that protects routes by checking
 * Firebase Auth state. Shows loading state while checking auth,
 * and redirects to login if user is not authenticated.
 * 
 * Usage:
 * ```tsx
 * <RequireAuth>
 *   <ProtectedContent />
 * </RequireAuth>
 * ```
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

interface RequireAuthProps {
  /**
   * Children to render when user is authenticated
   */
  children: React.ReactNode;
  
  /**
   * Optional redirect path after login (defaults to current path)
   */
  redirectTo?: string;
  
  /**
   * Optional fallback component to show while loading
   */
  fallback?: React.ReactNode;
}

/**
 * Component that requires authentication to render children
 * 
 * Shows loading state while checking auth, redirects to login if not authenticated,
 * and renders children if user is authenticated.
 */
export function RequireAuth({ 
  children, 
  redirectTo,
  fallback 
}: RequireAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        const loginUrl = '/login';
        const redirectPath = redirectTo || pathname;
        const url = redirectPath ? `${loginUrl}?redirect=${encodeURIComponent(redirectPath)}` : loginUrl;
        router.push(url);
      }
    }
  }, [user, loading, router, pathname, redirectTo]);

  // Show loading state while checking auth
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-8 w-8" />
            <p className="text-sm text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // If not authenticated, don't render children (redirect is in progress)
  if (!user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-8 w-8" />
            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      )
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

