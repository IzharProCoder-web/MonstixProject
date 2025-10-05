import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Home, Users, UserCheck, Clipboard, Eye } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items based on requirements
  const navItems = [
    { text: 'Dashboard', icon: <Home className="w-6 h-6" />, path: 'dashboard' },
    { text: 'User Management', icon: <Users className="w-6 h-6" />, path: 'users' },
    { text: 'Task Assignment', icon: <Clipboard className="w-6 h-6" />, path: 'tasks/assign' },
    { text: 'Task Monitoring', icon: <Eye className="w-6 h-6" />, path: 'tasks/monitor' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <Link to="/admin-panel/dashboard" className="text-2xl font-bold text-white">
            Admin Panel
          </Link>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                  isActive ? 'bg-gray-700 text-white' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;