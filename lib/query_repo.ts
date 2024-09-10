import axios from 'axios';

// Define interfaces for the request and response (optional but recommended in TypeScript)
export interface Message {
  id?: string;
  content: string;
  role: string;
}

export interface RepositoryReference {
  remote: string;
  branch: string;
  repository: string;
}

export interface Source {
  repository: string;
  remote: string;
  branch: string;
  filepath: string;
  linestart: number | null;
  lineend: number | null;
  summary: string;
}

export interface QueryResponse {
  message: string;
  sources: Source[];
}

// Function to query the repo using the Greptile API
export async function queryRepo(
  messages: Message[],     // List of chat messages (queries)
  repositories: RepositoryReference[], // List of repositories to reference
  stream: boolean = false, // Optional, whether the response should stream
  genius: boolean = false  // Optional, whether to use the slower but smarter genius mode
): Promise<QueryResponse> {
    const url = 'https://api.greptile.com/v2/query';

    const body = {
        messages,
        repositories,
        stream,
        genius,
    };

    try {
        // Make the POST request using Axios
        const response = await axios.post<QueryResponse>(url, body, {
            headers: {
            Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`,
            'X-GitHub-Token': process.env.GITHUB_TOKEN,
            'Content-Type': 'application/json',
            },
        });

        // Return the parsed data from the API response
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error; // Re-throw the error to handle it in the controller
    }
}