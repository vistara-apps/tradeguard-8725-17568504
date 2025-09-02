import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '../../types';
import { recordPayment, verifyTransaction, PAYMENT_PLANS } from '../../lib/payments';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['userId', 'planId', 'txHash'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        } as APIResponse<null>, { status: 400 });
      }
    }
    
    // Get plan details
    const plan = PAYMENT_PLANS[body.planId as keyof typeof PAYMENT_PLANS];
    if (!plan) {
      return NextResponse.json({
        success: false,
        error: 'Invalid plan ID'
      } as APIResponse<null>, { status: 400 });
    }
    
    // Verify transaction
    const isValid = await verifyTransaction(
      body.txHash,
      plan.price,
      process.env.PAYMENT_RECIPIENT_ADDRESS || '0xYourDevAddressHere'
    );
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transaction'
      } as APIResponse<null>, { status: 400 });
    }
    
    // Record payment
    const success = await recordPayment(
      body.userId,
      body.planId,
      plan.price,
      body.txHash
    );
    
    if (!success) {
      throw new Error('Failed to record payment');
    }
    
    return NextResponse.json({
      success: true,
      data: {
        planId: body.planId,
        features: plan.features,
        expiresAt: plan.duration > 0 ? Date.now() + plan.duration : null,
      }
    } as APIResponse<{
      planId: string;
      features: string[];
      expiresAt: number | null;
    }>);
  } catch (error) {
    console.error('Process payment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as APIResponse<null>, { status: 500 });
  }
}

