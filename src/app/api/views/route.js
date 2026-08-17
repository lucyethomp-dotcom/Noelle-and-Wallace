import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const VIEWS_KEY = 'views:total';

export async function GET() {
  try {
    const count = Number(await kv.get(VIEWS_KEY)) || 0;
    return NextResponse.json({ count });
  } catch (err) {
    console.error('Failed to load view count', err);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const count = await kv.incr(VIEWS_KEY);
    return NextResponse.json({ count });
  } catch (err) {
    console.error('Failed to save view', err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
