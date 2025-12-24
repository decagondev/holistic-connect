/**
 * Practitioner Settings Page
 * 
 * Allows practitioners to update their profile information including:
 * - Display name and bio
 * - Specialties
 * - Pricing
 * - Session duration
 * - Active status
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { usePractitioner } from '@/hooks/firestore/usePractitioner';
import { practitionerRepository } from '@/services/firestore/repositories/PractitionerRepository';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

const settingsSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  initialConsultation: z.number().min(0, 'Price must be positive'),
  followUpSession: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  sessionDuration: z.number().min(15, 'Session duration must be at least 15 minutes').max(300, 'Session duration must be at most 300 minutes'),
  isActive: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function PractitionerSettingsPage() {
  return (
    <RequireAuth>
      <PractitionerSettingsContent />
    </RequireAuth>
  );
}

function PractitionerSettingsContent() {
  const { user } = useAuth();
  const { practitioner, loading, error } = usePractitioner(user?.uid || null);
  const router = useRouter();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [saving, setSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      initialConsultation: 0,
      followUpSession: 0,
      currency: 'USD',
      sessionDuration: 60,
      isActive: true,
    },
  });

  // Load practitioner data into form
  useEffect(() => {
    if (practitioner) {
      form.reset({
        displayName: practitioner.displayName,
        bio: practitioner.bio,
        initialConsultation: practitioner.pricing.initialConsultation / 100, // Convert from cents
        followUpSession: practitioner.pricing.followUpSession / 100, // Convert from cents
        currency: practitioner.pricing.currency,
        sessionDuration: practitioner.sessionDuration,
        isActive: practitioner.isActive,
      });
      setSpecialties(practitioner.specialties || []);
    }
  }, [practitioner, form]);

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const onSubmit = async (values: SettingsFormValues) => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      await practitionerRepository.updatePractitioner(user.uid, {
        displayName: values.displayName,
        bio: values.bio,
        specialties,
        pricing: {
          initialConsultation: Math.round(values.initialConsultation * 100), // Convert to cents
          followUpSession: Math.round(values.followUpSession * 100), // Convert to cents
          currency: values.currency,
        },
        sessionDuration: values.sessionDuration,
        isActive: values.isActive,
      });

      toast.success('Settings saved successfully!');
      router.push('/practitioner/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      toast.error(errorMessage);
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-64 mb-8" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !practitioner) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error loading settings</h1>
            <p className="text-muted-foreground mb-4">{error || 'Practitioner profile not found'}</p>
            <Button asChild>
              <Link href="/practitioner/dashboard">Back to Dashboard</Link>
            </Button>
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
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/practitioner/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-serif font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your practitioner profile and preferences</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update your display name and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="Tell clients about your background, approach, and expertise..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
              <CardDescription>Add or remove your areas of expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialty();
                    }
                  }}
                  placeholder="Add a specialty (e.g., Anxiety, Depression, Trauma)"
                  className="flex-1"
                />
                <Button type="button" onClick={addSpecialty} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="flex items-center gap-2">
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set your consultation and session rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="initialConsultation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Consultation</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {form.watch('currency') === 'USD' ? '$' : form.watch('currency')}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="followUpSession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Session</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {form.watch('currency') === 'USD' ? '$' : form.watch('currency')}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="USD" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Session Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
              <CardDescription>Configure your default session duration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sessionDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="300"
                        step="15"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Control whether you're accepting new clients</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Accepting New Clients</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        When enabled, clients can book appointments with you
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/practitioner/dashboard')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Footer />
    </main>
  );
}

