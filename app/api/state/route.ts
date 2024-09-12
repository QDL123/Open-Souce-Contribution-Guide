import { readState, writeState } from '@/lib/state';
import { queryRepo, Message } from '@/lib/query_repo'
import { NextResponse } from 'next/server';
import { getRepositoryInfo } from '@/lib/get_repo';


const intro_system_prompt = `
    You are an assistant that helps developers make their first contribution to an open source project. You want to be encouraging
    and helpful as you guide them through the process. Congratulate them on their aspiration to contribute to this particular project.
    The repository they want to contribute to has been included as part of this query. Assume the know the bare minimum about the
    project. Introduce the project and what it does, the basics about how the project is set up that they should know going in, and
    what the process will look like for creating a contribution keeping in mind the specific contribution policies of this particular
    project. When you finish the introduction, ask if they are ready to find the first issue they want to work on.
`;

function getUserPrompt(repo: string) {
    return `
        Hello! I would like to contribute to ${repo}.
    `;
}

export async function GET(request: Request) {
    console.log("Received state request");
  try {

    // TODO: Check to see if Greptile has finished indexing, update the state if needed, and return it
    const state = readState();
    const repo = state['repo'];

    if (state['state'] == 'indexing') {
        // Check if the indexing process has finished
        console.log("Checking repository status");
        const repoId = `github:main:${repo}`;
        const { status } = await getRepositoryInfo(repoId);
        console.log(`Respository status: ${status}`);

        if (status == 'completed') {
          // Need to get the intro from the Greptile API
          const system_prompt: Message = { content: intro_system_prompt, role: 'system' };
          const user_prompt: Message = { content: getUserPrompt(repo), role: 'user' };

          console.log("Getting repo intro message from Greptile");
          const { message } = await queryRepo(
              [system_prompt, user_prompt],
              [{ remote: 'github', branch: 'main', repository: repo }]
          );
          // console.log(`Got message: ${message}`);

          state.repo_background = message;
          state['state'] = 'indexed';
          writeState(state);
        }
    }
    return NextResponse.json(state, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
