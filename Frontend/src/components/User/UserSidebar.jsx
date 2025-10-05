import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Clipboard, User, LogOut, Shield, ClipboardList } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { text: 'All Tasks', icon: <Clipboard className="w-6 h-6" />, path: 'tasks' },
    { text: 'My Tasks', icon: <ClipboardList className="w-6 h-6" />, path: 'view-tasks' },
    { text: 'Profile', icon: <User className="w-6 h-6" />, path: 'profile' },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/user/logout`, { withCredentials: true });
      if (data.success) {
        window.location.href = '/';
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <Link to="/user-panel/tasks" className="text-2xl font-bold text-white">User Panel</Link>
        </div>
        <nav className="mt-4 flex-1">
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
        <div className="border-t border-gray-700">
          <NavLink
            to="/admin-panel/login"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? 'bg-gray-700 text-white' : ''
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <span className="mr-3"><Shield className="w-6 h-6" /></span>
            <span>Admin</span>
          </NavLink>
          <button
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={logout}
          >
            <span className="mr-3"><LogOut className="w-6 h-6" /></span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default UserSidebar;