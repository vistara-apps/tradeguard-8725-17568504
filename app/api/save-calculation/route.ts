import { NextRequest, NextResponse } from 'next/server';
import { TradeCalculation, APIResponse } from '../../types';
import { saveCalculation, saveUser } from '../../lib/redis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'userId', 'accountBalance', 'riskPercentage', 'stopLoss', 
      'entryPrice', 'takeProfit', 'leverage', 'positionSize',
      'riskAmount', 'rewardAmount', 'riskRewardRatio', 'marginRequired'
    ];
    
    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        } as APIResponse<null>, { status: 400 });
      }
    }
    
    // Add timestamp if not provided
    if (!body.calculationTimestamp) {
      body.calculationTimestamp = Date.now();
    }
    
    // Save calculation
    const calculation: TradeCalculation = {
      userId: body.userId,
      accountBalance: parseFloat(body.accountBalance),
      riskPercentage: parseFloat(body.riskPercentage),
      stopLoss: parseFloat(body.stopLoss),
      entryPrice: parseFloat(body.entryPrice),
      takeProfit: parseFloat(body.takeProfit),
      leverage: parseFloat(body.leverage),
      positionSize: parseFloat(body.positionSize),
      riskAmount: parseFloat(body.riskAmount),
      rewardAmount: parseFloat(body.rewardAmount),
      riskRewardRatio: parseFloat(body.riskRewardRatio),
      marginRequired: parseFloat(body.marginRequired),
      asset: body.asset,
      calculationTimestamp: body.calculationTimestamp,
    };
    
    const success = await saveCalculation(calculation);
    
    if (!success) {
      throw new Error('Failed to save calculation');
    }
    
    // Create or update user if not exists
    if (body.userId) {
      await saveUser({
        userId: body.userId,
        walletAddress: body.userId,
        createdAt: Date.now(),
      });
    }
    
    return NextResponse.json({
      success: true,
      data: calculation
    } as APIResponse<TradeCalculation>);
  } catch (error) {
    console.error('Save calculation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save calculation',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as APIResponse<null>, { status: 500 });
  }
}
