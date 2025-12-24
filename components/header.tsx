"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    if (href.startsWith("#")) return false // Hash links are never "active" in terms of page
    return pathname === href
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-foreground">HolisticConnect</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className={cn(
                "text-sm transition-colors relative",
                pathname === "/" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className={cn(
                "text-sm transition-colors relative",
                pathname === "/" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
              )}
            >
              How It Works
            </Link>
            <Link
              href="/practitioners"
              className={cn(
                "text-sm transition-colors relative",
                isActiveLink("/practitioners")
                  ? "text-primary font-medium after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              For Practitioners
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "text-sm transition-colors relative",
                isActiveLink("/pricing")
                  ? "text-primary font-medium after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
