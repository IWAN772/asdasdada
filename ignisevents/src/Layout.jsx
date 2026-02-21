import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

export default function Layout({ children, currentPageName }) {
  const isAdminPage = currentPageName?.startsWith('Admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}