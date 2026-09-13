'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-extrabold text-red-400 mb-3">Critical Application Error</h2>
        <p className="text-slate-400 max-w-md mb-6 text-sm">
          A critical system error occurred.
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold transition-all text-sm"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
