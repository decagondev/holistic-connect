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
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (role === 'practitioner') {
        router.replace('/practitioner/dashboard');
      } else {
        // Default to client dashboard (including if role is null/undefined)
        router.replace('/client/dashboard');
      }
    }
  }, [user, role, loading, router]);

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

