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
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-4 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Sign Up</h1>
        <p className="text-gray-500 text-sm mt-2">
          Please sign up to create an account
        </p>

        <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MdPerson size={20} className="text-gray-400" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border-none outline-none ring-0"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MdEmail size={20} className="text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MdLock size={20} className="text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border-none outline-none ring-0 w-full"
            required
          >
            <option value="User">Select Role</option>
            <option value="ProjectManger">Project Manager</option>
            <option value="FrontendDev">Frontend Developer</option>
            <option value="BackendDev">Backend Developer</option>
            <option value="Designer">Designer</option>
            <option value="Tester">Tester</option>
            <option value="SocialMedia Manager">Social Media Manager</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-3 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Sign Up
        </button>
        <p className="text-gray-500 text-sm mt-3 mb-11">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-500 hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
