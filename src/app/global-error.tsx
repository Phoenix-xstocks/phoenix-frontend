'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-teal-700 rounded hover:bg-teal-600 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
