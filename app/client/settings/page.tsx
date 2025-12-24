/**
 * Client Settings Page
 * 
 * Allows clients to update their profile information including:
 * - Display name
 * - Bio
 * - Phone number
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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/firestore/useUser';
import { userRepository } from '@/services/firestore/repositories/UserRepository';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const settingsSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function ClientSettingsPage() {
  return (
    <RequireAuth>
      <ClientSettingsContent />
    </RequireAuth>
  );
}

function ClientSettingsContent() {
  const { user: authUser } = useAuth();
  const { user: userDoc, loading, error } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      phoneNumber: '',
    },
  });

  // Load user data into form
  useEffect(() => {
    if (userDoc) {
      form.reset({
        displayName: userDoc.displayName || '',
        bio: userDoc.bio || '',
        phoneNumber: userDoc.phoneNumber || '',
      });
    }
  }, [userDoc, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    if (!authUser?.uid) return;

    setSaving(true);
    try {
      await userRepository.updateUser(authUser.uid, {
        displayName: values.displayName || null,
        bio: values.bio || null,
        phoneNumber: values.phoneNumber || null,
      });

      toast.success('Settings saved successfully!');
      router.push('/client/dashboard');
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

  if (error || !userDoc) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error loading settings</h1>
            <p className="text-muted-foreground mb-4">{error || 'User profile not found'}</p>
            <Button asChild>
              <Link href="/client/dashboard">Back to Dashboard</Link>
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
            <Link href="/client/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-serif font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
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
                          placeholder="Tell practitioners about yourself..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+1 (555) 123-4567" />
                      </FormControl>
                      <FormMessage />
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
                onClick={() => router.push('/client/dashboard')}
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

