import { Redis } from '@upstash/redis';
import { TradeCalculation, User, SavedParameters } from '../types';

// Initialize Redis client from environment variables
export const redis = Redis.fromEnv();

/**
 * Save a trade calculation to Redis
 * @param calculation The calculation to save
 * @returns Promise<boolean> Success status
 */
export async function saveCalculation(calculation: TradeCalculation): Promise<boolean> {
  try {
    const key = `calculation:${calculation.userId}:${calculation.calculationTimestamp}`;
    await redis.hset(key, calculation);
    
    // Add to user's calculation list
    await redis.sadd(`user:${calculation.userId}:calculations`, key);
    
    return true;
  } catch (error) {
    console.error('Redis save calculation error:', error);
    return false;
  }
}

/**
 * Get a user's calculations from Redis
 * @param userId The user ID
 * @param limit Maximum number of calculations to retrieve
 * @returns Promise<TradeCalculation[]> The user's calculations
 */
export async function getUserCalculations(userId: string, limit = 10): Promise<TradeCalculation[]> {
  try {
    // Get calculation keys for the user
    const keys = await redis.smembers(`user:${userId}:calculations`);
    
    // Sort keys by timestamp (descending)
    keys.sort((a, b) => {
      const timestampA = parseInt(a.split(':')[2]);
      const timestampB = parseInt(b.split(':')[2]);
      return timestampB - timestampA;
    });
    
    // Limit the number of keys
    const limitedKeys = keys.slice(0, limit);
    
    // Get calculations for each key
    const calculations: TradeCalculation[] = [];
    for (const key of limitedKeys) {
      const calculation = await redis.hgetall(key);
      if (calculation) {
        // Convert string values to numbers where appropriate
        calculations.push({
          ...calculation,
          accountBalance: parseFloat(calculation.accountBalance as unknown as string),
          riskPercentage: parseFloat(calculation.riskPercentage as unknown as string),
          stopLoss: parseFloat(calculation.stopLoss as unknown as string),
          entryPrice: parseFloat(calculation.entryPrice as unknown as string),
          takeProfit: parseFloat(calculation.takeProfit as unknown as string),
          leverage: parseFloat(calculation.leverage as unknown as string),
          positionSize: parseFloat(calculation.positionSize as unknown as string),
          riskAmount: parseFloat(calculation.riskAmount as unknown as string),
          rewardAmount: parseFloat(calculation.rewardAmount as unknown as string),
          riskRewardRatio: parseFloat(calculation.riskRewardRatio as unknown as string),
          marginRequired: parseFloat(calculation.marginRequired as unknown as string),
          calculationTimestamp: parseInt(calculation.calculationTimestamp as unknown as string),
        } as TradeCalculation);
      }
    }
    
    return calculations;
  } catch (error) {
    console.error('Redis get user calculations error:', error);
    return [];
  }
}

/**
 * Save or update a user in Redis
 * @param user The user to save
 * @returns Promise<boolean> Success status
 */
export async function saveUser(user: User): Promise<boolean> {
  try {
    const key = `user:${user.userId}`;
    await redis.hset(key, user);
    return true;
  } catch (error) {
    console.error('Redis save user error:', error);
    return false;
  }
}

/**
 * Get a user from Redis
 * @param userId The user ID
 * @returns Promise<User | null> The user or null if not found
 */
export async function getUser(userId: string): Promise<User | null> {
  try {
    const key = `user:${userId}`;
    const user = await redis.hgetall(key);
    
    if (!user || Object.keys(user).length === 0) {
      return null;
    }
    
    return {
      ...user,
      createdAt: parseInt(user.createdAt as unknown as string),
    } as User;
  } catch (error) {
    console.error('Redis get user error:', error);
    return null;
  }
}

/**
 * Save user parameters for quick access
 * @param userId The user ID
 * @param params The parameters to save
 * @returns Promise<boolean> Success status
 */
export async function saveParameters(userId: string, params: SavedParameters): Promise<boolean> {
  try {
    const key = `user:${userId}:params:${params.id}`;
    await redis.hset(key, params);
    
    // Add to user's parameters list
    await redis.sadd(`user:${userId}:params`, key);
    
    return true;
  } catch (error) {
    console.error('Redis save parameters error:', error);
    return false;
  }
}

/**
 * Get a user's saved parameters
 * @param userId The user ID
 * @returns Promise<SavedParameters[]> The user's saved parameters
 */
export async function getUserParameters(userId: string): Promise<SavedParameters[]> {
  try {
    // Get parameter keys for the user
    const keys = await redis.smembers(`user:${userId}:params`);
    
    // Get parameters for each key
    const parameters: SavedParameters[] = [];
    for (const key of keys) {
      const params = await redis.hgetall(key);
      if (params) {
        parameters.push({
          ...params,
          accountBalance: parseFloat(params.accountBalance as unknown as string),
          riskPercentage: parseFloat(params.riskPercentage as unknown as string),
          createdAt: parseInt(params.createdAt as unknown as string),
        } as SavedParameters);
      }
    }
    
    return parameters;
  } catch (error) {
    console.error('Redis get user parameters error:', error);
    return [];
  }
}

