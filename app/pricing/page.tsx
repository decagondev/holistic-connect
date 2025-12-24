import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: 25,
      description: "Perfect for getting started with holistic wellness",
      features: [
        "30-minute consultation sessions",
        "Email support",
        "Basic session notes",
        "Mobile app access",
        "Secure video calls",
      ],
      cta: "Start Basic",
      popular: false,
    },
    {
      name: "Professional",
      price: 50,
      description: "Most popular choice for ongoing wellness journey",
      features: [
        "60-minute consultation sessions",
        "Priority email & chat support",
        "Detailed session notes & insights",
        "Mobile app access",
        "HD video calls with recording",
        "Personalized wellness plans",
        "Resource library access",
        "Progress tracking tools",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Premium",
      price: 100,
      description: "Comprehensive holistic care with dedicated support",
      features: [
        "90-minute consultation sessions",
        "24/7 priority support",
        "Comprehensive session documentation",
        "Mobile app access",
        "HD video calls with recording",
        "Custom holistic wellness programs",
        "Full resource library",
        "Advanced analytics & insights",
        "Direct practitioner messaging",
        "Monthly wellness check-ins",
      ],
      cta: "Go Premium",
      popular: false,
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="border-b border-border bg-gradient-to-b from-accent/30 to-background py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Choose Your Wellness Path
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">
                Flexible pricing plans designed to support your holistic health journey. All plans include secure
                booking, video consultations, and access to certified practitioners.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.popular ? "border-2 border-primary shadow-xl scale-105 md:scale-110 z-10" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">{plan.description}</CardDescription>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">/session</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check
                            className={`h-5 w-5 shrink-0 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-8">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg" asChild>
                      <Link href="/signup">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Trust Message */}
            <div className="text-center mt-16 max-w-2xl mx-auto">
              <p className="text-muted-foreground text-pretty">
                All plans include secure HIPAA-compliant sessions, flexible scheduling, and the ability to switch plans
                anytime. Start your wellness journey today with a certified holistic psychologist.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-border bg-muted/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Can I change my plan later?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                    prorate any differences.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Are sessions covered by insurance?</h3>
                  <p className="text-muted-foreground">
                    Many insurance providers cover holistic psychology services. We provide detailed receipts that you
                    can submit to your insurance company for potential reimbursement.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">What if I need to cancel a session?</h3>
                  <p className="text-muted-foreground">
                    You can cancel or reschedule sessions up to 24 hours in advance at no charge. Late cancellations may
                    be subject to a fee depending on your practitioner's policy.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">How do I book my first appointment?</h3>
                  <p className="text-muted-foreground">
                    Simply choose a plan, create your account, browse our certified practitioners, and select a time
                    that works for you. It's that easy!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
                Ready to Begin Your Wellness Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Join thousands of clients who have found balance and healing through holistic psychology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
