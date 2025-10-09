import express from "express";
import {
  adminLogin,
  adminLogout,
  checkAuth,
  completedTask,
  createTask,
  deleteTask,
  deleteUser,
  getAllTasks,
  inProgressTask,
  PendingTask,
  updateTask,
  updateUser,
} from "../Controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/admin-login", adminLogin);
adminRouter.get("/admin-logout", adminLogout);
adminRouter.get("/check-auth", checkAuth);
adminRouter.post("/create-task", createTask);
adminRouter.put("/update-task/:id", updateTask);
adminRouter.delete("/delete-task/:id", deleteTask);
adminRouter.get("/get-tasks", getAllTasks);
adminRouter.get("/complete-tasks", completedTask);
adminRouter.get("/inprogress-tasks", inProgressTask);
adminRouter.get("/pending-tasks", PendingTask);
adminRouter.put("/update-user/:id", updateUser);
adminRouter.delete("/delete-user/:id", deleteUser);

export default adminRouter;
