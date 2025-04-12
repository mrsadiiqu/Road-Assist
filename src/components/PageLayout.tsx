import React from 'react';
import Navbar from './common/Navbar';

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}