function fetchStatus(): Promise<{ status: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: "ok" }), 500);
  });
}

export default async function HealthPage() {
  const health = await fetchStatus();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Health</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Status: {health.status}
      </p>
    </main>
  );
}
