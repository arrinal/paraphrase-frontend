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
import { UserCircle } from "lucide-react"
import { useSubscription } from '@/context/SubscriptionContext';

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { subscription, isLoading } = useSubscription()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const hasValidSubscription = subscription?.status === 'active'
  const shouldShowPricing = !user || !hasValidSubscription

  const renderNavigation = !isLoading && (
    <nav className="hidden md:flex items-center gap-6">
      {user && (
        <Link
          href="/dashboard"
          className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
            router.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          Dashboard
        </Link>
      )}

      {user && hasValidSubscription && (
        <Link
          href="/paraphrase"
          className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
            router.pathname === "/paraphrase" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          Paraphrase
        </Link>
      )}

      {shouldShowPricing && (
        <Link
          href="/pricing"
          className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
            router.pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          Pricing
        </Link>
      )}

      {user && (
        <Link
          href="/settings"
          className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
            router.pathname === "/settings" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          Settings
        </Link>
      )}
    </nav>
  )

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Fraz AI</span>
          </Link>
          {renderNavigation}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
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
