/**
 * Practitioner Dashboard Page
 * 
 * Displays practitioner's calendar, upcoming appointments, and client management.
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
import { Calendar, Clock, Users, Settings, Video } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function PractitionerDashboardPage() {
  return (
    <RequireAuth>
      <PractitionerDashboardContent />
    </RequireAuth>
  );
}

function PractitionerDashboardContent() {
  const { user } = useAuth();
  const { appointments, loading } = useAppointments({
    practitionerId: user?.uid || undefined,
    realtime: true,
  });

  // Separate upcoming and past appointments
  const now = new Date();
  const upcoming = appointments
    .filter((apt) => apt.startTime.toDate() >= now && apt.status !== 'cancelled')
    .sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis())
    .slice(0, 5); // Show next 5 appointments

  const pending = appointments.filter((apt) => apt.status === 'pending');
  const today = appointments.filter(
    (apt) =>
      format(apt.startTime.toDate(), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd') &&
      apt.status !== 'cancelled'
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Practitioner Dashboard</h1>
            <p className="text-muted-foreground">Manage your practice, appointments, and clients</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/practitioner/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{today.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pending.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{upcoming.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
              {upcoming.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No upcoming appointments scheduled.
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
                      <CardContent className="space-y-3">
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        )}
                        {appointment.meetingLink && appointment.status !== 'cancelled' && (
                          <div className={appointment.notes ? "pt-2 border-t" : ""}>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <a
                                href={appointment.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Video className="h-4 w-4 mr-2" />
                                {appointment.status === 'confirmed' ? 'Join Google Meet' : 'View Meeting Link'}
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}

