export const STRIPE_PRODUCTS = {
  PREMIUM_MEMBERSHIP: {
    priceId: 'price_1RUqPXQaCuqnBFy3FWPpGant',
    name: 'Premium Membership',
    description: 'Access to all premium units and lessons',
    mode: 'subscription' as const
  }
} as const;