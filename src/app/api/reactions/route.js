import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { episodes } from '../../../stories/episodes';
import { REACTION_KEYS } from '../../../lib/reactions';

function reactionKey(episodeNumber, type) {
  return `reactions:${episodeNumber}:${type}`;
}

export async function GET() {
  const keys = [];
  episodes.forEach((episode) => {
    REACTION_KEYS.forEach((type) => {
      keys.push(reactionKey(episode.number, type));
    });
  });

  try {
    const values = keys.length ? await kv.mget(...keys) : [];
    const counts = {};
    let i = 0;
    episodes.forEach((episode) => {
      counts[episode.number] = {};
      REACTION_KEYS.forEach((type) => {
        counts[episode.number][type] = Number(values[i]) || 0;
        i += 1;
      });
    });
    return NextResponse.json(counts);
  } catch (err) {
    console.error('Failed to load reactions', err);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request) {
  const { episodeNumber, type } = await request.json();

  if (!episodeNumber || !REACTION_KEYS.includes(type)) {
    return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 });
  }

  try {
    const count = await kv.incr(reactionKey(episodeNumber, type));
    return NextResponse.json({ episodeNumber, type, count });
  } catch (err) {
    console.error('Failed to save reaction', err);
    return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 });
  }
}
