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
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/firestore/useAppointments';
import { useUpdateAppointment } from '@/hooks/firestore/useUpdateAppointment';
import { Calendar, Clock, MapPin, Search, Plus, Video, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  const { updateAppointment, loading: updating } = useUpdateAppointment();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Separate upcoming and past appointments
  const now = new Date();
  const upcoming = appointments
    .filter((apt) => apt.startTime.toDate() >= now && apt.status !== 'cancelled')
    .sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());
  const past = appointments
    .filter((apt) => apt.startTime.toDate() < now || apt.status === 'cancelled')
    .sort((a, b) => b.startTime.toMillis() - a.startTime.toMillis());
  
  const confirmed = upcoming.filter((apt) => apt.status === 'confirmed');
  const pending = upcoming.filter((apt) => apt.status === 'pending');

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

  const handleCancelAppointment = async (appointmentId: string) => {
    setCancellingId(appointmentId);
    const result = await updateAppointment(appointmentId, {
      status: 'cancelled',
      cancelledBy: 'client',
      cancelledAt: Timestamp.now(),
    });
    setCancellingId(null);
    return result;
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your appointments and sessions</p>
          </div>
          <Button asChild>
            <Link href="/practitioners/browse">
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </Button>
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
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{upcoming.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Confirmed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{confirmed.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pending.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Upcoming Appointments
              </h2>
              {upcoming.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">No upcoming appointments.</p>
                    <Button asChild>
                      <Link href="/practitioners/browse">
                        <Search className="h-4 w-4 mr-2" />
                        Browse Practitioners
                      </Link>
                    </Button>
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
                        <div className={appointment.notes || appointment.meetingLink ? "pt-2 border-t space-y-2" : "space-y-2"}>
                          {appointment.meetingLink && appointment.status !== 'cancelled' && (
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
                                {appointment.status === 'confirmed' ? 'Join Video Meeting' : 'View Meeting Link'}
                              </a>
                            </Button>
                          )}
                          {appointment.status !== 'cancelled' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="w-full"
                                  disabled={updating && cancellingId === appointment.id}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Appointment
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this appointment? This action cannot be undone.
                                    The practitioner will be notified of the cancellation.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Yes, Cancel Appointment
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </CardContent>
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
                      {appointment.meetingLink && appointment.status === 'completed' && (
                        <CardContent>
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
                              View Meeting Link
                            </a>
                          </Button>
                        </CardContent>
                      )}
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

