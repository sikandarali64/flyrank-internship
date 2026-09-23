import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        AI Resume Analyzer
      </h1>
      <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Upload your resume and a job description, and this app reads them for
        you. It points out which skills and experience match the role, what is
        missing, and how you can improve your resume — in plain language, no
        jargon required.
      </p>
      <Link
        href="/analyze"
        className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Analyze a resume
      </Link>
    </div>
  );
}
