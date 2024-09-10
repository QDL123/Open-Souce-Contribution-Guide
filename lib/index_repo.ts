import axios from 'axios';

// Define the interface for the expected response (optional but recommended in TypeScript)
export interface IndexRepositoryResponse {
    response: string; // Processing status message
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
