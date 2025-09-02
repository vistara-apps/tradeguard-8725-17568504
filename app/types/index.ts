/**
 * TradeCalculation entity as specified in the PRD
 * Represents a single trade calculation performed by a user
 */
export interface TradeCalculation {
  userId: string;
  accountBalance: number;
  riskPercentage: number;
  stopLoss: number;
  entryPrice: number;
  takeProfit: number;
  leverage: number;
  positionSize: number;
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
  marginRequired: number;
  asset?: string;
  calculationTimestamp: number;
}

/**
 * User entity as specified in the PRD
 * Represents a user of the application
 */
export interface User {
  userId: string;
  walletAddress: string;
  createdAt: number;
  savedParameters?: SavedParameters[];
  subscriptionStatus?: SubscriptionStatus;
}

/**
 * SavedParameters entity
 * Represents saved calculation parameters for quick access
 */
export interface SavedParameters {
  id: string;
  name: string;
  accountBalance: number;
  riskPercentage: number;
  asset?: string;
  createdAt: number;
}

/**
 * SubscriptionStatus entity
 * Represents the subscription status of a user
 */
export interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: 'free' | 'premium';
  expiresAt?: number;
  features: string[];
}

/**
 * LeverageSimulation entity
 * Represents a simulation of different leverage levels
 */
export interface LeverageSimulation {
  lev: number;
  margin: number;
  amplifiedProfit: number;
  amplifiedLoss: number;
}

/**
 * APIResponse interface
 * Standard response format for API endpoints
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

