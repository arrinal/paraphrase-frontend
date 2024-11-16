import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RefundPolicyPage() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Subscription Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                Our subscription services are billed on a monthly basis. We generally do not provide 
                refunds for partial months of service. However, we may consider refunds in the following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Technical issues preventing service use</li>
                <li>Unauthorized charges</li>
                <li>Billing errors</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Refund Process</h2>
              <p className="text-gray-600 leading-relaxed">
                To request a refund, please:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Contact our support team at support@frazai.com</li>
                <li>Provide your account email and reason for refund</li>
                <li>Include any relevant details or documentation</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Processing Time</h2>
              <p className="text-gray-600 leading-relaxed">
                Refund requests are typically processed within 5-7 business days. The actual time to 
                receive your refund may vary depending on your payment method and financial institution.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Cancellation Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                You can cancel your subscription at any time through your account settings. Upon 
                cancellation:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Your subscription will remain active until the end of the current billing period</li>
                <li>No further charges will be made</li>
                <li>No partial refunds will be issued for unused time</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Trial Subscriptions</h2>
              <p className="text-gray-600 leading-relaxed">
                Free trial periods are not eligible for refunds. You will not be charged during the 
                trial period, and you can cancel at any time before the trial ends.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For any questions about our refund policy or to request a refund, please contact us at 
                support@frazai.com
              </p>
            </div>

            <p className="text-sm text-muted-foreground pt-8 border-t">
              Last updated: 11/13/2024
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 