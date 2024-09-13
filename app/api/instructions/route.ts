import { readState, writeState } from '@/lib/state';
import { NextResponse } from 'next/server';
import { Issue } from '@/lib/get_issues';
import { queryRepo } from '@/lib/query_repo';

const getIssueInstructionsPrompt = `
    Below are the details on a Github issue that's been selected by a first time contributor. You job is to guide and
    encourage them through the process of completing the issue. Keep in mind this repository's specific policies on
    how to contribute, what is needed to address this specific issue, and the fact that this person has no background
    or experience with this repository. The instructions should be clear and concise and include references to specific 
    parts of the codebase where possible. The top of the instructions should include the title of the issue, the issue
    number, a quick summary if possible and perhaps a link to it if possible. The instructions should be written in
    markdown format.

    Issue details:

`;

export async function POST(request: Request) {
    console.log("Received instructions request");
    try {
        const { issueId } = await request.json();

        // Pull the issue from the state
        const state = readState();

        if (state['state'] != 'selecting') {
            return NextResponse.json({ error: 'Not in the selecting state' }, { status: 400 });
        }

        // state is selecting, so the request is valid
        const topIssues: Issue[] = state['top_issues'];
        const selectedIssue = topIssues.find(issue => issue.id == issueId);
        console.log("Got selected issue: ", selectedIssue);

        // Fetch instructions
        const prompt = getIssueInstructionsPrompt + JSON.stringify(selectedIssue, null, 2);
        const messages = [{ 'role': 'user', 'content': prompt }];
        const repo_info = [{ remote: 'github', branch: state['branch'], repository: state['repo'] }]
        console.log('Fetching issue instructions');
        const { message } = await queryRepo(messages, repo_info);
        // console.log(`Got issue instructions: ${message}`);

        // Update the state
        state['selected_issue'] = selectedIssue;
        state['issue_instructions'] = message;
        state['state'] = 'done';
        writeState(state);
        console.log("Updated state to: ", state['state']);

        return NextResponse.json({ issue_instructions: message, state: state['state'] }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
    }
}