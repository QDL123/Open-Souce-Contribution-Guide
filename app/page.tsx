"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [state, setState] = useState("ready");
  const [repoBackground, setRepoBackground] = useState("");
  const [repoLink, setRepoLink] = useState("");

  useEffect(() => {
    // On page load, fetch the state
    fetchState();
  }, []);

  useEffect(() => {
    if (state == "indexing") {
      const interval = setInterval(() => {
        fetchState();
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(interval); // Clear polling on component unmount
    }
  }, [state]);

  const fetchState = async () => {
    try {
      const response = await fetch("/api/state");
      if (response.ok) {
        const data = await response.json();
        setState(data.state);

        if (data.state === "indexed" && data.repo_background) {
          setRepoBackground(data.repo_background);
        }
      } else {
        console.error("Failed to fetch state");
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const handleStartIndexing = async () => {
    setState("indexing");
    try {
      const response = await fetch("/api/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoLink }), // Sending the repoLink as part of the request
      });

      if (response.ok) {
        const res_json = await response.json();
        setState(res_json.state);
      } else {
        console.error("Failed to start indexing");
      }
    } catch (error) {
      console.error("Error while indexing:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen p-4">
      {/* Title Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Open Source Guide</h1>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-3xl">
        {state === "ready" && (
          <>
            <Input
              type="text"
              placeholder="Paste a Github repository in the format: owner/repo (ex: pandas-dev/pandas)"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleStartIndexing} className="w-1/3">
              Start Indexing
            </Button>
          </>
        )}

        {state === "indexing" && (
          <div className="flex flex-col items-center space-y-4">
            {/* Loading animation */}
            <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
            <p className="text-lg">Indexing... Please wait.</p>
          </div>
        )}

        {state === "indexed" && (
          <Card className="w-full mx-auto p-6 text-left mt-10">
            <pre className="whitespace-pre-wrap">{repoBackground}</pre>
          </Card>
        )}
      </div>
    </div>
  );
}
