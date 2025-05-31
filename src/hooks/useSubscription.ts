import { useEffect, useState } from 'react';
import { useSupabase } from '../utils/supabase';
import { useAuth } from './useAuth';

export type SubscriptionTier = 'free' | 'basic' | 'premium' | null;

export function useSubscription() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [tier, setTier] = useState<SubscriptionTier>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subscription status
  useEffect(() => {
    const getSubscriptionStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setTier(data.subscription_tier as SubscriptionTier);
      } catch (error) {
        console.error('Error getting subscription status:', error);
        setTier('free');
      } finally {
        setIsLoading(false);
      }
    };

    getSubscriptionStatus();
  }, [user, supabase]);

  return {
    tier,
    isLoading
  };
}