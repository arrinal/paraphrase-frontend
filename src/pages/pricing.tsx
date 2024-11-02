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

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      getUserSubscription().then(setCurrentSubscription)
    }
  }, [user])

  // Effect to handle post-login redirect
  useEffect(() => {
    if (user && selectedPlanId) {
      router.push(`/checkout?plan=${selectedPlanId}`)
      setSelectedPlanId(null)
    }
  }, [user, selectedPlanId, router])

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      setSelectedPlanId(planId)
      setShowAuthModal(true)
      return
    }
    router.push(`/checkout?plan=${planId}`)
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card key={plan.id} className="relative">
              {currentSubscription?.planId === plan.id && (
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
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={currentSubscription?.planId === plan.id ? "outline" : "default"}
                >
                  {currentSubscription?.planId === plan.id
                    ? "Current Plan"
                    : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false)
          setSelectedPlanId(null)
        }}
      />
    </Layout>
  )
} 