/**
 * Validation utility functions for TradeGuard
 */

/**
 * Validate a number input
 * @param value The value to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateNumber(
  value: string | number | undefined,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
    allowZero?: boolean;
  } = {}
): { isValid: boolean; error?: string; value?: number } {
  const { required = true, min, max, integer = false, allowZero = false } = options;
  
  // Check if value is required
  if (required && (value === undefined || value === null || value === '')) {
    return { isValid: false, error: 'This field is required' };
  }
  
  // If not required and empty, return valid
  if (!required && (value === undefined || value === null || value === '')) {
    return { isValid: true };
  }
  
  // Convert to number
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if value is a number
  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' };
  }
  
  // Check if value is an integer
  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: 'Must be a whole number' };
  }
  
  // Check if value is zero
  if (!allowZero && num === 0) {
    return { isValid: false, error: 'Cannot be zero' };
  }
  
  // Check if value is within range
  if (min !== undefined && num < min) {
    return { isValid: false, error: `Must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `Must be at most ${max}` };
  }
  
  return { isValid: true, value: num };
}

/**
 * Validate a string input
 * @param value The value to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateString(
  value: string | undefined,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  } = {}
): { isValid: boolean; error?: string; value?: string } {
  const { required = true, minLength, maxLength, pattern } = options;
  
  // Check if value is required
  if (required && (value === undefined || value === null || value === '')) {
    return { isValid: false, error: 'This field is required' };
  }
  
  // If not required and empty, return valid
  if (!required && (value === undefined || value === null || value === '')) {
    return { isValid: true };
  }
  
  // Check if value is a string
  if (typeof value !== 'string') {
    return { isValid: false, error: 'Must be a string' };
  }
  
  // Check if value is within length range
  if (minLength !== undefined && value.length < minLength) {
    return { isValid: false, error: `Must be at least ${minLength} characters` };
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    return { isValid: false, error: `Must be at most ${maxLength} characters` };
  }
  
  // Check if value matches pattern
  if (pattern !== undefined && !pattern.test(value)) {
    return { isValid: false, error: 'Invalid format' };
  }
  
  return { isValid: true, value };
}

/**
 * Validate a wallet address
 * @param address The address to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateWalletAddress(
  address: string | undefined,
  options: {
    required?: boolean;
  } = {}
): { isValid: boolean; error?: string; value?: string } {
  const { required = true } = options;
  
  // Check if address is required
  if (required && (address === undefined || address === null || address === '')) {
    return { isValid: false, error: 'Wallet address is required' };
  }
  
  // If not required and empty, return valid
  if (!required && (address === undefined || address === null || address === '')) {
    return { isValid: true };
  }
  
  // Check if address is a string
  if (typeof address !== 'string') {
    return { isValid: false, error: 'Wallet address must be a string' };
  }
  
  // Check if address is a valid Ethereum address
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(address)) {
    return { isValid: false, error: 'Invalid wallet address format' };
  }
  
  return { isValid: true, value: address };
}

/**
 * Validate trade calculation inputs
 * @param inputs The inputs to validate
 * @returns Validation result
 */
export function validateTradeInputs(inputs: {
  accountBalance?: string | number;
  riskPercentage?: string | number;
  stopLoss?: string | number;
  entryPrice?: string | number;
  takeProfit?: string | number;
  leverage?: string | number;
  asset?: string;
}): { isValid: boolean; errors: Record<string, string>; values: Record<string, number | string> } {
  const { accountBalance, riskPercentage, stopLoss, entryPrice, takeProfit, leverage, asset } = inputs;
  
  const errors: Record<string, string> = {};
  const values: Record<string, number | string> = {};
  
  // Validate account balance
  const balanceResult = validateNumber(accountBalance, { min: 0.01 });
  if (!balanceResult.isValid) {
    errors.accountBalance = balanceResult.error || 'Invalid account balance';
  } else if (balanceResult.value !== undefined) {
    values.accountBalance = balanceResult.value;
  }
  
  // Validate risk percentage
  const riskResult = validateNumber(riskPercentage, { min: 0.1, max: 100 });
  if (!riskResult.isValid) {
    errors.riskPercentage = riskResult.error || 'Invalid risk percentage';
  } else if (riskResult.value !== undefined) {
    values.riskPercentage = riskResult.value;
  }
  
  // Validate stop loss
  const stopLossResult = validateNumber(stopLoss, { min: 0.00001 });
  if (!stopLossResult.isValid) {
    errors.stopLoss = stopLossResult.error || 'Invalid stop loss';
  } else if (stopLossResult.value !== undefined) {
    values.stopLoss = stopLossResult.value;
  }
  
  // Validate entry price
  const entryResult = validateNumber(entryPrice, { min: 0.00001 });
  if (!entryResult.isValid) {
    errors.entryPrice = entryResult.error || 'Invalid entry price';
  } else if (entryResult.value !== undefined) {
    values.entryPrice = entryResult.value;
  }
  
  // Validate take profit
  const takeProfitResult = validateNumber(takeProfit, { min: 0.00001 });
  if (!takeProfitResult.isValid) {
    errors.takeProfit = takeProfitResult.error || 'Invalid take profit';
  } else if (takeProfitResult.value !== undefined) {
    values.takeProfit = takeProfitResult.value;
  }
  
  // Validate leverage
  const leverageResult = validateNumber(leverage, { min: 1, integer: true });
  if (!leverageResult.isValid) {
    errors.leverage = leverageResult.error || 'Invalid leverage';
  } else if (leverageResult.value !== undefined) {
    values.leverage = leverageResult.value;
  }
  
  // Validate asset
  const assetResult = validateString(asset, { required: false });
  if (!assetResult.isValid) {
    errors.asset = assetResult.error || 'Invalid asset';
  } else if (assetResult.value !== undefined) {
    values.asset = assetResult.value;
  }
  
  // Additional validation for trade setup
  if (
    entryResult.isValid &&
    stopLossResult.isValid &&
    takeProfitResult.isValid &&
    entryResult.value !== undefined &&
    stopLossResult.value !== undefined &&
    takeProfitResult.value !== undefined
  ) {
    const entry = entryResult.value;
    const sl = stopLossResult.value;
    const tp = takeProfitResult.value;
    
    // Check for valid trade setup
    if (entry === sl) {
      errors.stopLoss = 'Entry price cannot be equal to stop loss';
    }
    
    if (entry === tp) {
      errors.takeProfit = 'Entry price cannot be equal to take profit';
    }
    
    // For long positions
    if (entry > sl && entry > tp) {
      errors.takeProfit = 'For long positions, take profit must be above entry price';
    }
    
    // For short positions
    if (entry < sl && entry < tp) {
      errors.takeProfit = 'For short positions, take profit must be below entry price';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values,
  };
}

