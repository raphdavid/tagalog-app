import { useState } from 'react';
import { useSupabase } from '../utils/supabase';
import { STRIPE_PRODUCTS } from '../stripe-config';

export function useStripe() {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (priceId: string, mode: 'payment' | 'subscription') => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session');
      }

      // Check if the Stripe function URL is configured
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        throw new Error('Stripe integration is not configured. Please contact support.');
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000); // 10 second timeout

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/dashboard?checkout=success`,
          cancel_url: `${window.location.origin}/subscribe?checkout=canceled`,
          mode,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Payment processing is currently unavailable. Please try again later or contact support.');
        }
        
        const error = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(error.error || `Payment service error (${response.status})`);
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('Failed to create payment session. Please try again.');
      }

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err: any) {
      console.error('Stripe checkout error:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your internet connection and try again.');
      } else {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPremium = async () => {
    await createCheckoutSession(
      STRIPE_PRODUCTS.PREMIUM_MEMBERSHIP.priceId,
      STRIPE_PRODUCTS.PREMIUM_MEMBERSHIP.mode
    );
  };

  return {
    isLoading,
    error,
    subscribeToPremium,
  };
}