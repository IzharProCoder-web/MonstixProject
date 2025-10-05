import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/User/UserSidebar';

const User = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <UserSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default User;