import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useStripe } from '../hooks/useStripe';

const SubscribePage = () => {
  const { tier } = useSubscription();
  const { subscribeToPremium, isLoading, error } = useStripe();
  
  const handleSubscribe = async () => {
    try {
      await subscribeToPremium();
    } catch (err) {
      // Error is handled by useStripe hook
      console.error('Subscription error:', err);
    }
  };

  const premiumPlan = {
    id: 'premium',
    name: 'Premium',
    price: '$5.00',
    period: 'month',
    features: [
      'Access to all premium units and lessons',
      'Ad-free experience',
      'Practice exercises',
      'Progress tracking',
      'Pronunciation feedback',
      'Offline learning mode',
      'Personalized learning path',
      'Priority support',
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Premium Membership</h1>
        <p className="text-gray-600 mt-2">
          Unlock the full potential of your Tagalog learning journey
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-error-50 text-error-700 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      {tier === 'premium' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-blue-light rounded-lg p-6 text-center mb-8"
        >
          <h2 className="text-xl font-semibold mb-2">You're already a Premium member!</h2>
          <p>Enjoy your premium benefits and happy learning!</p>
        </motion.div>
      ) : (
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-accent-peach text-gray-800 py-1 px-4 text-sm font-medium">
              Best Value
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-primary-600">{premiumPlan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{premiumPlan.price}</span>
                <span className="text-gray-600">/{premiumPlan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {premiumPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-4">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <div className="max-w-lg mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">What's included in the Premium membership?</h3>
              <p className="text-gray-600">Premium membership gives you unlimited access to all lessons, premium features, and learning resources. You'll also get priority support and ad-free experience.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your access will remain active until the end of your current billing period.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Is my payment secure?</h3>
              <p className="text-gray-600">Yes, all payments are processed securely through Stripe, a leading payment processor that uses bank-level encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscribePage;