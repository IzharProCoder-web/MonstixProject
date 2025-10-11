import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/user/profile`, { withCredentials: true });
        setUsername(data?.user?.username || '');
      } catch {
        setError('Failed to load user profile');
      }
    };
    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username && !password) {
      setError('Please provide at least one field to update');
      return;
    }

    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/api/user/update-profile`,
        { username, password },
        { withCredentials: true }
      );
      setSuccess(data.message);
      if (password) setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
          User Profile
        </h1>
        <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-6 text-center">
          Edit Your Profile
        </h2>
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center" role="status">
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="username"
              className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
            >
              <User className="w-5 h-5 mr-2 text-gray-500" aria-hidden="true" />
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md h-12 px-4 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
            >
              <Lock className="w-5 h-5 mr-2 text-gray-500" aria-hidden="true" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md h-12 px-4 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Enter new password"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              aria-label="Save profile changes"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;