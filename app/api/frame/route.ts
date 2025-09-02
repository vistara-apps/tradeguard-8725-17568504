import { NextRequest, NextResponse } from 'next/server';
import { parseFrameRequest, generateInitialFrame, processFrameRequest } from '../../lib/frame';

/**
 * Handle Farcaster frame requests
 */
export async function GET(req: NextRequest) {
  // Return the initial frame HTML
  return new NextResponse(generateInitialFrame(), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Parse the frame request
    const message = await parseFrameRequest(req);
    
    if (!message) {
      return new NextResponse(generateInitialFrame(), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    // Process the frame request
    const responseHtml = processFrameRequest(message);
    
    // Return the response HTML
    return new NextResponse(responseHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame error:', error);
    
    // Return the initial frame in case of error
    return new NextResponse(generateInitialFrame(), {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}

