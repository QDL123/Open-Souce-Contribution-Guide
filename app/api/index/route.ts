import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { repoLink } = await request.json();

    if (!repoLink) {
      return NextResponse.json({ error: 'Repository link is required' }, { status: 400 });
    }

    // Add your logic for processing the repository link here
    console.log('Repository link received:', repoLink);

    return NextResponse.json({ message: 'Indexing started successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
