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
}

export interface Subscription {
  id: string;
  userId: number;
  planId: string;
  status: 'active' | 'canceled' | 'trial' | 'expired';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
} 