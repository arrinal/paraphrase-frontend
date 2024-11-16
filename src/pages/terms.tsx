import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using our services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                We provide an AI-powered text paraphrasing service that helps users rephrase content 
                while maintaining its original meaning.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">User Accounts</h2>
              <p className="text-gray-600 leading-relaxed">
                To access certain features of our service, you must create an account. You are responsible 
                for maintaining the confidentiality of your account information and for all activities 
                that occur under your account.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Subscription and Payments</h2>
              <p className="text-gray-600 leading-relaxed">
                Some features require a paid subscription. Payments are processed securely through our 
                payment processor. Subscription fees are non-refundable except as required by law.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">User Content</h2>
              <p className="text-gray-600 leading-relaxed">
                You retain ownership of any content you submit to our service. By using our service, 
                you grant us a license to process and store your content as necessary to provide our services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Prohibited Uses</h2>
              <p className="text-gray-600 leading-relaxed">
                You agree not to use our service for any unlawful purpose or in any way that could 
                damage, disable, or impair our service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Modifications to Service</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify or discontinue our service at any time, with or without notice.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                Our service is provided "as is" without any warranties. We shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For any questions about these Terms of Service, please contact us at support@frazai.com
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