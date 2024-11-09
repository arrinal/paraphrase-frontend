import { useAuth } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/utils/constants"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getUserSubscription } from "@/utils/api"
import type { Subscription } from "@/types/subscription"
import { AuthModal } from "@/components/auth/AuthModal"
import { useToast } from "@/context/ToastContext"

export default function PricingPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      getUserSubscription().then(setCurrentSubscription)
    }
  }, [user])

  const handleSubscribe = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsLoading(true)
    try {
      // For now, just use mock session
      router.push('/checkout/success?session_id=mock_session_6_pro')
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to start checkout',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const plan = SUBSCRIPTION_PLANS[0]
  
  const isCurrentPlan = Boolean(
    currentSubscription?.plan_id === 'pro' && 
    currentSubscription?.status === 'active'
  )

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative flex flex-col">
            {isCurrentPlan && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                Current Plan
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold mt-2">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6"
                onClick={handleSubscribe}
                variant={isCurrentPlan ? "outline" : "default"}
                disabled={isCurrentPlan || isLoading}
              >
                {isCurrentPlan 
                  ? "Current Plan" 
                  : isLoading 
                    ? "Processing..." 
                    : "Subscribe for $5/month"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </Layout>
  )
} 