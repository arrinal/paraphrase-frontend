import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSubscription } from '@/utils/api';
import { useAuth } from './AuthContext';
import type { Subscription } from '@/types/subscription';

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  refetchSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getUserSubscription();
      if (response.error) {
        console.error('Failed to load subscription:', response.error);
        setSubscription(null);
      } else {
        setSubscription(response.data);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return (
    <SubscriptionContext.Provider 
      value={{ 
        subscription, 
        isLoading,
        refetchSubscription: fetchSubscription 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 