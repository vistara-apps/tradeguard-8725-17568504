import { NextRequest, NextResponse } from 'next/server';
import { SavedParameters, APIResponse } from '../../types';
import { getUserParameters } from '../../lib/redis';

export async function GET(req: NextRequest) {
  try {
    // Get userId from query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: userId'
      } as APIResponse<null>, { status: 400 });
    }
    
    // Get user parameters
    const parameters = await getUserParameters(userId);
    
    return NextResponse.json({
      success: true,
      data: parameters
    } as APIResponse<SavedParameters[]>);
  } catch (error) {
    console.error('Get parameters error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get parameters',
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
    
    // Get user parameters
    const parameters = await getUserParameters(body.userId);
    
    return NextResponse.json({
      success: true,
      data: parameters
    } as APIResponse<SavedParameters[]>);
  } catch (error) {
    console.error('Get parameters error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get parameters',
      message: error instanceof Error ? error.message : 'Unknown error'
    } as APIResponse<null>, { status: 500 });
  }
}

