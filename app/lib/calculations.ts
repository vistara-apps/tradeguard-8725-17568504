/**
 * Calculation utility functions for TradeGuard
 */
import { LeverageSimulation } from '../types';

/**
 * Calculate position size based on account balance, risk percentage, and stop loss distance
 * @param accountBalance Account balance in USD
 * @param riskPercentage Risk percentage (0-100)
 * @param entryPrice Entry price
 * @param stopLoss Stop loss price
 * @returns Position size in units of the asset
 */
export function calculatePositionSize(
  accountBalance: number,
  riskPercentage: number,
  entryPrice: number,
  stopLoss: number
): number {
  // Convert risk percentage to decimal
  const riskPct = riskPercentage / 100;
  
  // Calculate risk amount
  const riskAmount = accountBalance * riskPct;
  
  // Calculate stop loss distance
  const stopDistance = Math.abs(entryPrice - stopLoss);
  
  // Calculate position size
  const positionSize = riskAmount / stopDistance;
  
  return positionSize;
}

/**
 * Calculate risk/reward ratio based on entry, stop loss, and take profit prices
 * @param entryPrice Entry price
 * @param stopLoss Stop loss price
 * @param takeProfit Take profit price
 * @param positionSize Position size in units of the asset
 * @returns Object containing risk amount, reward amount, and risk/reward ratio
 */
export function calculateRiskReward(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  positionSize: number
): { riskAmount: number; rewardAmount: number; riskRewardRatio: number } {
  // Calculate stop loss distance
  const stopDistance = Math.abs(entryPrice - stopLoss);
  
  // Calculate risk amount
  const riskAmount = stopDistance * positionSize;
  
  // Calculate take profit distance
  const takeProfitDistance = Math.abs(takeProfit - entryPrice);
  
  // Calculate reward amount
  const rewardAmount = takeProfitDistance * positionSize;
  
  // Calculate risk/reward ratio
  const riskRewardRatio = rewardAmount / riskAmount;
  
  return {
    riskAmount,
    rewardAmount,
    riskRewardRatio,
  };
}

/**
 * Calculate margin requirement based on position size, entry price, and leverage
 * @param positionSize Position size in units of the asset
 * @param entryPrice Entry price
 * @param leverage Leverage level
 * @returns Margin required in USD
 */
export function calculateMarginRequired(
  positionSize: number,
  entryPrice: number,
  leverage: number
): number {
  // Calculate position value
  const positionValue = positionSize * entryPrice;
  
  // Calculate margin required
  const marginRequired = positionValue / leverage;
  
  return marginRequired;
}

/**
 * Simulate the impact of different leverage levels on profit and loss
 * @param positionSize Position size in units of the asset
 * @param entryPrice Entry price
 * @param riskAmount Risk amount in USD
 * @param rewardAmount Reward amount in USD
 * @param leverageLevels Array of leverage levels to simulate
 * @returns Array of leverage simulations
 */
export function simulateLeverage(
  positionSize: number,
  entryPrice: number,
  riskAmount: number,
  rewardAmount: number,
  leverageLevels: number[] = [1, 5, 10, 20]
): LeverageSimulation[] {
  return leverageLevels.map(lev => {
    const margin = (positionSize * entryPrice) / lev;
    const amplifiedProfit = rewardAmount * lev;
    const amplifiedLoss = riskAmount * lev;
    
    return {
      lev,
      margin,
      amplifiedProfit,
      amplifiedLoss,
    };
  });
}

/**
 * Perform a complete trade calculation
 * @param accountBalance Account balance in USD
 * @param riskPercentage Risk percentage (0-100)
 * @param entryPrice Entry price
 * @param stopLoss Stop loss price
 * @param takeProfit Take profit price
 * @param leverage Leverage level
 * @returns Object containing all calculation results
 */
