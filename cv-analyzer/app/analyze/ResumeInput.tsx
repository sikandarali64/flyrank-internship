"use client";

import { useState, type FormEvent } from "react";

type AnalysisResults = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
};

export function ResumeInput() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to analyze resume");
      }

      setResults(data as AnalysisResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleAnalyze}
      className="flex w-full max-w-3xl flex-col gap-4 px-6"
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste your resume text here"
        rows={12}
        className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center self-start rounded-full bg-zinc-900 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {results && (
        <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p>
            Score:{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {results.score}
            </span>
          </p>

          {[
            { title: "Strengths", items: results.strengths },
            { title: "Weaknesses", items: results.weaknesses },
            { title: "Missing skills", items: results.missing_skills },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {section.title}
              </h2>
              <ul className="list-disc pl-5 text-zinc-700 dark:text-zinc-300">
                {section.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </form>
  );
}