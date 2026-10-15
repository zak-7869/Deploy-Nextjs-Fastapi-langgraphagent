# AI Research & Summarizer

An AI-powered research application that searches the internet, analyzes relevant sources, and generates structured research reports using **LangGraph, Groq, Tavily, FastAPI, and Next.js**.

**Live frontend:** https://nextjslanggraphfrontend.vercel.app/

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [System Architecture](#system-architecture)
* [Research Workflow](#research-workflow)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Run Locally](#run-locally)
* [API Documentation](#api-documentation)
* [Deployment on Vercel](#deployment-on-vercel)
* [Troubleshooting](#troubleshooting)
* [Security](#security)
* [Future Improvements](#future-improvements)
* [License](#license)

## Overview

AI Research & Summarizer is a full-stack application that automates the initial stages of research.

Users enter a topic, the application retrieves relevant internet search results, and an AI-powered workflow generates a research report with an executive summary, detailed analysis, and source links.

The backend uses LangGraph to coordinate research and summarization nodes. Groq provides language-model inference, while Tavily supplies web search results.

## Features

* Topic-based internet research
* Web search using Tavily
* AI-powered report generation using Groq
* Multi-step agent workflow using LangGraph
* REST API built with FastAPI
* Next.js frontend with responsive styling
* Source URLs for further investigation
* API request validation with Pydantic
* CORS configuration for frontend-backend communication
* Deployment support for Vercel

## Technology Stack

| Layer               | Technology                 |
| ------------------- | -------------------------- |
| Frontend            | Next.js, React, TypeScript |
| Styling             | Tailwind CSS               |
| Backend             | Python, FastAPI            |
| Agent orchestration | LangGraph                  |
| Language model      | Groq API                   |
| Web search          | Tavily                     |
| Request validation  | Pydantic                   |
| Deployment          | Vercel                     |
| Version control     | Git and GitHub             |

## System Architecture

The application consists of two independently deployable services.

1. **Frontend:** Collects the user's research topic and displays the generated report.
2. **Backend:** Validates the request, executes the LangGraph workflow, calls Tavily and Groq, and returns the results.

The frontend communicates with the backend through HTTPS REST API requests.

## Research Workflow

1. The user enters a research topic.
2. Next.js sends a POST request to the FastAPI backend.
3. FastAPI validates the input.
4. LangGraph executes the research node.
5. Tavily searches the internet and returns relevant results.
6. The summarizer node sends the collected evidence to the Groq language model.
7. The model generates a structured research report.
8. FastAPI returns the report and source URLs.
9. Next.js displays the response.

## Project Structure

```text
research-summarizer/
├── README.md
├── .gitignore
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── index.py
│   ├── requirements.txt
│   ├── .env.example
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx
│   │       ├── globals.css
│   │       └── layout.tsx
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── .env.example
│   └── vercel.json
└── docs/
    ├── architecture.md
    └── research-workflow.md
```

Some generated Next.js filenames may differ depending on your CLI choices. Keep the actual files produced by your project.

## Prerequisites

Install the following:

* Python 3.12 or a compatible version
* Node.js LTS and npm
* Git
* A Groq API key
* A Tavily API key

Create API keys using:

* Groq: https://console.groq.com/
* Tavily: https://app.tavily.com/

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd research-summarizer
```

### 2. Install backend dependencies

Windows PowerShell:

```powershell
cd backend

python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

macOS or Linux:

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure backend environment variables

Create `backend/.env`:

```dotenv
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
GROQ_MODEL=your_supported_groq_model
FRONTEND_ORIGIN=http://localhost:3000
```

Replace the example values with your actual credentials and a model currently supported by your Groq account.

### 4. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The public API URL is not a secret. Never put API keys in frontend environment variables prefixed with `NEXT_PUBLIC_`.

## Run Locally

### Start the backend

From the backend directory, with its virtual environment activated:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL: http://127.0.0.1:8000

Health endpoint: http://127.0.0.1:8000/api/health

Interactive API documentation: http://127.0.0.1:8000/docs

### Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

Frontend URL: http://localhost:3000

Enter a research topic, such as:

`What is Generative AI?`

The frontend sends the request to FastAPI and displays the generated response.

## API Documentation

### Health check

**Endpoint:** `GET /api/health`

Example response:

```json
{
  "status": "ok"
}
```

### Run research

**Endpoint:** `POST /api/research`

Content type: `application/json`

Example request:

```json
{
  "topic": "What is Generative AI?"
}
```

The topic must contain between 3 and 500 characters.

Example response structure:

```json
{
  "topic": "What is Generative AI?",
  "summary": "A short introduction to the research topic...",
  "report": "Executive summary, key findings, analysis and conclusion...",
  "key_findings": [],
  "sources": [
    {
      "title": "Example source",
      "url": "https://example.com/"
    }
  ]
}
```

The response above illustrates the API structure; actual content and sources depend on the search results and model response. In the current implementation, `summary` is derived from the beginning of the report and `key_findings` is not independently populated yet.

## Deployment on Vercel

Deploy the frontend and backend as separate Vercel projects using the same GitHub repository.

### Backend deployment

1. Import the GitHub repository into Vercel.
2. Set the Root Directory to `backend`.
3. Ensure `index.py` exposes the FastAPI application.
4. Configure backend environment variables in Vercel.
5. Deploy the project.
6. Verify `/api/health` and `/docs` on the deployed backend URL.

Required backend environment variables:

```text
GROQ_API_KEY
TAVILY_API_KEY
GROQ_MODEL
FRONTEND_ORIGIN
```

### Frontend deployment

1. Import the repository as another Vercel project.
2. Set the Root Directory to `frontend`.
3. Ensure Vercel detects Next.js.
4. Configure the production API URL:

```dotenv
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-DOMAIN
```

5. Deploy the frontend.

Use the actual backend domain, without a trailing slash.

### CORS configuration

Set `FRONTEND_ORIGIN` in the backend's Vercel environment variables to the exact deployed frontend origin:

```dotenv
FRONTEND_ORIGIN=https://nextjslanggraphfrontend.vercel.app
```

The FastAPI CORS middleware must allow this origin. If you use a separate preview URL or custom domain, configure the additional allowed origin deliberately.

Redeploy after changing environment variables.

### Vercel configuration

Keep the following minimal `vercel.json` in each project root when using Vercel's automatic framework detection.

Backend `backend/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json"
}
```

Frontend `frontend/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json"
}
```

These files do not override framework build settings. Confirm the backend is detected as Python/FastAPI and the frontend as Next.js in the Vercel build logs.

## Troubleshooting

### NetworkError or connection refused

* Verify the backend is running locally or deployed.
* Test `/api/health`.
* Check the `NEXT_PUBLIC_API_URL` value.
* Never use `localhost` or `127.0.0.1` as the backend URL in the deployed frontend.

### CORS preflight returns 400

* Check the browser's actual `Origin` request header.
* Add the exact frontend origin to FastAPI's `allow_origins`.
* Verify `FRONTEND_ORIGIN` in the backend environment.
* Redeploy the backend after changing configuration.

### Research requests return errors

* Verify Groq and Tavily API keys.
* Confirm the configured Groq model is available.
* Inspect backend runtime logs.
* Check for empty search results and upstream timeouts.

### Vercel returns 404

* Verify the correct GitHub repository is connected.
* Confirm the Root Directory.
* Check that the backend entry point and `requirements.txt` are present in the backend root.
* Review the deployment build logs.

## Security

* Never commit `.env`, `.env.local`, or actual API credentials.
* Keep Groq and Tavily keys exclusively on the backend.
* Treat web search results as untrusted input.
* Restrict CORS to the origins you intend to support.
* Validate requests and apply rate limits before making the application public.
* Avoid exposing raw provider errors or secret values to clients.

## Future Improvements

* Generate the executive summary independently.
* Extract structured key findings and connect them to source URLs.
* Add source quality checks and evidence-based citations.
* Support Markdown and PDF export.
* Add research history and user authentication.
* Add background jobs for long-running research tasks.
* Implement automated tests and CI/CD.
* Add observability, usage limits, and request rate limiting.

## License

Choose a license before publishing the repository. For example, you may use the MIT License by adding a `LICENSE` file, provided that its terms suit your project.

---

### flowchart 
````
<img width="2287" height="3273" alt="image" src="https://github.com/user-attachments/assets/9477e892-5af5-4aef-86d4-a5349cc54951" />


````



Built with LangGraph, Groq, Tavily, FastAPI, and Next.js.
