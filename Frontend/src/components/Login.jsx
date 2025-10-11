import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        setEmail("");
        setPassword("");
        navigate('/user-panel/tasks');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10 transition-all duration-300"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-2"
        >
          Sign In
        </h1>
        <p className="text-gray-600 text-sm text-center mb-8 font-normal">
          Enter your credentials to continue
        </p>

        <div className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
          </div>
        </div>

        <div className="text-right mt-4">
          <Link
            to="/forget-password"
            className="text-sm text-indigo-600 hover:underline font-medium"
            aria-label="Forgot password"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-8 w-full h-12 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          aria-label="Sign in"
        >
          Sign In
        </button>

        <p className="text-gray-600 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;