import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Car } from 'lucide-react';

export default function Navbar() {
  const { user, userRole, signOut } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  
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

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/request', label: 'Request Service' },
    { path: '/dashboard/settings', label: 'Settings' }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
            <Car className="relative h-8 w-8 text-primary-400 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold text-primary-600">Road Assist</span>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!user && publicLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(link.path)
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && userRole === 'admin' && adminLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(link.path)
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && userRole === 'user' && userLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
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

          <div className="flex items-center">
            {!user ? (
              <div className="space-x-4 relative">
                <Link
                  to="/signin"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md inline-flex items-center"
                >
                  Sign Up
                  <svg 
                    className={`w-4 h-4 ml-1 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/signup?type=user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Register as User
                    </Link>
                    <Link
                      to="/provider/onboarding"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Register as Provider
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}