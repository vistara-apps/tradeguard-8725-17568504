import { NextRequest, NextResponse } from 'next/server';
import { TradeCalculation, APIResponse } from '../../types';
import { getUserCalculations } from '../../lib/redis';

export async function GET(req: NextRequest) {
  try {
    // Get userId from query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 10;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: userId'
      } as APIResponse<null>, { status: 400 });
    }
    
    // Get user calculations
    const calculations = await getUserCalculations(userId, limit);
    
    return NextResponse.json({
      success: true,
      data: calculations
    } as APIResponse<TradeCalculation[]>);
  } catch (error) {
    console.error('Get calculations error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get calculations',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as APIResponse<null>, { status: 500 });
  }
}

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
    
    const limit = body.limit || 10;
    
    // Get user calculations
    const calculations = await getUserCalculations(body.userId, limit);
    
    return NextResponse.json({
      success: true,
      data: calculations
    } as APIResponse<TradeCalculation[]>);
  } catch (error) {
    console.error('Get calculations error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get calculations',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as APIResponse<null>, { status: 500 });
  }
}

