import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plan } from '@/types/subscription';
import { isIOSApp } from '@/utils/platform';
import { createCheckoutSession } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

interface PricingCardProps {
    plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
    const { showToast } = useToast();

    const handleSubscribe = async () => {
        try {
            if (isIOSApp() && plan.iosProductId) {
                // Trigger iOS in-app purchase
                window.webkit?.messageHandlers?.purchaseHandler?.postMessage({
                    productId: plan.iosProductId,
                    action: 'purchase'
                });
            } else {
                // Regular web checkout
                const response = await createCheckoutSession(plan.id);
                window.location.href = response.url;
            }
        } catch (error) {
            showToast(
                error instanceof Error ? error.message : 'Failed to start checkout',
                'error'
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-base font-normal text-muted-foreground">
                        /month
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button
                    onClick={handleSubscribe}
                    className="w-full"
                >
                    Get Started
                </Button>
            </CardContent>
        </Card>
    );
} 