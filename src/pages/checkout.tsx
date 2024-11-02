import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/utils/constants"
import { createCheckoutSession } from "@/utils/api"
import { useToast } from "@/context/ToastContext"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { plan: planId } = router.query

  // Check if running in iOS WebView
  const [isIOS, setIsIOS] = useState(false)
  useEffect(() => {
    // Simple iOS WebView detection
    setIsIOS(window.navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId)

  const handleCheckout = async () => {
    if (!selectedPlan) return

    setIsLoading(true)
    try {
      const response = await createCheckoutSession(selectedPlan.id, isIOS)
      
      if (isIOS) {
        // Handle iOS in-app purchase
        window.webkit?.messageHandlers?.purchaseHandler?.postMessage({
          productId: selectedPlan.id,
          ...response
        })
      } else {
        // Redirect to Stripe Checkout
        window.location.href = response.url
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to start checkout",
        "error"
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedPlan) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Plan Selected</h1>
            <Button onClick={() => router.push("/pricing")}>
              View Available Plans
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">{selectedPlan.name} Plan</h2>
              <p className="text-2xl font-bold">
                ${selectedPlan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Plan Features:</h3>
              <ul className="space-y-2">
                {selectedPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Subscribe for $${selectedPlan.price}/month`
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              You can cancel your subscription at any time
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 