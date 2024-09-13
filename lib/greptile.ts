import axios from 'axios';

enum RepositoryStatus {
    Submitted = 'submitted',
    Cloning = 'cloning',
    Processing = 'processing',
    Completed = 'completed',
}
  
interface RepositoryInfo {
  repository: string;
  remote: string;
  branch: string;
  private: boolean;
  status: RepositoryStatus;
  filesProcessed: number;
  numFiles: number;
  sampleQuestions: string[];
  sha: string;
}

export interface IndexRepositoryResponse {
    response: string; // Processing status message
}

export interface Message {
    id?: string;
    content: string;
    role: string;
  }
  
  export interface RepositoryReference {
    remote: string;
    branch?: string;
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


// Function to query repository info
export async function getRepositoryInfo(repositoryId: string): Promise<RepositoryInfo> {
  const url = `https://api.greptile.com/v2/repositories/${encodeURIComponent(repositoryId)}`;

  try {
    // Make the GET request using Axios
    const response = await axios.get<RepositoryInfo>(url, {
      headers: {
        Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`,
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
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}


export async function indexRepository(repoLink: string): Promise<IndexRepositoryResponse> {
    const url = 'https://api.greptile.com/v2/repositories';

    const body = {
        remote: 'github', // only supporting github for now
        repository: repoLink,
    };

    try {
         // Make the POST request using Axios
        const response = await axios.post<IndexRepositoryResponse>(url, body, {
            // TODO: Need to check if the GREPTILE_API_KEY is in fact the bearer token or it an exchange is needed
            headers: {
                Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`,
                'X-GitHub-Token': process.env.GITHUB_TOKEN,
                'Content-Type': 'application/json',
            },
        });

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
