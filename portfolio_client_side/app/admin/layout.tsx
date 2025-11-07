import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Admin Panel</h1>
        {children}
      </div>
    </div>
  );
}


