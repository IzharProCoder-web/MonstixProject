/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdVpnKey } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter a valid email");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4040/api/user/forgot-password",
        { email: formData.email },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        setIsOtpSent(true); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4040/api/user/verify-otp",
        { email: formData.email, otp: formData.otp },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/reset-password", { state: { email: formData.email } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
        onSubmit={isOtpSent ? verifyOTP : handleSubmitEmail}
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {isOtpSent
            ? "Enter the OTP sent to your email"
            : "Enter your email to receive an OTP"}
        </p>
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MdEmail size={20} className="text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            disabled={isOtpSent || isLoading} // Disable email input after OTP is sent
            required
          />
        </div>
        {isOtpSent && (
          <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <MdVpnKey size={20} className="text-gray-400" />
            <input
              type="text"
              name="otp"
              placeholder="OTP"
              className="border-none outline-none ring-0"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="mt-3 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : isOtpSent ? "Verify OTP" : "Send OTP"}
        </button>
        <p className="text-gray-500 text-sm mt-3 mb-11">
          Back to login?{" "}
          <Link to="/" className="text-indigo-500 hover:underline">
            click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;