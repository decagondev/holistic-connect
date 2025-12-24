export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Set up your practitioner profile with your specialties, availability, and booking preferences.",
    },
    {
      number: "02",
      title: "Share Your Link",
      description: "Get a personalized booking link to share with clients via email, social media, or your website.",
    },
    {
      number: "03",
      title: "Receive Bookings",
      description: "Clients select available times and book instantly. You get notified and prepared for each session.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4 text-balance">
            Start booking in minutes
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Simple setup process to get your practice online and start accepting bookings right away.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
