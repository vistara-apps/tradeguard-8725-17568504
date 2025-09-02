    import { NextRequest, NextResponse } from 'next/server';
    import OpenAI from 'openai';

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseURL: 'https://openrouter.ai/api/v1',
    });

    export async function POST(req) {
      try {
        const body = await req.json();
        const prompt = `Provide a natural language explanation for this trade calculation: Position Size: ${body.positionSize}, Risk/Reward Ratio: ${body.riskRewardRatio}, Margin: ${body.marginRequired}. Make it helpful for crypto traders.`;

        const completion = await openai.chat.completions.create({
          model: 'google/gemini-2.0-flash-001',
          messages: [{ role: 'user', content: prompt }],
        });

        const insight = completion.choices[0].message.content || 'No insight available.';

        return NextResponse.json({ insight });
      } catch (error) {
        console.error('Insight error:', error);
        return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
      }
    }
  