import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './auth/AuthContext';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Services', href: '/#services' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link
              to="/"
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <Car className="relative h-8 w-8 text-primary-600 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="relative ml-2 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                RoadAssist
              </span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'text-gray-600 hover:text-primary-600 transition-colors duration-300',
                    'relative group'
                  )}
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </motion.div>
            ))}
            
            {user ? (
              <div className="relative group">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-primary-600 transition-colors duration-300" />
                </motion.div>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Link
                    to="/signin"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Link
                    to="/signup"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-300 text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}