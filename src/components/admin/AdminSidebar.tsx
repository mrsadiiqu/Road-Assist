import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, Settings, Car, CreditCard, 
  BarChart3, HelpCircle, LogOut,
  MapPin
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/admin/providers', icon: Users, label: 'Service Providers' },
  { path: '/admin/requests', icon: Car, label: 'Service Requests' },
  { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { path: '/admin/stations', icon: MapPin, label: 'Stations' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
  { path: '/admin/support', icon: HelpCircle, label: 'Support' },
];

export default function AdminSidebar() {
  const { signOut } = useAuth();

  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary-600">TowVO Admin</h1>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={signOut}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}