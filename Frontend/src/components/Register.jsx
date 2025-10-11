import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/register`,
        formData
      );
      if (data.success) {
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "User",
        });
        toast.success("Registration successful! Please log in.");
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10 transition-all duration-300"
        aria-labelledby="signup-title"
      >
        <h1
          id="signup-title"
          className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-2"
        >
          Create Your Account
        </h1>
        <p className="text-gray-600 text-sm text-center mb-8 font-normal">
          Complete the form below to register
        </p>

        <div className="space-y-6">
          <div className="relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="flex items-center w-full bg-gray-50 border border-gray-300 rounded-md h-12 px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <MdPerson size={20} className="text-gray-500 mr-2" aria-hidden="true" />
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter username"
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                value={formData.username}
                onChange={handleChange}
                required
                aria-label="Username"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="flex items-center w-full bg-gray-50 border border-gray-300 rounded-md h-12 px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <MdEmail size={20} className="text-gray-500 mr-2" aria-hidden="true" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                value={formData.email}
                onChange={handleChange}
                required
                aria-label="Email address"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="flex items-center w-full bg-gray-50 border border-gray-300 rounded-md h-12 px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <MdLock size={20} className="text-gray-500 mr-2" aria-hidden="true" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                value={formData.password}
                onChange={handleChange}
                required
                aria-label="Password"
              />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <div className="flex items-center w-full bg-gray-50 border border-gray-300 rounded-md h-12 px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-transparent border-none outline-none text-gray-900 text-sm"
                required
                aria-label="Select role"
              >
                <option value="User">User</option>
                <option value="ProjectManager">Project Manager</option>
                <option value="FrontendDev">Frontend Developer</option>
                <option value="BackendDev">Backend Developer</option>
                <option value="Designer">Designer</option>
                <option value="Tester">Tester</option>
                <option value="SocialMediaManager">Social Media Manager</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full h-12 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          aria-label="Sign up"
        >
          Register
        </button>

        <p className="text-gray-600 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;