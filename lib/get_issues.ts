import axios from 'axios';


export interface Issue {
    id: number;
    title: string;
    body: string;
    number: string;
}

export async function getIssues(repo: string, label: string, numIssues: number): Promise<Issue[]> {

    const url = new URL(`https://api.github.com/repos/${repo}/issues`);
    // Consider the first 20 issues
    url.searchParams.append('per_page', numIssues.toString());
    if (label) {
        url.searchParams.append('labels', label);
    }

    try {
        const response = await axios.get(url.toString(), {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
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