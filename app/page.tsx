"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [repoLink, setRepoLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartIndexing = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fetch('/api/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoLink }),
      });

      if (response.ok) {
        // Handle success
        console.log('Indexing started successfully');
      } else {
        console.error('Failed to start indexing');
      }
    } catch (error) {
      console.error('Error while indexing:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-6">
      <h1 className="text-4xl font-bold">Open Source Guide</h1>
      {!isLoading ? (
        <>
          <Input
            type="text"
            placeholder="Paste your repository link here"
            value={repoLink}
            onChange={(e) => setRepoLink(e.target.value)}
            className="w-1/2"
          />
          <Button onClick={handleStartIndexing} className="w-1/4">
            Start Indexing
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          {/* You can use any loading spinner component or create a simple one */}
          <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
          <p className="text-lg">Loading...</p>
        </div>
      )}
    </div>
  );
}
