import axios from 'axios';

export async function getDefaultBranch(repo: string): Promise<string> {
    const url = new URL(`https://api.github.com/repos/${repo}`);

    try {
        const response = await axios.get(url.toString(), {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json'
            },
        });

        // Return the parsed data from the API response
        return response.data.default_branch;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}