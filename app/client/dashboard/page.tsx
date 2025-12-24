/**
 * Client Dashboard Page
 * 
 * Displays client's upcoming appointments and appointment history.
 * Uses useAppointments hook with realtime updates.
 */

'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/firestore/useAppointments';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientDashboardPage() {
  return (
    <RequireAuth>
      <ClientDashboardContent />
    </RequireAuth>
  );
}

function ClientDashboardContent() {
  const { user } = useAuth();
  const { appointments, loading } = useAppointments({
    clientId: user?.uid || undefined,
    realtime: true,
  });

  // Separate upcoming and past appointments
  const now = new Date();
  const upcoming = appointments.filter(
    (apt) => apt.startTime.toDate() >= now && apt.status !== 'cancelled'
  );
  const past = appointments.filter(
    (apt) => apt.startTime.toDate() < now || apt.status === 'cancelled'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your appointments and sessions</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Upcoming Appointments
              </h2>
              {upcoming.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No upcoming appointments. Book one to get started!
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-2">
                              {format(appointment.startTime.toDate(), 'EEEE, MMMM d, yyyy')}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {format(appointment.startTime.toDate(), 'h:mm a')} -{' '}
                              {format(appointment.endTime.toDate(), 'h:mm a')}
                            </CardDescription>
                          </div>
                          <Badge variant={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      {appointment.notes && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Appointments */}
            {past.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
                <div className="space-y-4">
                  {past.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-2">
                              {format(appointment.startTime.toDate(), 'EEEE, MMMM d, yyyy')}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {format(appointment.startTime.toDate(), 'h:mm a')} -{' '}
                              {format(appointment.endTime.toDate(), 'h:mm a')}
                            </CardDescription>
                          </div>
                          <Badge variant={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

