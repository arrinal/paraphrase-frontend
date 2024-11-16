import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Notice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Account information (name, email, password)</li>
                <li>Payment information (processed securely by our payment provider)</li>
                <li>Usage data and text content submitted for paraphrasing</li>
                <li>Technical information about your device and how you use our service</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your payments and manage your subscription</li>
                <li>Send you technical notices and support messages</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Storage and Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
                <li>Third parties with your consent</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to maintain your session and preferences. 
                You can control cookies through your browser settings.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                For any questions about this Privacy Notice, please contact us at support@frazai.com
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