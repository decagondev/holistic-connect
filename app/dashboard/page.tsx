/**
 * Dashboard Page - Role-based redirect
 * 
 * Automatically redirects users to their appropriate dashboard based on their role.
 * - Clients → /client/dashboard
 * - Practitioners → /practitioner/dashboard
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/firestore/useUser';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardRedirect />
    </RequireAuth>
  );
}

function DashboardRedirect() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { user: userDoc, loading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait for both auth and user document to load
    if (!authLoading && !userLoading && authUser) {
      // Use role from user document (more reliable than AuthContext which defaults to 'client')
      const role = userDoc?.role || 'client';
      
      // Redirect based on role
      if (role === 'practitioner') {
        router.replace('/practitioner/dashboard');
      } else {
        router.replace('/client/dashboard');
      }
    }
  }, [authUser, userDoc, authLoading, userLoading, router]);

  // Show loading state while determining redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}

