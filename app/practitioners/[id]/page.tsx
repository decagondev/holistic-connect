/**
 * Practitioner Profile Page
 * 
 * Displays detailed information about a specific practitioner
 * and allows clients to book appointments.
 */

'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { usePractitioner } from '@/hooks/firestore/usePractitioner';
import { useParams } from 'next/navigation';
import { MapPin, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function PractitionerProfilePage() {
  const params = useParams();
  const practitionerId = params.id as string;
  const { practitioner, loading, error } = usePractitioner(practitionerId);

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
                  <Button size="lg" className="w-full">
                    Book Appointment
                  </Button>
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

