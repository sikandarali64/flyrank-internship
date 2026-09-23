import { ResumeInput } from "./ResumeInput";

export default function AnalyzePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Analyze your resume</h1>
      <ResumeInput />
    </main>
  );
}
