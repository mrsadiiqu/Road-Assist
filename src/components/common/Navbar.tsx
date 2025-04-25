import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Car, Menu, X } from 'lucide-react';
import { roleManager, UserRole } from '../../lib/utils/roleManager';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  
  useEffect(() => {
    const checkRole = async () => {
      const role = await roleManager.getCurrentRole();
      setCurrentRole(role);
    };
    checkRole();
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { path: '/services', label: 'Services' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/providers', label: 'Providers' },
    { path: '/admin/requests', label: 'Requests' },
    { path: '/admin/payments', label: 'Payments' },
    { path: '/admin/support', label: 'Support' },
    { path: '/admin/settings', label: 'Settings' }
  ];

  const providerLinks = [
    { path: '/provider/dashboard', label: 'Dashboard' },
    { path: '/provider/requests', label: 'Requests' },
    { path: '/provider/earnings', label: 'Earnings' },
    { path: '/provider/profile', label: 'Profile' }
  ];

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/request', label: 'Request Service' },
    { path: '/dashboard/settings', label: 'Settings' }
  ];

  const renderLinks = () => {
    if (!user) return publicLinks;
    switch (currentRole) {
      case 'admin':
        return adminLinks;
      case 'provider':
        return providerLinks;
      case 'user':
        return userLinks;
      default:
        return publicLinks;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentRole(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-primary-600">TowVO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {renderLinks().map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {!user ? (
              <>
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
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              {renderLinks().map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {!user ? (
                <div className="space-y-1">
                  <Link
                    to="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/provider/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block pl-3 pr-4 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                  >
                    Join as Provider
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block pl-3 pr-4 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}