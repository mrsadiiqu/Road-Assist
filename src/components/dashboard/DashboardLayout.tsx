import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}