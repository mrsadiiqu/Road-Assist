import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

// Add to imports
import { useLocation } from 'react-router-dom';

export default function AdminLogin() {
  // Add location to get state
  const location = useLocation();
  const message = location.state?.message;
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First, sign in the user
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password
      });

      if (signInError) throw signInError;

      // Check if user has admin role in metadata
      if (authData.user?.user_metadata?.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Store the session data
      const sessionData = {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at,
        user: {
          ...authData.user,
          role: 'admin'
        }
      };

      // Store in localStorage
      localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
      localStorage.setItem('adminData', JSON.stringify(sessionData));

      // Set the session explicitly
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: authData.session!.access_token,
        refresh_token: authData.session!.refresh_token
      });

      if (sessionError) throw sessionError;

      // Force a session refresh
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) throw refreshError;

      // Update session data with refreshed session
      if (refreshedSession) {
        const updatedSessionData = {
          access_token: refreshedSession.access_token,
          refresh_token: refreshedSession.refresh_token,
          expires_at: refreshedSession.expires_at,
          user: {
            ...refreshedSession.user,
            role: 'admin'
          }
        };

        // Update localStorage with refreshed session
        localStorage.setItem('supabase.auth.token', JSON.stringify(updatedSessionData));
        localStorage.setItem('adminData', JSON.stringify(updatedSessionData));
      }

      // Navigate to dashboard
      navigate('/admin/dashboard', { 
        replace: true,
        state: { 
          isAdmin: true,
          adminId: authData.user.id
        }
      });

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Add success message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the admin dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                    "text-gray-900 placeholder-gray-400",
                    "transition-colors duration-200"
                  )}
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                    "text-gray-900 placeholder-gray-400",
                    "transition-colors duration-200"
                  )}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex justify-center items-center px-4 py-2 border border-transparent",
              "text-sm font-medium rounded-lg text-white bg-primary-600",
              "hover:bg-primary-700 focus:outline-none focus:ring-2",
              "focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}