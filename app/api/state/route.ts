import { readState } from '@/lib/state';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    console.log("Received state request");
  try {

    // TODO: Check to see if Greptile has finished indexing, update the state if needed, and return it
    const state = readState();

    if (state['state'] == 'indexing') {
        // Check if the indexing process has finished
        // If it has, use the Greptile API to fetch the intro and update the state to 'indexed'
        // If it hasn't, keep the state as 'indexing
    }

    if (state['state'] == 'indexed') {
        // Use the Greptile API to fetch the intro`
        state.repo_background = 'Hello World! It\'s so exciting that you\'ve decided to contribute to open source. Before we get started let\'s go over the background on the project and the contribution guide!';
    }
    return NextResponse.json(state, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
