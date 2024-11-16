
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { transcriptions } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = request.nextUrl.pathname.split('/').pop();

  if (!spaceId) {
    return NextResponse.json({ error: 'Space ID is required' }, { status: 400 });
  }

  try {
    const [transcription] = await db.select()
      .from(transcriptions)
      .where(eq(transcriptions.spaceId, parseInt(spaceId)))
      .limit(1);

    if (!transcription) {
      return NextResponse.json({ error: 'Transcription not found' }, { status: 404 });
    }

    return NextResponse.json(transcription);
  } catch (error) {
    console.error('Error fetching transcription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcription' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
