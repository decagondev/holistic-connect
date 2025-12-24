"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

/**
 * Password reset form schema
 */
const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)
  const { sendPasswordReset } = useAuth()

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: PasswordResetFormValues) => {
    try {
      await sendPasswordReset(values.email)
      setEmailSent(true)
      toast.success("Password reset email sent! Check your inbox.")
    } catch (error) {
      const err = error as { code?: string; message?: string }
      const errorMessage = err.message || "Failed to send password reset email. Please try again."
      toast.error(errorMessage)
    }
  }

  if (emailSent) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />

        <section className="flex-1 flex items-center justify-center py-20 bg-gradient-to-b from-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <Card className="border-border shadow-lg">
                <CardHeader className="space-y-1 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
                  <CardDescription>
                    We've sent a password reset link to {form.getValues("email")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Click the link in the email to reset your password. If you don't see the email,
                    check your spam folder.
                  </p>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 flex items-center justify-center py-20 bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-2">
                Reset your password
              </h1>
              <p className="text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <Card className="border-border shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Forgot password</CardTitle>
                <CardDescription className="text-center">
                  We'll send you a password reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the email address associated with your account
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" size="lg">
                      Send reset link
                    </Button>
                  </form>
                </Form>

                <div className="mt-6">
                  <div className="text-center text-sm">
                    <Link href="/login" className="text-primary hover:underline font-medium inline-flex items-center">
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Back to login
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

