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

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/forgot-password", forgetPassword);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/get-users", getAllUsers);

userRouter.get("/check-auth", checkAuth);
userRouter.get("/get-tasks", getUserTasks);
userRouter.put("/update-task-status/:id", updateTaskStatus);

userRouter.put("/update-profile", updateProfile);
userRouter.get("/profile", getProfile);

export default userRouter;
