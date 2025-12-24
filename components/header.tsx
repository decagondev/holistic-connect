"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { useSignOut } from "@/hooks/auth/useSignOut"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User as UserIcon, Settings } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { signOut, loading: signOutLoading } = useSignOut()

  const isActiveLink = (href: string) => {
    if (href.startsWith("#")) return false // Hash links are never "active" in terms of page
    return pathname === href
  }

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return "U"
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
            {loading ? (
              // Show loading state while checking auth
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              // Show user menu when logged in
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    disabled={signOutLoading}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{signOutLoading ? "Signing out..." : "Sign out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Show login/signup buttons when not logged in
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
