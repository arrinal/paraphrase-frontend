import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/context/ToastContext"
import { updateUserSettings, getUserSubscription, cancelSubscription } from "@/utils/api"
import type { Subscription } from "@/types/subscription"
import { SUBSCRIPTION_PLANS } from "@/utils/constants"
import { useRouter } from "next/router"
import { useSubscription } from "@/context/SubscriptionContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { refetchSubscription } = useSubscription()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await getUserSubscription();
        if (response.error) {
          console.error('Failed to load subscription:', response.error);
          return;
        }
        setSubscription(response.data);
      } catch (error) {
        console.error('Failed to load subscription:', error);
      }
    }

    if (user) {
      loadSubscription();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showToast("New passwords do not match", "error")
      return
    }

    setIsLoading(true)
    try {
      const response = await updateUserSettings({
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      })
      if (response?.error) {
        showToast(response.error, "error")
        return
      }
      showToast("Settings updated successfully", "success")
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to update settings",
        "error"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const currentPlan = subscription 
    ? SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.plan_id)
    : null

  const handleCancelPlan = async () => {
    setIsLoading(true)
    try {
      await cancelSubscription()
      const updatedSubscription = await getUserSubscription() // Fetch latest subscription data
      setSubscription(updatedSubscription.data) // Update local state
      showToast('Subscription cancelled successfully', 'success')
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to cancel subscription',
        'error'
      )
    } finally {
      setIsLoading(false)
      setShowCancelDialog(false)
    }
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Account Settings - Left Column */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Subscription - Right Column */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="font-medium">{currentPlan?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-medium ${
                      subscription.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {subscription.status === 'active' && subscription.cancel_at_period_end 
                        ? 'Cancels at period end'
                        : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>
                  {subscription?.plan_id !== 'trial' && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {subscription.cancel_at_period_end ? 'Access Until' : 'Renewal Date'}
                      </span>
                      <span className="font-medium">
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="pt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={subscription.plan_id === 'trial' 
                        ? () => router.push('/pricing')
                        : () => setShowCancelDialog(true)
                      }
                      disabled={isLoading || subscription.cancel_at_period_end}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {subscription.plan_id === 'trial' ? 'Upgrading...' : 'Canceling...'}
                        </>
                      ) : subscription.cancel_at_period_end ? (
                        'Cancellation Scheduled'
                      ) : subscription.plan_id === 'trial' ? (
                        'Upgrade Plan'
                      ) : (
                        'Cancel Plan'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You don't have an active subscription.
                  </p>
                  <Button
                    onClick={() => router.push('/pricing')}
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You will lose access to pro features at the end of your billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelPlan}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                'Yes, cancel subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  )
}
