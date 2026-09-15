'use client';

import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The requested page could not be found on SkillConnect Pakistan.
      </p>
      <a
        href="/"
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold transition-all shadow-lg shadow-blue-600/20"
      >
        Return to Homepage
      </a>
    </div>
  );
}
