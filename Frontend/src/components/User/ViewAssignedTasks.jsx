import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ViewAssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/user/get-tasks`, {
          withCredentials: true,
        });
        const tasksData = (response.data.tasks || []).map(task => ({
          ...task,
          _id: task._id || task.id,
        }));
        setTasks(tasksData);
        setLoading(false);
      } catch {
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    if (!taskId) {
      setError('Cannot update task: Invalid task ID');
      toast.error('Invalid task ID');
      return;
    }
    try {
      const { data } = await axios.put(`${BACKEND_URL}/api/user/update-task-status/${taskId}`, { status: newStatus }, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success('Task status updated successfully');
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        ));
      } else {
        setError('Failed to update task status');
        toast.error('Failed to update task status');
      }
    } catch (err) {
      setError(`Failed to update task status: ${err.response?.data?.message || err.message}`);
      toast.error(`Failed to update task status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <ClipboardList className="w-6 h-6 mr-2" /> My Assigned Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-4 text-left">Task Name</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Due Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{task.title}</td>
                    <td className="py-3 px-4">{task.description}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          task.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        disabled={!task._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAssignedTasks;