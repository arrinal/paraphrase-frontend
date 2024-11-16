import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/AuthModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, UserCircle } from "lucide-react"
import { useSubscription } from '@/context/SubscriptionContext';

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { subscription, isLoading } = useSubscription()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const hasValidSubscription = subscription?.status === 'active'
  const shouldShowPricing = !user || !hasValidSubscription

  const navigationLinks = [
    user && {
      href: "/dashboard",
      label: "Dashboard"
    },
    user && hasValidSubscription && {
      href: "/paraphrase",
      label: "Paraphrase"
    },
    shouldShowPricing && {
      href: "/pricing",
      label: "Pricing"
    },
    user && {
      href: "/settings",
      label: "Settings"
    }
  ].filter(Boolean)

  const renderNavigation = !isLoading && (
    <nav className={`${user ? 'hidden md:flex' : 'flex'} items-center gap-6`}>
      {navigationLinks.map((link) => link && (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
            router.pathname === link.href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )

  const renderMobileMenu = (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {navigationLinks.map((link) => link && (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                router.pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Button 
              variant="ghost" 
              className="justify-start p-0 h-auto font-medium text-sm text-muted-foreground hover:text-primary"
              onClick={handleLogout}
            >
              Log out
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Fraz AI</span>
          </Link>
          {renderNavigation}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="md:block hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {renderMobileMenu}
            </>
          ) : (
            <Button onClick={() => setShowAuthModal(true)} variant="default">
              Sign In
            </Button>
          )}
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  )
}
