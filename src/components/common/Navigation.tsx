import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { roleManager, UserRole } from '../../lib/utils/roleManager';
import { motion } from 'framer-motion';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const role = await roleManager.getCurrentRole();
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    checkUserRole();
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const renderNavLinks = () => {
    switch (userRole) {
      case 'admin':
        return (
          <div className="ml-6 flex space-x-4">
            <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/admin/providers" className={`nav-link ${isActive('/admin/providers') ? 'active' : ''}`}>
              Providers
            </Link>
            <Link to="/admin/requests" className={`nav-link ${isActive('/admin/requests') ? 'active' : ''}`}>
              Requests
            </Link>
            <Link to="/admin/settings" className={`nav-link ${isActive('/admin/settings') ? 'active' : ''}`}>
              Settings
            </Link>
          </div>
        );
      case 'provider':
        return (
          <div className="ml-6 flex space-x-4">
            <Link to="/provider/dashboard" className={`nav-link ${isActive('/provider/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/provider/requests" className={`nav-link ${isActive('/provider/requests') ? 'active' : ''}`}>
              Requests
            </Link>
            <Link to="/provider/earnings" className={`nav-link ${isActive('/provider/earnings') ? 'active' : ''}`}>
              Earnings
            </Link>
            <Link to="/provider/profile" className={`nav-link ${isActive('/provider/profile') ? 'active' : ''}`}>
              Profile
            </Link>
          </div>
        );
      case 'user':
        return (
          <div className="ml-6 flex space-x-4">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/dashboard/request" className={`nav-link ${isActive('/dashboard/request') ? 'active' : ''}`}>
              Request Service
            </Link>
            <Link to="/dashboard/settings" className={`nav-link ${isActive('/dashboard/settings') ? 'active' : ''}`}>
              Settings
            </Link>
          </div>
        );
      default:
        return (
          <div className="ml-6 flex space-x-4">
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              About
            </Link>
            <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>
              Services
            </Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
              Contact
            </Link>
          </div>
        );
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminData');
    setUserRole(null);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                Road Assist
              </Link>
            </div>
            {renderNavLinks()}
          </div>
          <div className="flex items-center">
            {!userRole ? (
              <div className="flex space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/provider/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Join as Provider
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}