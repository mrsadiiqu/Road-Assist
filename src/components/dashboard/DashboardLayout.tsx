import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../auth/AuthContext';
import { roleManager, UserRole } from '../../lib/utils/roleManager';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const role = await roleManager.getCurrentRole();
        setUserRole(role);
      }
      setIsLoading(false);
    };

    checkUserRole();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || !userRole) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}