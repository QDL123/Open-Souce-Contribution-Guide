# Open Source Contribution Guide

## Introduction
There are many people who would love to contribute to open source but struggle with how to get started. If you've never done it before and aren't sure how open source works, or even if you have experience but are trying to break into a new project, contributing to open source can be intimidating. The purpose of this project is to use Greptile's ability to understand repositories to create customized guidance on how to complete your first github issue on any open source project.

## How it works
Open Source Contribution Guide will take you through the following steps:
1. **Index the repository of interest**: The first thing the user is tasked with doing is entering a github repository they would like to contribute to in the format `<owner>/<respository>`. To start the indexing process, simply press `Start Indexing`. Depending on how large the repository is indexing can vary in length from 3-5 minutes to over an hour.
2. **Read the project introduction**: When the repository has finished indexing, the loading screen will be replaced with a large body of text. This is the project introduction which will explain the background on what the project is, how contributing to the project works, and anything else you should know before getting started. When you've finished reading the project introduction, click the `Search for Beginner Issues` button to continue.
3. **Select your first issue**: When the `Search for Beginner Issues` button is pressed, the system will look for github issues marked *good first issue* within the repository of interest. It will then look for what it believes to be the best 5 options for someone just getting started, writes a description of why it believes them to be good first issues, and then presents them to the user. The user click back and forth to view these top 5 issues and read about them before deciding which one they would like to proceed with. (Disclaimer: Most project have some kind of process for assigning issues to contributors. Hopefully it is explained in the introduction, but if not be sure to check the CONTRIBUTING.md or other sources.) Click the `Select` button to continue with a particular issue.
4. **Read the issue instructions**: When the issue instructions finish loading, the screen will be updated with instructions on how to complete this specific issue. It should give you any background you need about the project to understand this issue and give you specific steps to take to tackle it.
5. **Go Contribute!**: Now that you have the information needed to have the confidence to contribute, follow through and do it!

## Running the Project
Before you can run the project, you will need a Greptile API key and a Github API key. Below are links to where you can generate them:
- [Generate Greptile API Key](here)
- [Generate Github API Key](here)

Once you have your API keys, follow these steps:
1. Clone the repository: `git clone <insert repository here>`
2. In the root of the repository, create a `.env.local` file and paste in your API keys in the following format:
```
GITHUB_TOKEN=<Your-Github-API-Key-Here>
GREPTILE_API_KEY=<Your-Greptile-API-Key-Here>
```
3. From the root of the repository run: `npm install`
4. From the root of the repository run: `npm run dev`
5. In your browser, navigate to `http://localhost:3000`

You're ready to go!


