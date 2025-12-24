import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-balance">
            Ready to transform your practice?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90 text-pretty leading-relaxed">
            Join hundreds of holistic psychologists who trust HolisticConnect to manage their bookings and grow their
            practice.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <Input type="email" placeholder="Enter your email" className="bg-primary-foreground text-foreground h-12" />
            <Button size="lg" variant="secondary" asChild className="h-12 whitespace-nowrap">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/80">
            Start your 14-day free trial today. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
