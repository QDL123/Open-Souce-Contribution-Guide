import axios from 'axios';


enum RepositoryStatus {
    Submitted = 'submitted',
    Cloning = 'cloning',
    Processing = 'processing',
    Completed = 'completed',
}
  

// Define the interface for the expected response
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
