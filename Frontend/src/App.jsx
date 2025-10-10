import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyOtp from "./components/VerifyOtp";
import ResetPassword from "./components/SetNewPassword";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin";
import Dashboard from "./components/Admin/Dashboard";
import UserManagement from "./components/Admin/UserManagement";
import TaskAssignment from "./components/Admin/TaskAssignment";
import TaskMonitoring from "./components/Admin/TaskMonitoring";
import User from "./pages/User";
import TaskStatusUpdate from "./components/User/TaskStatusUpdate";
import ProfileManagement from "./components/User/ProfileManagement";
import AdminLogin from "./components/Admin/AdminLogin";
import ViewAssignedTasks from "./components/User/ViewAssignedTasks";
import Chating from "./components/Chating";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/admin/check-auth`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(data.success);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/admin-panel/login" replace />
  );
};

const UserProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/user/check-auth`, {
          withCredentials: true,
        });
        setIsAuthenticated(data.success);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/forget-password" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-panel/login" element={<AdminLogin />} />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="tasks/assign" element={<TaskAssignment />} />
          <Route path="tasks/monitor" element={<TaskMonitoring />} />
        </Route>
        <Route
          path="/user-panel"
          element={
            <UserProtectedRoute>
              <User />
            </UserProtectedRoute>
          }
        >
          <Route index element={<TaskStatusUpdate />} />
          <Route path="tasks" element={<TaskStatusUpdate />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="view-tasks" element={<ViewAssignedTasks />} />
          <Route path="chating" element={<Chating />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
