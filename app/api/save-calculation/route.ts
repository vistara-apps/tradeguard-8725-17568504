    import { NextRequest, NextResponse } from 'next/server';
    import { Redis } from '@upstash/redis';

    const redis = Redis.fromEnv();

    export async function POST(req: NextRequest) {
      try {
        const body = await req.json();
        const key = `calculation:${body.userId}:${body.calculationTimestamp}`;
        await redis.hset(key, body);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 });
      }
    }
  