import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const FEEDBACK_KEY = 'feedback:list';
const MAX_STORED = 200;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_NAME_LENGTH = 60;

export async function GET() {
  try {
    const raw = await kv.lrange(FEEDBACK_KEY, 0, 49);
    const comments = raw
      .map((entry) => {
        try {
          return typeof entry === 'string' ? JSON.parse(entry) : entry;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    return NextResponse.json({ comments });
  } catch (err) {
    console.error('Failed to load feedback', err);
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(request) {
  const { name, message } = await request.json();

  const trimmedMessage = (message || '').trim();
  if (!trimmedMessage) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
  }

  const trimmedName = (name || '').trim().slice(0, MAX_NAME_LENGTH);

  const comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: trimmedName || 'Anonymous',
    message: trimmedMessage,
    createdAt: new Date().toISOString(),
  };

  try {
    await kv.lpush(FEEDBACK_KEY, JSON.stringify(comment));
    await kv.ltrim(FEEDBACK_KEY, 0, MAX_STORED - 1);
    return NextResponse.json({ comment });
  } catch (err) {
    console.error('Failed to save feedback', err);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
