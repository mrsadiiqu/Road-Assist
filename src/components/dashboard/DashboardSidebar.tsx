import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Clock, 
  Car, 
  Settings, 
  Bell,
  LogOut,
  Users,
  DollarSign,
  User
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../../lib/utils/roleManager';

interface DashboardSidebarProps {
  userRole: UserRole;
}

const userSidebarItems = [
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
    name: 'Settings', 
    icon: Settings, 
    path: '/dashboard/settings' 
  }
];

const providerSidebarItems = [
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/provider/dashboard' 
  },
  { 
    name: 'Service Requests', 
    icon: Car, 
    path: '/provider/requests' 
  },
  { 
    name: 'Earnings', 
    icon: DollarSign, 
    path: '/provider/earnings' 
  },
  { 
    name: 'Profile', 
    icon: User, 
    path: '/provider/profile' 
  }
];

const adminSidebarItems = [
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/admin/dashboard' 
  },
  { 
    name: 'Providers', 
    icon: Users, 
    path: '/admin/providers' 
  },
  { 
    name: 'Service Requests', 
    icon: Car, 
    path: '/admin/requests' 
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    path: '/admin/settings' 
  }
];

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  const getSidebarItems = () => {
    switch (userRole) {
      case 'admin':
        return adminSidebarItems;
      case 'provider':
        return providerSidebarItems;
      case 'user':
        return userSidebarItems;
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">TowVO</span>
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