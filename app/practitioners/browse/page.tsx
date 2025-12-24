/**
 * Browse Practitioners Page
 * 
 * Displays a list of active practitioners that clients can browse and book.
 * Uses usePractitionersList hook to fetch data from Firestore.
 */

'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePractitionersList } from '@/hooks/firestore/usePractitionersList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MapPin, Star, Calendar } from 'lucide-react';

export default function BrowsePractitionersPage() {
  const { practitioners, loading, error } = usePractitionersList({
    isActive: true,
    limit: 50,
  });

  if (error) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error loading practitioners</h1>
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

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-4">Find a Practitioner</h1>
          <p className="text-lg text-muted-foreground">
            Browse our network of holistic psychology practitioners
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : practitioners.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-4">No practitioners found</p>
            <p className="text-sm text-muted-foreground">
              Check back later or contact support if you're looking for a specific practitioner.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practitioners.map((practitioner) => (
              <Card key={practitioner.uid} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={practitioner.photoURL || undefined} alt={practitioner.displayName} />
                      <AvatarFallback>
                        {practitioner.displayName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{practitioner.displayName}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {practitioner.availabilityRules.timezone}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {practitioner.bio}
                  </p>

                  {practitioner.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {practitioner.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                      {practitioner.specialties.length > 3 && (
                        <Badge variant="secondary">+{practitioner.specialties.length - 3} more</Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold">
                        ${(practitioner.pricing.initialConsultation / 100).toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Initial consultation</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        ${(practitioner.pricing.followUpSession / 100).toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Follow-up session</p>
                    </div>
                  </div>

                  <Button asChild className="w-full" size="sm">
                    <Link href={`/practitioners/${practitioner.uid}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

