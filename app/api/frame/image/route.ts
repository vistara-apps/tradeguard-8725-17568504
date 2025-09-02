import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';

// Canvas dimensions
const WIDTH = 1200;
const HEIGHT = 630;

// Colors
const BG_COLOR = 'hsl(220 20% 15%)';
const PRIMARY_COLOR = 'hsl(200 80% 50%)';
const ACCENT_COLOR = 'hsl(300 70% 60%)';
const TEXT_COLOR = 'hsl(0 0% 95%)';
const SURFACE_COLOR = 'hsl(215 25% 20%)';

/**
 * Generate an image for the Farcaster frame
 */
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'initial';
    
    // Create canvas
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Draw header
    ctx.fillStyle = SURFACE_COLOR;
    ctx.fillRect(0, 0, WIDTH, 100);
    
    // Draw logo and title
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = 'bold 48px Arial';
    ctx.fillText('TradeGuard', 50, 70);
    
    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = '24px Arial';
    ctx.fillText('Calculate your crypto risk & position size with confidence', 50, 140);
    
    // Handle different image types
    if (type === 'initial') {
      // Draw input fields
      drawInputField(ctx, 'Account Balance ($)', 50, 200);
      drawInputField(ctx, 'Risk Percentage (%)', 50, 300);
      drawInputField(ctx, 'Entry Price ($)', 50, 400);
      drawInputField(ctx, 'Stop Loss ($)', 50, 500);
      
      // Draw calculate button
      drawButton(ctx, 'Calculate Position Size', 50, 580);
    } else if (type === 'result') {
      // Get result parameters
      const positionSize = parseFloat(url.searchParams.get('positionSize') || '0');
      const riskAmount = parseFloat(url.searchParams.get('riskAmount') || '0');
      const riskRewardRatio = parseFloat(url.searchParams.get('riskRewardRatio') || '0');
      const marginRequired = parseFloat(url.searchParams.get('marginRequired') || '0');
      const asset = url.searchParams.get('asset') || 'BTC';
      
      // Draw result card
      ctx.fillStyle = SURFACE_COLOR;
      ctx.fillRect(50, 180, WIDTH - 100, 350);
      
      // Draw result title
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = 'bold 36px Arial';
      ctx.fillText('Calculation Results', 80, 230);
      
      // Draw result values
      ctx.font = '28px Arial';
      ctx.fillText(`Position Size: ${positionSize.toFixed(4)} ${asset}`, 80, 290);
      ctx.fillText(`Risk Amount: $${riskAmount.toFixed(2)}`, 80, 340);
      ctx.fillText(`Risk/Reward Ratio: ${riskRewardRatio.toFixed(2)}`, 80, 390);
      ctx.fillText(`Margin Required: $${marginRequired.toFixed(2)}`, 80, 440);
      
      // Draw buttons
      drawButton(ctx, 'New Calculation', 50, 580);
      drawButton(ctx, 'View Full App', 350, 580);
    } else if (type === 'error') {
      // Get error message
      const message = url.searchParams.get('message') || 'An error occurred';
      
      // Draw error card
      ctx.fillStyle = 'hsl(0 80% 40%)';
      ctx.fillRect(50, 180, WIDTH - 100, 200);
      
      // Draw error title
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = 'bold 36px Arial';
      ctx.fillText('Error', 80, 230);
      
      // Draw error message
      ctx.font = '28px Arial';
      wrapText(ctx, message, 80, 290, WIDTH - 160, 40);
      
      // Draw button
      drawButton(ctx, 'Try Again', 50, 450);
    }
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Return the image
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=10',
      },
    });
  } catch (error) {
    console.error('Frame image error:', error);
    
    // Return a simple error image
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = 'bold 48px Arial';
    ctx.fillText('Error generating image', 50, 100);
    
    const buffer = canvas.toBuffer('image/png');
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=10',
      },
    });
  }
}

/**
 * Draw an input field on the canvas
 */
function drawInputField(ctx: CanvasRenderingContext2D, label: string, x: number, y: number) {
  // Draw label
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = '24px Arial';
  ctx.fillText(label, x, y);
  
  // Draw input field
  ctx.fillStyle = SURFACE_COLOR;
  ctx.fillRect(x, y + 10, 500, 60);
  
  // Draw input border
  ctx.strokeStyle = PRIMARY_COLOR;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y + 10, 500, 60);
}

/**
 * Draw a button on the canvas
 */
function drawButton(ctx: CanvasRenderingContext2D, label: string, x: number, y: number) {
  // Draw button background
  ctx.fillStyle = PRIMARY_COLOR;
  ctx.fillRect(x, y, 280, 60);
  
  // Draw button text
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = 'bold 24px Arial';
  ctx.fillText(label, x + 20, y + 38);
}

/**
 * Wrap text on the canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let testLine = '';
  let lineCount = 0;
  
  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = words[n] + ' ';
      lineCount++;
    } else {
      line = testLine;
    }
  }
  
  ctx.fillText(line, x, y + lineCount * lineHeight);
}

