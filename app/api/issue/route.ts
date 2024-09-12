import { readState, writeState } from '@/lib/state';
import { getIssues } from '@/lib/get_issues';
import { queryRepo } from '@/lib/query_repo';
import { NextResponse } from 'next/server';
import { write } from 'fs';

const selectIssuePrompt = `
    Can you take a look at the following github issues, which have been marked as good first
    issues, and identify the best five options? Keep in mind that we are selecting this issue
    to be the first contribution for a new contributor who has never contributed to this project
    and is not familar with it. Use your knowledge of the project to prioritize issues that will 
    be relatively simple to complete and won't require a lot of background to understand and get
    started on. I would like your response to be a JSON object and only a JSON object. There should
    be NO OTHER TEXT. It should be in the following format:
    
    [
        {
            "id": <id of the issue>,
            "title": "<title of the issue>",
            "number": "<issue number>",
            "body": "<body of the issue>",
            "reasoning": <provide your reasoning for selecting this issue>,
        },
        ...
    ]


    Here are the issues:

`;
 
export async function GET(request: Request) {
    console.log("Received get beginner issues request");

    try {
        const state = readState();
        if (state['state'] != 'indexed') {
            return NextResponse.json({ error: 'Repository not indexed yet' }, { status: 400 });
        }

        // Fetch issues with the good first issue label
        const firstIssueLabel = 'good first issue';

        // Get 20 issues with the good first issue label
        console.log("Fetching issues");
        const issues = await getIssues(state['repo'], firstIssueLabel, 20);
        // console.log("issues: ", JSON.stringify(issues, null, 2));
        // Ask Greptile which are the best issues for beginners
        const prompt = selectIssuePrompt + JSON.stringify(issues, null, 2);
        const messages = [{ 'role': 'user', 'content': prompt }];
        const repo_info = [{ remote: 'github', branch: 'main', repository: state['repo'] }]
        console.log("Fetching Greptile analysis")
        const { message } = await queryRepo(messages, repo_info);
        console.log(`got greptile response: ${message}`);

        try {
            
            const top_issues = JSON.parse(message);
            state['top_issues'] = top_issues;
            state['state'] = 'selecting';
            writeState(state);
            const response = {
                state: 'selecting',
                top_issues
            };
            return NextResponse.json(response, { status: 200 });
        } catch (error) {
            console.error('Error parsing top issues:', error);
            return NextResponse.json({ error: 'Error parsing response' }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
    }
}