"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Assuming you have a Carousel component
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"; // Adjust this import based on the actual ShadCN UI carousel

export default function Home() {
  const [state, setState] = useState("ready");
  const [repoBackground, setRepoBackground] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [topIssues, setTopIssues] = useState([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false); // Track loading for issue search
  const [isFetchingInstructions, setIsFetchingInstructions] = useState(false); // Track loading for fetching instructions
  const [issueInstructions, setIssueInstructions] = useState(""); // Store the instructions for a selected issue

  useEffect(() => {
    // On page load, fetch the state
    fetchState();
  }, []);

  useEffect(() => {
    if (state === "indexing") {
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

  const handleSearchIssues = async () => {
    setIsLoadingIssues(true); // Start loading animation for searching issues
    try {
      const response = await fetch("/api/issue"); // Make GET request to /api/issue
      if (response.ok) {
        const data = await response.json();
        setState(data.state); // Update state from API response
        setTopIssues(data.top_issues); // Set the issues from the response
      } else {
        console.error("Failed to fetch issues");
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setIsLoadingIssues(false); // Stop loading animation after request finishes
    }
  };

  // Handle selecting an issue and fetching instructions from Greptile API
  const handleSelectIssue = async (issueId) => {
    setIsFetchingInstructions(true); // Start loading animation for fetching instructions
    try {
      const response = await fetch(`/api/instructions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issueId }), // Send the issue ID to fetch instructions
      });

      if (response.ok) {
        const data = await response.json();
        setIssueInstructions(data.issue_instructions); // Store the issue instructions
        setState("done"); // Update the state to "done"
      } else {
        console.error("Failed to fetch issue instructions");
      }
    } catch (error) {
      console.error("Error fetching issue instructions:", error);
    } finally {
      setIsFetchingInstructions(false); // Stop loading animation after request finishes
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
          <>
            {/* Ensure the card with instructions is shown */}
            <Card className="w-full mx-auto p-6 text-left mt-10">
              <pre className="whitespace-pre-wrap">{repoBackground}</pre>
            </Card>

            {/* Button to search for beginner issues */}
            {isLoadingIssues ? (
              <div className="flex flex-col items-center space-y-4 mt-4">
                {/* Loading animation for issue search */}
                <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
                <p className="text-lg">Searching for issues...</p>
                <div className="h-32"></div>
              </div>
            ) : (
              <div className="flex justify-center items-center space-y-3 w-full max-w-3xl">
                <Button onClick={handleSearchIssues} className="w-1/3 px-4 rounded-md block">
                  Search for Beginner Issues
                </Button>
                <div className="h-32"></div>
              </div>
            )}
          </>
        )}

        {/* Show carousel when state is "selecting" */}
        {state === "selecting" && topIssues.length > 0 && !isLoadingIssues && (
          <div className="mt-10 w-full max-w-3xl">
            <Card className="w-full mx-auto p-6 text-left mt-10">
              <pre className="whitespace-pre-wrap">{repoBackground}</pre>
            </Card>
            <Carousel className="w-full overflow-hidden mt-10">
              <CarouselContent className="-ml-4">
                {topIssues.map((issue) => (
                  <CarouselItem key={issue.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                    <Card className="p-6 mx-auto">
                      <h2 className="text-xl font-bold">{issue.title} (#{issue.number})</h2>
                      <p className="text-sm">{issue.body}</p>
                      <p className="italic text-gray-600">Reason: {issue.reasoning}</p>

                      {/* Add 'Select' Button at the bottom of each card */}
                      <Button
                        className="mt-4 w-full"
                        onClick={() => handleSelectIssue(issue.id)}
                      >
                        Select
                      </Button>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
              <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
            </Carousel>
            <div className="h-32"></div>
          </div>
        )}

        {/* Show loading animation and replace carousel when fetching instructions */}
        {isFetchingInstructions && (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
            <p className="text-lg">Fetching instructions...</p>
            <div className="h-32"></div>
          </div>
        )}

        {/* Show issue instructions when state is "done" */}
        {state === "done" && issueInstructions && (
          <Card className="w-full mx-auto p-6 text-left mt-10">
            <pre className="whitespace-pre-wrap">{issueInstructions}</pre>
          </Card>
        )}
      </div>
    </div>
  );
}
