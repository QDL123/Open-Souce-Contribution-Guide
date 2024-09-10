import { readState, writeState } from '@/lib/state';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Received index request');
    const { repoLink } = await request.json();

    if (!repoLink) {
      return NextResponse.json({ error: 'Repository link is required' }, { status: 400 });
    }

    // Add your logic for processing the repository link here
    console.log('Repository link received:', repoLink);

    // Set state to indexing
    const state = readState();
    console.log('Current state:', state);
    state['state'] = 'indexing';
    console.log(`New state: ${state['state']}`);
    writeState(state);

    return NextResponse.json({ message: 'Indexing started successfully', state: state['state'] }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
