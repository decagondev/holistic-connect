/**
 * Practitioner Profile Page
 * 
 * Displays detailed information about a specific practitioner
 * and allows clients to book appointments.
 */

'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { usePractitioner } from '@/hooks/firestore/usePractitioner';
import { useCreateAppointment } from '@/hooks/firestore/useCreateAppointment';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Timestamp } from 'firebase/firestore';
import { addMinutes } from 'date-fns';

export default function PractitionerProfilePage() {
  const params = useParams();
  const practitionerId = params.id as string;
  const { practitioner, loading, error } = usePractitioner(practitionerId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const { createAppointment, loading: creating } = useCreateAppointment();
  const router = useRouter();

  // Generate time slots (every 30 minutes from 9 AM to 5 PM)
  const timeSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  const handleBookAppointment = async () => {
    if (!user || !practitioner || !selectedDate || !selectedTime) {
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    // Calculate end time based on session duration
    const endTime = addMinutes(startTime, practitioner.sessionDuration);

    const appointment = await createAppointment({
      clientId: user.uid,
      practitionerId: practitioner.uid,
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
      notes: notes || null,
    });

    if (appointment) {
      setDialogOpen(false);
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setNotes('');
      // Redirect to dashboard to see the appointment
      router.push('/dashboard');
    }
  };

  if (error) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error loading practitioner</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {loading ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-6">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : !practitioner ? (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Practitioner not found</h1>
            <p className="text-muted-foreground">
              The practitioner you're looking for doesn't exist or is no longer active.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={practitioner.photoURL || undefined} alt={practitioner.displayName} />
                    <AvatarFallback className="text-2xl">
                      {practitioner.displayName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{practitioner.displayName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4" />
                      {practitioner.availabilityRules.timezone}
                    </CardDescription>
                    {practitioner.isActive && (
                      <Badge variant="default" className="gap-2">
                        <CheckCircle2 className="h-3 w-3" />
                        Accepting new clients
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none mb-6">
                  <p className="text-muted-foreground leading-relaxed">{practitioner.bio}</p>
                </div>

                {practitioner.specialties.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {practitioner.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Initial Consultation</span>
                          <span className="font-semibold">
                            ${(practitioner.pricing.initialConsultation / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Follow-up Session</span>
                          <span className="font-semibold">
                            ${(practitioner.pricing.followUpSession / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Session Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">{practitioner.sessionDuration} minutes</p>
                    </CardContent>
                  </Card>
                </div>

                <RequireAuth>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Book Appointment</DialogTitle>
                        <DialogDescription>
                          Select a date and time for your appointment with {practitioner?.displayName}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Select Date</Label>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border mt-2"
                          />
                        </div>

                        {selectedDate && (
                          <div>
                            <Label>Select Time</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto">
                              {timeSlots.map((time) => (
                                <Button
                                  key={time}
                                  type="button"
                                  variant={selectedTime === time ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setSelectedTime(time)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Any additional information for the practitioner..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mt-2"
                            rows={3}
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={creating}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleBookAppointment}
                            disabled={!selectedDate || !selectedTime || creating}
                          >
                            {creating ? 'Booking...' : 'Confirm Booking'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </RequireAuth>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

