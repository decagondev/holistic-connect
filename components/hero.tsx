import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/50 text-accent-foreground text-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span>Trusted by 500+ practitioners</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 text-balance leading-tight">
              Nurture connections, streamline bookings
            </h1>

            <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
              A thoughtfully designed booking platform for holistic psychologists. Focus on healing while we handle
              scheduling, reminders, and client management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                <Link href="#demo">Watch Demo</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 p-8">
              <div className="h-full w-full bg-card rounded-xl shadow-2xl border border-border p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20"></div>
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-muted rounded mb-2"></div>
                    <div className="h-2 w-24 bg-muted/60 rounded"></div>
                  </div>
                </div>
                <div className="flex-1 bg-secondary rounded-lg p-4 space-y-3">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-5/6 bg-muted rounded"></div>
                  <div className="h-3 w-4/6 bg-muted rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-16 bg-primary/10 rounded"></div>
                  <div className="h-16 bg-primary/20 rounded"></div>
                  <div className="h-16 bg-primary/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
