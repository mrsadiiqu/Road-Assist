import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Clock, 
  Car, 
  Settings, 
  Bell,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';

const sidebarItems = [
  { 
    name: 'Overview', 
    icon: LayoutDashboard, 
    path: '/dashboard' 
  },
  { 
    name: 'Request Service', 
    icon: Car, 
    path: '/dashboard/request' 
  },
  { 
    name: 'Service History', 
    icon: Clock, 
    path: '/dashboard/history' 
  },
  { 
    name: 'Notifications', 
    icon: Bell, 
    path: '/dashboard/notifications' 
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    path: '/dashboard/settings' 
  }
];

export default function DashboardSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">RoadAssist</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg relative group',
                  isActive 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-50 rounded-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <Icon className="relative h-5 w-5" />
                <span className="relative font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={signOut}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}