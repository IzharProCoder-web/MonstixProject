import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar'; // Correct import path for Sidebar

const Admin = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;