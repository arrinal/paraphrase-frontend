import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Mock verification delay
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return (
            <Layout>
                <div className="container max-w-lg py-16">
                    <Card>
                        <CardContent className="flex flex-col items-center py-10 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p>Verifying your subscription...</p>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container max-w-lg py-16">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col items-center space-y-4">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <CardTitle>Subscription Activated!</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                        <p className="text-center text-muted-foreground">
                            Thank you for subscribing. Your account has been upgraded and you now have access to all features.
                        </p>
                        <Button onClick={() => router.push('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
} 