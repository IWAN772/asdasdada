import React from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}