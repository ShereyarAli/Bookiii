import { NextRequest, NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Assuming Vapi sends tool calls in this format
    // It might be an array or single object
    const toolCalls = Array.isArray(body) ? body : [body];

    for (const call of toolCalls) {
      if (call.function === 'search_book' || call.tool === 'search_book') {
        const { book_id, query } = call.parameters || call;

        if (!book_id || !query) {
          return NextResponse.json({ error: 'Missing book_id or query' }, { status: 400 });
        }

        const result = await searchBookSegments(book_id, query, 3);

        if (!result.success) {
          return NextResponse.json({ result: 'no information found about this topic' });
        }

        const segments = result.data;

        if (segments.length === 0) {
          return NextResponse.json({ result: 'no information found about this topic' });
        }

        // Combine segments with double newlines
        const combinedContent = segments.map((segment: any) => segment.content).join('\n\n');

        return NextResponse.json({ result: combinedContent });
      }
    }

    return NextResponse.json({ error: 'No search_book tool call found' }, { status: 400 });
  } catch (error) {
    console.error('Error in search-book API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}