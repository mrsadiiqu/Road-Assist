import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { roleManager, UserRole } from '../../lib/utils/roleManager';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/signin'
}: ProtectedRouteProps) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // First check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAllowed(false);
          return;
        }

        // Then check role
        const currentRole = await roleManager.getCurrentRole();
        
        if (!currentRole) {
          setIsAllowed(false);
          return;
        }

        if (requiredRole) {
          setIsAllowed(currentRole === requiredRole);
        } else {
          setIsAllowed(true);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setIsAllowed(false);
      }
    };

    checkAccess();
  }, [requiredRole]);

  if (isAllowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}