import { readState, writeState } from '@/lib/state';
import { indexRepository } from '@/lib/index_repo';;
import { getDefaultBranch } from '@/lib/get_default_branch';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    console.log('Received index request');
    const { repoLink } = await request.json();

    if (!repoLink) {
      return NextResponse.json({ error: 'Repository is required' }, { status: 400 });
    }

    // TODO: Move this business logic outside of the controller
    // Add your logic for processing the repository link here
    console.log('Repository link received:', repoLink);
    
    const { response } = await indexRepository(repoLink);
    const branch = await getDefaultBranch(repoLink);

    console.log('Indexing response:', response);
    // Double check the response message
    if (response != "started repo processing" && response != "repo already exists") {
        throw new Error(`Failed to start indexing: ${response}`);
    }

    // Set state to indexing
    const state = readState();
    console.log('Current state:', state);
    state['state'] = 'indexing';
    state['repo'] = repoLink;
    state['branch'] = branch;
    console.log(`New state: ${state['state']}`);
    writeState(state);

    return NextResponse.json({ message: 'Indexing started successfully', state: state['state'] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
