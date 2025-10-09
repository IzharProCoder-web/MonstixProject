import express from "express";
import {
  forgetPassword,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyOTP,
  updateTaskStatus,
  getUserTasks,
  checkAuth,
  updateProfile,
  getProfile,
  } from "../Controllers/userControllers.js";
import isAuthenticated from "../Middleware/auth.js";
  

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser, isAuthenticated);
userRouter.post("/forgot-password", forgetPassword,isAuthenticated);
userRouter.post("/verify-otp", verifyOTP, isAuthenticated);
userRouter.post("/reset-password", resetPassword, isAuthenticated);
userRouter.get("/get-users", getAllUsers, isAuthenticated);

userRouter.get("/check-auth", checkAuth, isAuthenticated);
userRouter.get("/get-tasks", getUserTasks, isAuthenticated);
userRouter.put("/update-task-status/:id", updateTaskStatus, isAuthenticated);

userRouter.put("/update-profile", updateProfile, isAuthenticated);
userRouter.get("/profile", getProfile, isAuthenticated);

export default userRouter;