export function performTradeCalculation(
  accountBalance: number,
  riskPercentage: number,
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  leverage: number
): {
  positionSize: number;
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
  marginRequired: number;
} {
  // Calculate position size
  const positionSize = calculatePositionSize(
    accountBalance,
    riskPercentage,
    entryPrice,
    stopLoss
  );
  
  // Calculate risk/reward
  const { riskAmount, rewardAmount, riskRewardRatio } = calculateRiskReward(
    entryPrice,
    stopLoss,
    takeProfit,
    positionSize
  );
  
  // Calculate margin required
  const marginRequired = calculateMarginRequired(
    positionSize,
    entryPrice,
    leverage
  );
  
  return {
    positionSize,
    riskAmount,
    rewardAmount,
    riskRewardRatio,
    marginRequired,
  };
}

/**
 * Validate calculation inputs
 * @param accountBalance Account balance in USD
 * @param riskPercentage Risk percentage (0-100)
 * @param entryPrice Entry price
 * @param stopLoss Stop loss price
 * @param takeProfit Take profit price
 * @param leverage Leverage level
 * @returns Object containing validation result and error message
 */
export function validateCalculationInputs(
  accountBalance: number | string,
  riskPercentage: number | string,
  entryPrice: number | string,
  stopLoss: number | string,
  takeProfit: number | string,
  leverage: number | string
): { isValid: boolean; error?: string } {
  // Convert inputs to numbers
  const balance = typeof accountBalance === 'string' ? parseFloat(accountBalance) : accountBalance;
  const riskPct = typeof riskPercentage === 'string' ? parseFloat(riskPercentage) : riskPercentage;
  const entry = typeof entryPrice === 'string' ? parseFloat(entryPrice) : entryPrice;
  const sl = typeof stopLoss === 'string' ? parseFloat(stopLoss) : stopLoss;
  const tp = typeof takeProfit === 'string' ? parseFloat(takeProfit) : takeProfit;
  const lev = typeof leverage === 'string' ? parseFloat(leverage) : leverage;
  
  // Check for NaN values
  if (isNaN(balance)) {
    return { isValid: false, error: 'Account balance must be a number' };
  }
  
  if (isNaN(riskPct)) {
    return { isValid: false, error: 'Risk percentage must be a number' };
  }
  
  if (isNaN(entry)) {
    return { isValid: false, error: 'Entry price must be a number' };
  }
  
  if (isNaN(sl)) {
    return { isValid: false, error: 'Stop loss must be a number' };
  }
  
  if (isNaN(tp)) {
    return { isValid: false, error: 'Take profit must be a number' };
  }
  
  if (isNaN(lev)) {
    return { isValid: false, error: 'Leverage must be a number' };
  }
  
  // Check for valid ranges
  if (balance <= 0) {
    return { isValid: false, error: 'Account balance must be greater than 0' };
  }
  
  if (riskPct <= 0 || riskPct > 100) {
    return { isValid: false, error: 'Risk percentage must be between 0 and 100' };
  }
  
  if (entry <= 0) {
    return { isValid: false, error: 'Entry price must be greater than 0' };
  }
  
  if (sl <= 0) {
    return { isValid: false, error: 'Stop loss must be greater than 0' };
  }
  
  if (tp <= 0) {
    return { isValid: false, error: 'Take profit must be greater than 0' };
  }
  
  if (lev <= 0) {
    return { isValid: false, error: 'Leverage must be greater than 0' };
  }
  
  // Check for valid trade setup
  if (entry === sl) {
    return { isValid: false, error: 'Entry price cannot be equal to stop loss' };
  }
  
  if (entry === tp) {
    return { isValid: false, error: 'Entry price cannot be equal to take profit' };
  }
  
  // For long positions
  if (entry > sl && entry > tp) {
    return { isValid: false, error: 'For long positions, take profit must be above entry price' };
  }
  
  // For short positions
  if (entry < sl && entry < tp) {
    return { isValid: false, error: 'For short positions, take profit must be below entry price' };
  }
  
  return { isValid: true };
}

