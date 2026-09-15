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
    <div className="min-h-[60vh] bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-extrabold text-red-400 mb-3">Something went wrong!</h2>
      <p className="text-slate-400 max-w-md mb-6 text-sm">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-950 font-bold transition-all shadow-lg shadow-blue-600/20 text-sm"
      >
        Try Again
      </button>
    </div>
  );
}
