import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSupabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'basic' | 'premium';

type SubscriptionState = {
  tier: SubscriptionTier;
  isLoading: boolean;
};

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [tier, setTier] = useState<SubscriptionTier>('free'); // Default to free
  const [isLoading, setIsLoading] = useState(false); // Start as not loading

  useEffect(() => {
    if (!user) {
      setTier('free');
      setIsLoading(false);
      return;
    }

    const getSubscriptionStatus = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching subscription status...');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('Error getting subscription status:', error);
          setTier('free'); // Fallback to free
        } else {
          setTier((data.subscription_tier as SubscriptionTier) || 'free');
        }
      } catch (error) {
        console.error('Error getting subscription status:', error);
        setTier('free'); // Fallback to free
      } finally {
        setIsLoading(false);
      }
    };

    getSubscriptionStatus();
  }, [user, supabase]);

  return (
    <SubscriptionContext.Provider value={{ tier, isLoading }}>
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