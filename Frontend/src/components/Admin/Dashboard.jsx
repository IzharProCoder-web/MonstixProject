import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, Clipboard, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [taskData, setTaskData] = useState([]);

  const totalUser = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/user/get-users`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserCount(data.users.length);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const totalTasks = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/get-tasks`, {
        withCredentials: true,
      });

      if (data.success) {
        setTaskCount(data.tasks.length);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const completedTasks = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/admin/complete-tasks`,
        { withCredentials: true }
      );
      if (data.success) {
        setCompletedTaskCount(data.tasks.length);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchTaskData = async () => {
    try {
      const [pendingResponse, inProgressResponse, completedResponse] =
        await Promise.all([
          axios.get(`${BACKEND_URL}/api/admin/pending-tasks`, {
            withCredentials: true,
          }),
          axios.get(`${BACKEND_URL}/api/admin/inprogress-tasks`, {
            withCredentials: true,
          }),
          axios.get(`${BACKEND_URL}/api/admin/complete-tasks`, {
            withCredentials: true,
          }),
        ]);

      const taskData = [
        {
          name: "Pending",
          tasks: pendingResponse.data.success
            ? pendingResponse.data.tasks.length
            : 0,
        },
        {
          name: "In Progress",
          tasks: inProgressResponse.data.success
            ? inProgressResponse.data.tasks.length
            : 0,
        },
        {
          name: "Completed",
          tasks: completedResponse.data.success
            ? completedResponse.data.tasks.length
            : 0,
        },
      ];

      setTaskData(taskData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch task data");
    }
  };

  useEffect(() => {
    totalUser();
    totalTasks();
    completedTasks();
    fetchTaskData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Users className="w-10 h-10 text-blue-500 mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
            <p className="text-2xl font-bold text-gray-900">{userCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Clipboard className="w-10 h-10 text-green-500 mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total Tasks</h2>
            <p className="text-2xl font-bold text-gray-900">{taskCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <CheckCircle className="w-10 h-10 text-purple-500 mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Completed Tasks
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {completedTaskCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Task Status Overview
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
