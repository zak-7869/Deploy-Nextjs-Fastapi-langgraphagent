
"use client";

import { FormEvent, useState } from "react";

type Source = {
  title: string;
  url: string;
};

type ResearchResult = {
  topic: string;
  summary: string;
  report: string;
  key_findings: string[];
  sources: Source[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (topic.trim().length < 3) {
      setError("Please enter a topic with at least 3 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Request failed (${response.status})`
        );
      }

      setResult(data as ResearchResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the research API."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-lg font-bold tracking-tight">
            Research<span className="text-cyan-400">AI</span>
          </a>
          <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300">
            GROQ · LANGGRAPH · TAVILY
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16">
        <div className="mb-10 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            AI-powered research workspace
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Research smarter.
            <br />
            <span className="text-cyan-400">Understand faster.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Search the web, analyze evidence, and generate a structured
            research report with useful source links.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-cyan-950/20 md:p-6"
        >
          <label
            htmlFor="topic"
            className="mb-3 block text-sm font-medium text-slate-300"
          >
            What would you like to research?
          </label>

          <textarea
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. How are AI agents transforming software development?"
            maxLength={500}
            rows={3}
            className="w-full resize-y rounded-xl border border-white/10 bg-slate-900 p-4 text-base outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <span className="text-xs text-slate-500">
              {topic.length}/500 characters · Web sources included
            </span>
            <button
              type="submit"
              disabled={loading || topic.trim().length < 3}
              className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? "Researching..." : "Start research →"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-8 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5 text-center">
            <p className="font-medium text-cyan-300">
              Your research is in progress
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Searching the web and analyzing the available evidence.
            </p>
            <div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan-400" />
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        {result && (
          <section className="mt-10 space-y-6" aria-live="polite">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Research report
              </p>
              <h2 className="mt-3 text-2xl font-bold">{result.topic}</h2>

              <h3 className="mt-6 text-lg font-semibold">Executive summary</h3>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                {result.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-semibold">Full analysis</h3>
              <pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-300">
                {result.report}
              </pre>
            </div>

            {result.sources.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="text-lg font-semibold">
                  Sources ({result.sources.length})
                </h3>
                <ul className="mt-4 space-y-3">
                  {result.sources.map((source, index) => (
                    <li key={`${source.url}-${index}`}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-sm text-cyan-300 underline decoration-cyan-400/30 underline-offset-4 hover:text-cyan-200"
                      >
                        {source.title || source.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <p className="mt-10 text-center text-xs leading-6 text-slate-500">
          AI-generated research can contain errors. Verify important claims
          against the original sources.
        </p>
      </section>
    </main>
  );
}