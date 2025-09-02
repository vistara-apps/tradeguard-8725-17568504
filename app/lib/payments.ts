/**
 * Payment processing utilities for TradeGuard
 */
import { Redis } from '@upstash/redis';

// Initialize Redis client from environment variables
const redis = Redis.fromEnv();

// Payment plans
export const PAYMENT_PLANS = {
  SINGLE_CALCULATION: {
    id: 'single_calculation',
    name: 'Single Calculation',
    price: 0.001, // ETH
    description: 'Access to a single advanced calculation',
    features: ['Leverage Impact Simulator'],
    duration: 0, // One-time use
  },
  DAILY_PASS: {
    id: 'daily_pass',
    name: 'Daily Pass',
    price: 0.003, // ETH
    description: 'Unlimited calculations for 24 hours',
    features: ['Leverage Impact Simulator', 'Unlimited Calculations', 'Save Parameters'],
    duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  WEEKLY_PASS: {
    id: 'weekly_pass',
    name: 'Weekly Pass',
    price: 0.01, // ETH
    description: 'Unlimited calculations for 7 days',
    features: ['Leverage Impact Simulator', 'Unlimited Calculations', 'Save Parameters', 'Historical Analysis'],
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
};

/**
 * Record a payment in Redis
 * @param userId User ID
 * @param planId Plan ID
 * @param amount Amount paid in ETH
 * @param txHash Transaction hash
 * @returns Promise<boolean> Success status
 */
export async function recordPayment(
  userId: string,
  planId: string,
  amount: number,
  txHash: string
): Promise<boolean> {
  try {
    const payment = {
      userId,
      planId,
      amount,
      txHash,
      timestamp: Date.now(),
    };
    
    // Save payment record
    const paymentKey = `payment:${userId}:${txHash}`;
    await redis.hset(paymentKey, payment);
    
    // Add to user's payment list
    await redis.sadd(`user:${userId}:payments`, paymentKey);
    
    // Update user's subscription status
    const plan = PAYMENT_PLANS[planId as keyof typeof PAYMENT_PLANS];
    if (plan && plan.duration > 0) {
      const expiresAt = Date.now() + plan.duration;
      await redis.hset(`user:${userId}`, {
        subscriptionStatus: {
          isSubscribed: true,
          plan: planId,
          expiresAt,
          features: plan.features,
        },
      });
    } else if (planId === 'single_calculation') {
      // For single calculations, increment the user's calculation count
      const currentCount = await redis.hget(`user:${userId}`, 'calculationCount') || 0;
      await redis.hset(`user:${userId}`, {
        calculationCount: parseInt(currentCount as string) + 1,
      });
    }
    
    return true;
  } catch (error) {
    console.error('Record payment error:', error);
    return false;
  }
}

/**
 * Check if a user has access to a feature
 * @param userId User ID
 * @param feature Feature name
 * @returns Promise<boolean> Whether the user has access
 */
export async function hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
  try {
    // Get user's subscription status
    const subscriptionStatus = await redis.hget(`user:${userId}`, 'subscriptionStatus');
    
    if (!subscriptionStatus) {
      // Check if user has single calculation access
      const calculationCount = await redis.hget(`user:${userId}`, 'calculationCount') || 0;
      return parseInt(calculationCount as string) > 0;
    }
    
    const { isSubscribed, expiresAt, features } = subscriptionStatus as {
      isSubscribed: boolean;
      expiresAt?: number;
      features: string[];
    };
    
    // Check if subscription is active and includes the feature
    if (isSubscribed && (!expiresAt || expiresAt > Date.now()) && features.includes(feature)) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Check feature access error:', error);
    return false;
  }
}

/**
 * Verify a transaction
 * @param txHash Transaction hash
 * @param expectedAmount Expected amount in ETH
 * @param expectedRecipient Expected recipient address
 * @returns Promise<boolean> Whether the transaction is valid
 */
export async function verifyTransaction(
  txHash: string,
  expectedAmount: number,
  expectedRecipient: string
): Promise<boolean> {
  try {
    // In a real implementation, this would verify the transaction on-chain
    // For now, we'll just return true for demonstration purposes
    return true;
  } catch (error) {
    console.error('Verify transaction error:', error);
    return false;
  }
}

