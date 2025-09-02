/**
 * Farcaster Frame utilities for TradeGuard
 */
import { getFrameMessage, FrameRequest } from '@coinbase/onchainkit';
import { NextRequest } from 'next/server';
import { validateTradeInputs } from './validation';
import { performTradeCalculation } from './calculations';

// Base URL for the application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tradeguard-8725-17568504.vercel.app';

/**
 * Parse a Farcaster frame request
 * @param req The Next.js request object
 * @returns The parsed frame message or null if invalid
 */
export async function parseFrameRequest(req: NextRequest) {
  try {
    const body = await req.json();
    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });
    
    if (!isValid) {
      console.error('Invalid frame message');
      return null;
    }
    
    return message;
  } catch (error) {
    console.error('Error parsing frame request:', error);
    return null;
  }
}

/**
 * Generate HTML for a frame
 * @param options Frame options
 * @returns HTML string for the frame
 */
export function generateFrameHTML(options: {
  title: string;
  description: string;
  image: string;
  buttons?: Array<{
    label: string;
    action?: 'post' | 'post_redirect' | 'link' | 'mint';
    target?: string;
  }>;
  inputs?: Array<{
    label: string;
    type?: 'text' | 'number';
  }>;
  postUrl?: string;
}) {
  const { title, description, image, buttons = [], inputs = [], postUrl = `${BASE_URL}/api/frame` } = options;
  
  // Generate button tags
  const buttonTags = buttons.map((button, index) => {
    const action = button.action || 'post';
    const target = button.target ? ` target="${button.target}"` : '';
    return `<meta property="fc:frame:button:${index + 1}" content="${button.label}" />
<meta property="fc:frame:button:${index + 1}:action" content="${action}"${target} />`;
  }).join('\n');
  
  // Generate input tags
  const inputTags = inputs.map((input, index) => {
    const type = input.type || 'text';
    return `<meta property="fc:frame:input:${index + 1}" content="${input.label}" />
<meta property="fc:frame:input:${index + 1}:type" content="${type}" />`;
  }).join('\n');
  
  // Generate HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${image}" />
  <meta property="fc:frame:post_url" content="${postUrl}" />
  ${buttonTags}
  ${inputTags}
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>`;
}

/**
 * Generate the initial frame HTML
 * @returns HTML string for the initial frame
 */
export function generateInitialFrame() {
  return generateFrameHTML({
    title: 'TradeGuard - Position Size Calculator',
    description: 'Calculate your crypto risk & position size with confidence.',
    image: `${BASE_URL}/api/frame/image?type=initial`,
    inputs: [
      { label: 'Account Balance ($)', type: 'number' },
      { label: 'Risk Percentage (%)', type: 'number' },
      { label: 'Entry Price ($)', type: 'number' },
      { label: 'Stop Loss ($)', type: 'number' },
    ],
    buttons: [
      { label: 'Calculate Position Size', action: 'post' },
    ],
  });
}

/**
 * Generate the result frame HTML
 * @param results Calculation results
 * @param asset Asset symbol
 * @returns HTML string for the result frame
 */
export function generateResultFrame(results: {
  positionSize: number;
  riskAmount: number;
  riskRewardRatio: number;
  marginRequired: number;
}, asset: string = 'BTC') {
  return generateFrameHTML({
    title: 'TradeGuard - Calculation Results',
    description: `Position Size: ${results.positionSize.toFixed(4)} ${asset} | Risk: $${results.riskAmount.toFixed(2)} | R/R: ${results.riskRewardRatio.toFixed(2)} | Margin: $${results.marginRequired.toFixed(2)}`,
    image: `${BASE_URL}/api/frame/image?type=result&positionSize=${results.positionSize}&riskAmount=${results.riskAmount}&riskRewardRatio=${results.riskRewardRatio}&marginRequired=${results.marginRequired}&asset=${asset}`,
    buttons: [
      { label: 'New Calculation', action: 'post' },
      { label: 'View Full App', action: 'link', target: BASE_URL },
    ],
  });
}

/**
 * Generate the error frame HTML
 * @param error Error message
 * @returns HTML string for the error frame
 */
export function generateErrorFrame(error: string) {
  return generateFrameHTML({
    title: 'TradeGuard - Error',
    description: `Error: ${error}`,
    image: `${BASE_URL}/api/frame/image?type=error&message=${encodeURIComponent(error)}`,
    buttons: [
      { label: 'Try Again', action: 'post' },
      { label: 'View Full App', action: 'link', target: BASE_URL },
    ],
  });
}

/**
 * Process a frame request
 * @param message The frame message
 * @returns HTML string for the response frame
 */
export function processFrameRequest(message: FrameRequest) {
  try {
    // Check if this is the initial request
    if (!message.inputText && !message.inputText2 && !message.inputText3 && !message.inputText4) {
      return generateInitialFrame();
    }
    
    // Parse inputs
    const accountBalance = message.inputText;
    const riskPercentage = message.inputText2;
    const entryPrice = message.inputText3;
    const stopLoss = message.inputText4;
    const takeProfit = entryPrice ? (parseFloat(entryPrice) * 1.02).toString() : '0'; // Default take profit to 2% above entry
    const leverage = '1'; // Default leverage to 1x
    const asset = 'BTC'; // Default asset to BTC
    
    // Validate inputs
    const validation = validateTradeInputs({
      accountBalance,
      riskPercentage,
      entryPrice,
      stopLoss,
      takeProfit,
      leverage,
      asset,
    });
    
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors);
      return generateErrorFrame(errorMessages[0] || 'Invalid inputs');
    }
    
    // Perform calculation
    const results = performTradeCalculation(
      parseFloat(accountBalance),
      parseFloat(riskPercentage),
      parseFloat(entryPrice),
      parseFloat(stopLoss),
      parseFloat(takeProfit),
      parseFloat(leverage)
    );
    
    // Generate result frame
    return generateResultFrame(results, asset);
  } catch (error) {
    console.error('Error processing frame request:', error);
    return generateErrorFrame('An unexpected error occurred');
  }
}

