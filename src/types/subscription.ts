export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    charactersPerRequest: number;
    requestsPerDay: number;
    bulkParaphrase: boolean;
  };
  iosProductId?: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  paddle_subscription_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'trial' | 'expired';
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
} 