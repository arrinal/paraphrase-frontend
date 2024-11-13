import { useAuth } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/utils/constants"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getUserSubscription, activateTrialSubscription, createCheckoutSession, checkUserSubscription } from "@/utils/api"
import type { Subscription } from "@/types/subscription"
import { AuthModal } from "@/components/auth/AuthModal"
import { useToast } from "@/context/ToastContext"
import { useSubscription } from "@/context/SubscriptionContext"

export default function PricingPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { refetchSubscription } = useSubscription()
  const [hasPro, setHasPro] = useState(false)

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const response = await checkUserSubscription()
      if (response.error) {
        showToast(response.error, "error");
        return;
      }
      setHasPro(response.hasPro)
    }

    fetchSubscriptionStatus()
  }, [])

  useEffect(() => {
    if (user) {
      getUserSubscription().then(response => {
        if (response.error) {
          showToast(response.error, "error");
        } else {
          setCurrentSubscription(response.data);
        }
      });
    }
  }, [user])

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsLoading(true)
    try {
      if (planId === 'trial') {
        const trialResult = await activateTrialSubscription();
        if (trialResult.error) {
          showToast(trialResult.error, 'error');
          return;
        }
        await refetchSubscription()
        router.push('/paraphrase')
      } else {
        const result = await createCheckoutSession(planId);
        if (result.error) {
          showToast(result.error, 'error');
          return;
        }
        if (result.url) {
          await refetchSubscription()
          router.push(result.url)
        }
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const hideTrialCard = hasPro

  return (
    <Layout>
      <div className="container py-12 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Start with a trial. No credit card required.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-3xl w-full">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_id === plan.id && 
                                currentSubscription?.status === 'active'
            const isPro = plan.id === 'pro'
            if (plan.id === 'trial' && hideTrialCard) {
              return null;
            }
            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col w-80 ${isPro ? 'border-primary' : ''}`}
              >
                {isPro && currentSubscription?.plan_id !== 'pro' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold mt-2">
                    {plan.price === 0 ? (
                      "Free"
                    ) : (
                      <>
                        ${plan.price}
                        <span className="text-base font-normal text-muted-foreground">
                          /month
                        </span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    onClick={() => handleSubscribe(plan.id)}
                    variant={isCurrentPlan ? "outline" : isPro ? "default" : "secondary"}
                    disabled={isCurrentPlan || isLoading}
                  >
                    {isCurrentPlan 
                      ? "Current Plan" 
                      : isLoading 
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                        : plan.id === 'trial' 
                          ? "Start Trial" 
                          : `Subscribe for $${plan.price}/month`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </Layout>
  )
} 