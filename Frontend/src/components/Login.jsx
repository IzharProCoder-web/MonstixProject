import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md"; // Added React Icons
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {data} = await axios.post('http://localhost:4040/api/user/login', formData, { withCredentials: true });
      if(data.success){
        toast.success(data.message);
        setFormData({ email: "", password: "" });
        navigate('/user-panel/tasks');
        
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error("Login failed. Please try again.");

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
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Login</h1>
        <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          {/* Replaced SVG with React Icon */}
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
          {/* Replaced SVG with React Icon */}
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
        <div className="mt-4 text-left text-indigo-500">
          <Link to="/forget-password" className="text-sm" type="reset">
            Forget password?
          </Link>
        </div>
        <button
          type="submit"
          className="mt-3 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Login
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          Don't have an account?
          <Link to="/register" className="text-indigo-500 hover:underline">
            click here
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
