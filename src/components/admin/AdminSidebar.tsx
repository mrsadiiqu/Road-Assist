import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, Settings, Car, CreditCard, 
  BarChart3, HelpCircle 
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/admin/providers', icon: Users, label: 'Service Providers' },
  { path: '/admin/requests', icon: Car, label: 'Service Requests' },
  { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
  { path: '/admin/support', icon: HelpCircle, label: 'Support' },
];

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary-600">Road Assist Admin</h1>
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
    </div>
  );
}