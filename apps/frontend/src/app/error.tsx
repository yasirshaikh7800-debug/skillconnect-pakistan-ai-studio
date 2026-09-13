'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-extrabold text-red-400 mb-3">Something went wrong!</h2>
      <p className="text-slate-400 max-w-md mb-6 text-sm">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20 text-sm"
      >
        Try Again
      </button>
    </div>
  );
}
