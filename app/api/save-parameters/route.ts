import { NextRequest, NextResponse } from 'next/server';
import { SavedParameters, APIResponse } from '../../types';
import { saveParameters } from '../../lib/redis';
import { validateString, validateNumber } from '../../lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: userId'
      } as APIResponse<null>, { status: 400 });
    }
    
    // Validate name
    const nameResult = validateString(body.name, { minLength: 1, maxLength: 50 });
    if (!nameResult.isValid) {
      return NextResponse.json({
        success: false,
        error: `Invalid name: ${nameResult.error}`
      } as APIResponse<null>, { status: 400 });
    }
    
    // Validate account balance
    const balanceResult = validateNumber(body.accountBalance, { min: 0.01 });
    if (!balanceResult.isValid) {
      return NextResponse.json({
        success: false,
        error: `Invalid account balance: ${balanceResult.error}`
      } as APIResponse<null>, { status: 400 });
    }
    
    // Validate risk percentage
    const riskResult = validateNumber(body.riskPercentage, { min: 0.1, max: 100 });
    if (!riskResult.isValid) {
      return NextResponse.json({
        success: false,
        error: `Invalid risk percentage: ${riskResult.error}`
      } as APIResponse<null>, { status: 400 });
    }
    
    // Create saved parameters object
    const params: SavedParameters = {
      id: body.id || `param_${Date.now()}`,
      name: body.name,
      accountBalance: parseFloat(body.accountBalance),
      riskPercentage: parseFloat(body.riskPercentage),
      asset: body.asset,
      createdAt: Date.now(),
    };
    
    // Save parameters
    const success = await saveParameters(body.userId, params);
    
    if (!success) {
      throw new Error('Failed to save parameters');
    }
    
    return NextResponse.json({
      success: true,
      data: params
    } as APIResponse<SavedParameters>);
  } catch (error) {
    console.error('Save parameters error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save parameters',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as APIResponse<null>, { status: 500 });
  }
}

