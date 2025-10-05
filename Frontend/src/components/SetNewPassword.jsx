import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add reset password logic here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Reset Password</h1>
        <p className="text-gray-500 text-sm mt-2">Enter your email and new password</p>
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
            name="newPassword"
            placeholder="New Password"
            className="border-none outline-none ring-0"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MdLock size={20} className="text-gray-400" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border-none outline-none ring-0"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Reset Password
        </button>
        <p className="text-gray-500 text-sm mt-3 mb-11">
          Back to login?
          <Link to="/" className="text-indigo-500 hover:underline">
            click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;