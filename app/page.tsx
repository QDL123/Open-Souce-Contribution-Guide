"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [repoLink, setRepoLink] = useState('');

  const handleStartIndexing = async () => {
    try {
      const response = await fetch('/api/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoLink }),
      });

      if (response.ok) {
        // Handle success, maybe show a success message or redirect
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
    </div>
  );
};

export default Home;
